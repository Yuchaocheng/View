/*
* @file: webAuth.js
* @description: "实现各种认证方式：摘要、SessionV1、SessionV2"
* @author: wangzhihaiyf1
* @create:   2020-07-21 11:08:53
* @update: 2cv 021-05-30 20:27:05
*/
import {nodeValue, resolvePromise, encodeString, parseXmlFromStr, toHex} from '@util/utils';
// import Cookie from 'js-cookie';
import {getItem, setItem, removeItem} from '@libs/webSession';
import {decodeAES, decodeBase64, decodeRSA, encodeAES, encodeBase64, encodePwd, generateRSAPrivateKey, generateRSAPublicKey, getRSABits, md5, sha256} from '@/common/libs/encryption/secure';
import AjaxClient from './ajaxClient.js';

/*Basic认证：目前产品中已不使用，本模块不支持*/
// var AUTH_TYPE_BASIC = 1;
/*摘要认证：登录成功后，外部模块需要拿到用户名和密码，才能完成后续的交互（网页、插件、三方插件）*/
const AUTH_TYPE_DIGEST = 2;
/*Session认证第一版本：sessionid由设备生成，web登录后主动设置到cookie中，
 请求时携带cookie信息，设备从cookie读取sessionid校验；网页和插件可通过sessionid完成后续认证
 但插件的RTSP取流不支持sessionid认证，VLC插件也支持，所以外部模块还是需要拿到用户名和密码
 */
const AUTH_TYPE_SESSION_V1 = 3;
/*Session认证第二版本，sessionid由设备生成并置到cookie中，网页无法读取sessionid，
 网页交互时会携带cookie，设备从cookie读取sessionid校验；WEB插件和三方插件通过token完成认证*/
const AUTH_TYPE_SESSION_V2 = 4;

//请求类，登录过程中协议交互使用
class AuthRequest {
  /**
   * 初始化设备http交互信息，用于构造后续请求url
   * @author wangzhihaiyf1
   * @date   2020-07-21
   * @param  {[String]} hostName 设备ip
   * @param  {[String]} port 设备HTTP/HTTPS端口
   * @param  {[String]} protocol 交互协议，HTTP或HTTPS
   * @return {[null]}
   */
  initURL(hostName, port, protocol) {
    this.hostName = hostName ? hostName : location.hostname;
    this.port = port ? port : location.port;
    this.protocol = protocol ? protocol : location.protocol;
    this.uri = this.protocol + '//' + this.hostName + ':' + this.port;
  }

  /**
   * 发送请求
   * @author wangzhihaiyf1
   * @date   2020-07-21
   * @param  {String} szUrl 请求url
   * @param  {Object} options Ajax请求参数
   * @return {Object} promise
   */
  request(szUrl, options) {
    
    this.uri = this.uri ? this.uri : "";
    //如果url是相对路径，自动补全url，减少拼写
    return AjaxClient.submitRequest(szUrl.indexOf("http") === 0 ? szUrl : (this.uri + szUrl), options);
  }

  /**
   * 登录失败时调用，提取设备协议返回的错误信息
   * @author wangzhihaiyf1
   * @date   2020-07-21
   * @param  {Object} oXhrXml Ajax请求返回的xhr对象
   * @return {Object} 错误信息对象
   */
  getErrorInfo(oXhrXml) {
    return {
      statusCode: nodeValue(oXhrXml, "statusCode", "i") || nodeValue(oXhrXml, "statusValue", "i"),
      subStatusCode: nodeValue(oXhrXml, "subStatusCode"),
      statusString: nodeValue(oXhrXml, "statusString"),
      lockStatus: ("lock" === nodeValue(oXhrXml, "lockStatus")), //是否锁定
      retryLoginTime: nodeValue(oXhrXml, "retryLoginTime"), //剩余登录次数
      unlockTime: nodeValue(oXhrXml, "unlockTime", "i") //剩余解锁时间，单位秒
    };
  }

  /**
   * 登录成功时调用，提取设备协议返回的额外信息
   * @author wangzhihaiyf1
   * @date   2020-07-21
   * @param  {Object} oXhrXml Ajax请求返回的xhr对象
   * @return {Object} 登录后返回的数据对象
   */
  getExtraInfo(oXhrXml) {
    var oExtraInfo = {
      bRiskPsw: nodeValue(oXhrXml, "isRiskPassword", "b"), //当前密码是否是风险密码
      bSupportLoginTiming: nodeValue(oXhrXml, "isSupportLoginTiming", "b"), //是否设备未校时（前提是设备支持校时）
      bNormalUserInitialPassword: nodeValue(oXhrXml, "isNormalUserInitialPassword", "b"), //非管理员用户返回，非管理员用户为初始密码标志
      bNormalUserPasswordModified: nodeValue(oXhrXml, "isNormalUserPasswordModified", "b") //非管理员用户返回，非管理员用户密码已被管理员修改标志
    };
    
    if (nodeValue(oXhrXml, "isActivated")) { //是否已激活
      oExtraInfo.bActivated = nodeValue(oXhrXml, "isActivated", "b");
    } else {
      oExtraInfo.bActivated = true;
    }

    return oExtraInfo;
  }
}

let webRequest = new AuthRequest();

/*HikSessionV2认证*/
class AuthImplementationWebSessionV2 {
  initAuth() {
    this.retryTimes = 0;
    this.timeoutId && clearTimeout(this.timeoutId);
    this.bTimeout = false;
    this.isLogin = false;
  }

  noLogin() {
    //do nothing
  }

  login(oUser) {
    let szRandom = md5((new Date().getTime()).toString()).substring(0, 8); //协议要求传一个8位的随机串
    szRandom = ((parseInt(szRandom.replace("#", ""), 16)).toString()).substring(0, 8); //转换为10进制
    let oGetCap = webRequest.request("/ISAPI/Security/sessionLogin/capabilities", {
      type: 'GET',
      data: {
        username: oUser.name,
        random: szRandom
      },
      // queryObject: true,
      // processData: true,
      success: ({data}) => {
        return data;
      },
      error: (xmlDoc) => {
        oUser.fail && oUser.fail(webRequest.getErrorInfo(xmlDoc));
      }
    });

    let pass = oUser.password;

    return oGetCap.then(({data: xmlDoc}) => {
      let szSessionID = nodeValue(xmlDoc, "sessionID");
      //随机串
      let szChallenge = nodeValue(xmlDoc, "challenge");
      //迭代次数
      let iIterate = nodeValue(xmlDoc, "iterations", "i");
      let bIrreversible = nodeValue(xmlDoc, "isIrreversible", "b");
      let szSalt = nodeValue(xmlDoc, "salt");

      let iSessionIDVersion = nodeValue(xmlDoc, "sessionIDVersion", "i"); //session版本
      let bSessionIDValidLongTerm = nodeValue(xmlDoc, "isSessionIDValidLongTerm", "b"); // ID是否长期有效（true-长期有效，false或该字段不返回-非长期有效
      let szEncryptedPwd = encodePwd(pass, {
        challenge: szChallenge,
        userName: oUser.name,
        salt: szSalt,
        iIterate: iIterate
      }, bIrreversible);

      let szSessionXml = "<SessionLogin>";
      szSessionXml += "<userName>" + encodeString(oUser.name) + "</userName>";
      szSessionXml += "<password>" + szEncryptedPwd + "</password>";
      szSessionXml += "<sessionID>" + szSessionID + "</sessionID>";
      szSessionXml += "<isSessionIDValidLongTerm>" + bSessionIDValidLongTerm + "</isSessionIDValidLongTerm>";
      szSessionXml += "<sessionIDVersion>" + iSessionIDVersion + "</sessionIDVersion>";
      szSessionXml += "</SessionLogin>";

      return szSessionXml;
    }).then((data) => {
      return webRequest.request("/ISAPI/Security/sessionLogin?timeStamp=" + new Date().getTime(), {
        type: 'POST',
        data: data,
      }).then(({data: xmlDoc}) => {
        this.isLogin = true;
        this.heartBeat();
        oUser.succ && oUser.succ(webRequest.getExtraInfo(xmlDoc));
        return xmlDoc;
      }).catch(({data: xmlDoc}) => {
        oUser.fail && oUser.fail(webRequest.getErrorInfo(xmlDoc));
        return xmlDoc;
      });
    });
  }

  logout() {
    clearTimeout(this.timeoutId);
    return webRequest.request("/ISAPI/Security/sessionLogout", {
      type: 'PUT',
      success: () => {
        this.initAuth();
      },
      error: (xmlDoc) => {
        return xmlDoc;
      }
    });
  }

  heartBeat() {
    let that = this;
    clearTimeout(this.timeoutId);
    let szUrl = "/ISAPI/Security/sessionHeartbeat";
    let szMethod = "PUT";
    if (!this.bTimeout) {
      szUrl = "/ISAPI/System/deviceInfo";
      szMethod = "GET";
    }

    if (!this.isLogin) {
      return;
    }
    
    webRequest.request(szUrl, {
      type: szMethod,
      hideLoading: true,
      success: () => {
        //todo 清空失败次数
        that.retryTimes = 0;
        that.timeoutId = setTimeout(() => {
          that.heartBeat();
        }, 30000);
      },
      error: () => {
        that.timeoutId = setTimeout(() => {
          that.heartBeat();
        }, 30000);
      }
    });
  }

  clearHeartBeat() {
    clearTimeout(this.timeoutId);
  }

  getAuth() {
    return ""; //token值需要实时获取，不存储
  }

  setAuth() {
    this.isLogin = true;
  }

  /**
   * 更新认证信息，例如修改当前登录用户的用户名和密码
   * @author wangzhihaiyf1
   * @date   2020-11-12
   * @param  {[type]}   name     [description]
   * @param  {[type]}   password [description]
   * @return {[type]}            [description]
   */
  updateAuth() {
    // todo
  }

  setHeartBeat(bTimeout) {
    this.bTimeout = bTimeout;
    this.heartBeat();
  }

  async getPluginAuth() {
    let szToken = await this.getToken();
    let szAuth = encodeBase64(":::4:" + szToken);
    return szAuth;
  }

  //获取token值，需要实时获取
  getToken() {
    var szToken = "";
    return webRequest.request("/ISAPI/Security/token?format=json", {
      hideLoading: true,
      type: 'GET',
      success: (data) => {
        if (data && data.Token) {
          szToken = data.Token.value;
        }
        return szToken;
      }
    });
  }
}
/*认证方式基类*/
class AuthImplementation {
  setAuthType(iType) {
    if (this.oAuthImplementation && this.oAuthImplementation.clearHeartBeat) {
      this.oAuthImplementation.clearHeartBeat();
    }
    if (iType === AUTH_TYPE_DIGEST) {
      this.oAuthImplementation = new AuthImplementationDigest();
    } else if (iType === AUTH_TYPE_SESSION_V2) {
      this.oAuthImplementation = new AuthImplementationWebSessionV2();
    }
    // else {
    //   this.oAuthImplementation = new AuthImplementationWebSessionV1();
    // }

    this.oAuthImplementation.initAuth();
  }

  getAuthType() {
    // if (this.oAuthImplementation instanceof AuthImplementationDigest) {
    //   return AUTH_TYPE_DIGEST;
    // } else
    // if (this.oAuthImplementation instanceof AuthImplementationWebSessionV1) {
    //   return AUTH_TYPE_SESSION_V1;
    // } else 
    if (this.oAuthImplementation instanceof AuthImplementationWebSessionV2) {
      return AUTH_TYPE_SESSION_V2;
    }

    return AUTH_TYPE_DIGEST;
  }

  getUserInfo() {
    if (this.oAuthImplementation.getUserInfo) {
      return this.oAuthImplementation.getUserInfo();
    }
    return "";
  }

  noLogin(name) {
    if (!this.oAuthImplementation) {
      this.setAuthType(AUTH_TYPE_DIGEST);
    }
    this.oAuthImplementation.noLogin(name);
  }
  // authimp login
  login(name, password, cbSucc, cbFail) {
    let oXml = null;
    let oUserInfo = {
      name: name,
      password: password,
      succ: cbSucc,
      fail: cbFail,
      xml: oXml
    };
    let that = this;
    return new Promise((resolve, reject) => {
      let szRandom = md5((new Date().getTime()).toString()).substring(0, 8); //协议要求传一个8位的随机串
      szRandom = ((parseInt(szRandom.replace("#", ""), 16)).toString()).substring(0, 8); //转换为10进制

      webRequest.request('/ISAPI/Security/sessionLogin/capabilities', {
        type: 'GET',
        params: {
          username: name,
          random: szRandom
        }
      }).then(({data}) => {
        let szDevInfo = getItem("deviceInfo");
        if (szDevInfo) {
          let oDevice = JSON.parse(szDevInfo);
          if (oDevice && "hcp" === oDevice.platform && "lan" === oDevice.mode) {
            that.setAuthType(AUTH_TYPE_DIGEST);
            that.oAuthImplementation.login(oUserInfo).then((resdata) => {
              resolve(resdata);
            }, (resdata) => {
              reject(resdata);
            });
            return;
          }
        }
        oXml = data;
        let iSessionIDVersion = nodeValue(data, "sessionIDVersion", "i");
        if (iSessionIDVersion === 2) {
          that.setAuthType(AUTH_TYPE_SESSION_V2);
        } else {
          that.setAuthType(AUTH_TYPE_SESSION_V1);
        }
        oUserInfo.xml = oXml;
        that.oAuthImplementation.login(oUserInfo).then((data) => {
          resolve(data);
        }, (data) => {
          reject(data);
        });
      }).catch(() => {
        that.setAuthType(AUTH_TYPE_DIGEST);
        that.oAuthImplementation.login(oUserInfo).then((data) => {
          resolve(data);
        }, (data) => {
          reject(data);
        });
      });
    });
  }

  logout() {
    if (this.oAuthImplementation) {
      this.oAuthImplementation.logout();
    }
    return resolvePromise();
  }

  getAuth() {
    if (this.oAuthImplementation) {
      return this.oAuthImplementation.getAuth();
    }
    return '';
  }

  setAuth(szAuth) {
    this.oAuthImplementation.setAuth(szAuth);
  }

  setUserInfo(szUserInfo) {
    if (this.oAuthImplementation.setUserInfo) {
      this.oAuthImplementation.setUserInfo(szUserInfo);
    }
  }

  updateAuth(name, password) {
    this.oAuthImplementation.updateAuth(name, password);
  }

  setHeartBeat(bTimeout) {
    if (this.oAuthImplementation && this.oAuthImplementation.setHeartBeat) {
      return this.oAuthImplementation.setHeartBeat(bTimeout);
    }
  }

  async getPluginAuth() {
    if (this.oAuthImplementation) {
      return this.oAuthImplementation.getPluginAuth();
    }
    return '';
  }

  async getPluginAuthV2() {
    if (this.oAuthImplementation && this.oAuthImplementation.getPluginAuthV2) {
      return this.oAuthImplementation.getPluginAuthV2();
    }
    return '';
  }
}
/*WebAuth类*/
class WebAuth {
  constructor() {
    this.oAuthInfo = {
      isLogin: false, //是否已登录
      name: "", //用户名
      auth: "", //认证信息，不同认证类型信息不同
      szAESKey: "", //敏感信息加密key值
      oDeviceInfo: {
        ip: '',
        port: 80,
        protocol: 'http:'
      },
      authType: AUTH_TYPE_DIGEST
    };
    this.oSecurityCap = {
      isIrreversible: false, //是否支持密码不可逆
      salt: "", //盐值，敏感信息加密使用
      iMaxQANum: 3,  //支持配置的安全问题个数
      iSecurityVersion: 0, // 安全版本标识
      iKeyIterateNum: 0 // AES Key 产生 SHA256迭代次数
      
    };

    this.oAuthImplementation = new AuthImplementation();

    this.setRequestOptions();
  }

  //如果之前已经登录过，可以用已保存的认证信息来初始化（例如页面切换的时候）
  _init(bTimeout) {
    let szAuthInfo = getItem("authInfo");
    if (szAuthInfo) {
      this.oAuthInfo = JSON.parse(decodeBase64(szAuthInfo));
      this.oAuthImplementation.setAuthType(this.oAuthInfo.authType);
      this.oAuthImplementation.setAuth(this.oAuthInfo.auth);
      this.oAuthImplementation.setUserInfo(this.oAuthInfo.userInfo);
      this.oAuthImplementation.setHeartBeat(bTimeout);// 认证是否有超时机制（即页面长时间不操作，认证自动失效，回退到登录），只对Session2.0有效
    } else {
      this.reset();
    }
  }

  async registerDevice(hostName, port, protocol, bTimeout) {
    this._init(bTimeout);
    this.oAuthInfo.oDeviceInfo.ip = hostName;
    this.oAuthInfo.oDeviceInfo.port = port;
    this.oAuthInfo.oDeviceInfo.protocol = protocol;
    webRequest.initURL(hostName, port, protocol);
    if (this.oAuthInfo.isLogin) {
      await this._getSecurityCap(this.oAuthInfo.name).catch(() => {
        //do nothing
      });
    }
  }

  reset() {
    this.oAuthInfo.isLogin = false;
    this.oAuthInfo.authType = AUTH_TYPE_DIGEST;
    this.oAuthInfo.auth = "";
    this.oAuthInfo.szAESKey = "";
    this.oAuthInfo.name = "";
    this.oAuthInfo.userInfo = "";
    removeItem("authInfo");
  }

  isLogin() {
    return this.oAuthInfo.isLogin;
  }

  //ehome融合云登录使用
  noLogin(name, cbSuc, cbFail, oContext, aArgs) {
    this.oAuthImplementation.noLogin(name);
    var oAuthInfo = this.oAuthInfo;
    oAuthInfo.isLogin = true;
    oAuthInfo.name = name;
    oAuthInfo.auth = "";
    oAuthInfo.authType = this.oAuthImplementation.getAuthType();
    oAuthInfo.userInfo = this.oAuthImplementation.getUserInfo();
    //先获取下能力
    return new Promise((resolve) => {
      //获取能力成功
      oAuthInfo.szAESKey = this._strToAESKey('', name);
      //登录后保存认证信息供后续交互使用
      setItem("authInfo", encodeBase64(JSON.stringify(oAuthInfo)));
      var oAuth = {
        oAuthInfo: oAuthInfo
      };
      cbSuc && cbSuc.apply(oContext, [oAuth].concat(aArgs || []));
      resolve();
    });
  }
  // webauth login
  login(name, password, cbSuc, cbFail, oContext, aArgs) {
    let oAuthInfo = this.oAuthInfo;
    let promise = new Promise((resolve, reject) => {
      this.oAuthImplementation.login(name, password, (oLoginInfo) => { //登录成功
        oAuthInfo.isLogin = true;
        oAuthInfo.name = name;
        oAuthInfo.auth = this.oAuthImplementation.getAuth();
        oAuthInfo.authType = this.oAuthImplementation.getAuthType();
        oAuthInfo.userInfo = this.oAuthImplementation.getUserInfo();
        this._getSecurityCap(oAuthInfo.name).then(() => {
          oAuthInfo.szAESKey = this._strToAESKey(password, name);
          //登录后保存认证信息供后续交互使用
          setItem("authInfo", encodeBase64(JSON.stringify(oAuthInfo)));

          localStorage.setItem("authExchanger/" + this.oAuthInfo.oDeviceInfo.ip + ":" + this.oAuthInfo.oDeviceInfo.port, encodeBase64(JSON.stringify(oAuthInfo)));
          let oAuth = {
            oAuthInfo: oAuthInfo,
            oExtraInfo: oLoginInfo
          };
          cbSuc && cbSuc.apply(oContext, [oAuth].concat(aArgs || []));
          resolve();
        });
      }, (oErrorInfo) => { //登录失败
        removeItem("authInfo");
        cbFail && cbFail.apply(oContext, [oErrorInfo].concat(aArgs || []));
        reject(oErrorInfo);
      });
    });

    return promise;
  }

  logout(cbSuc, cbFail) {
    this.oAuthInfo.isLogin = false;
    return this.oAuthImplementation.logout().then(() => { //注销成功
      removeItem("authInfo");
      localStorage.setItem("authExchanger/" + this.oAuthInfo.oDeviceInfo.ip + ":" + this.oAuthInfo.oDeviceInfo.port, "{}");
      cbSuc && cbSuc();
    }, (oErrorInfo) => { //注销失败
      cbFail && cbFail(oErrorInfo);
    });
  }

  getAuthType() {
    return this.oAuthImplementation.getAuthType();
  }

  getAuthInfo() {
    if (!this.oAuthInfo.isLogin) {
      return null;
    }
    return this.oAuthInfo;
  }

  async updateAuth(name, password) {
    if (!this.oAuthInfo.isLogin) {
      return;
    }
    await this._getSecurityCap(name);
    this.oAuthImplementation.updateAuth(name, password);
    this.oAuthInfo.name = name;
    this.oAuthInfo.auth = this.oAuthImplementation.getAuth();
    this.oAuthInfo.szAESKey = this._strToAESKey(password, name);
    this.oAuthInfo.userInfo = this.oAuthImplementation.getUserInfo();
    setItem("authInfo", encodeBase64(JSON.stringify(this.oAuthInfo)));
    localStorage.setItem("authExchanger/" + this.oAuthInfo.oDeviceInfo.ip + ":" + this.oAuthInfo.oDeviceInfo.port, encodeBase64(JSON.stringify(this.oAuthInfo)));
  }

  //设置认证失效回调
  setRequestOptions(oOptions) {
    if (!oOptions) {
      AjaxClient.setOptions({
        401: () => {
          this.reset();
        }
      });
    } else {
      let ajaxOption = $.extend({}, oOptions);
      if (oOptions[401]) {
        ajaxOption[401] = function () {
          this.reset();
          oOptions[401]();
        };
      }
      // if (!this.oAuthInfo.isLogin) {
      //   oOptions['401'] && oOptions['401']();
      // }
      AjaxClient.setOptions(oOptions);
    }
  }

  async getPluginAuth() {
    return this.oAuthImplementation.getPluginAuth();
  }

  async getPluginAuthV2() {
    return this.oAuthImplementation.getPluginAuthV2();
  }

  getUserName() {
    return this.oAuthInfo.name;
  }

  //激活设备
  activeDevice(szPwd) {
    //计算激活需要使用的挑战串
    return this.encodeChallenge(szPwd, getRSABits(), false).then((pwd) => {
      var oData = parseXmlFromStr("<?xml version='1.0' encoding='UTF-8'?><ActivateInfo><password>" + pwd + "</password></ActivateInfo>");
      return this.request("/ISAPI/System/activate", {
        type: "PUT",
        data: oData,
        success: null
      });
    });
  }

  //计算挑战串
  encodeChallenge(aStr, iRSABits, bBase64Encode) {
    let iBits = iRSABits;
    if (!iRSABits) {
      iBits = getRSABits();
    }

    let szPassPhrase = new Date() + "";
    let szMattsRSAkey = generateRSAPrivateKey(szPassPhrase, iBits);
    let szPublicKeyString = generateRSAPublicKey(szMattsRSAkey);
    let szXml = "<?xml version='1.0' encoding='UTF-8'?><PublicKey><key>" + encodeBase64(szPublicKeyString) + "</key></PublicKey>";
    let oXmlDoc = parseXmlFromStr(szXml);
    return this.request("/ISAPI/Security/challenge", {
      type: "POST",
      data: oXmlDoc,
      success: function (xmlDoc) {
        let szDecryptionResult = decodeRSA(decodeBase64(nodeValue(xmlDoc, "key")), szMattsRSAkey);
        if (szDecryptionResult !== null) {
          let szKey;
          //let szEncryptPassword;
          var aResult = [];
          if (iBits === 256) {
            szKey = toHex(szDecryptionResult);
          } else {
            szKey = szDecryptionResult;
          }

          //szEncryptPassword = aes_encrypt(szDecryptionResult.plaintext.substring(0, 16), szKey, true) + aes_encrypt(oStr, szKey, true);
          let szCode = encodeAES(szDecryptionResult.substring(0, 16), szKey, "ecb");
          if (typeof aStr === "string") {
            return encodeBase64(szCode + encodeAES(bBase64Encode ? encodeBase64(aStr) : aStr, szKey, "ecb"));
          } else if ($.isArray(aStr)) {
            aStr.forEach((val) => {
              aResult.push(encodeBase64(szCode + encodeAES(bBase64Encode ? encodeBase64(val) : val, szKey, "ecb")));
            });
            return aResult;
          }
        }
      }
    });
  }

  //做一层封装，主要是根据认证类型，给请求添加认证信息
  request(szUrl, oOptions) {
    
    // if (this.oAuthImplementation.oAuthImplementation instanceof AuthImplementationWebSessionV1) {
      
    //   // let sessionId = this.oAuthImplementation.getAuth();
    //   // Cookie.set("WebSession", sessionId);
    // } 
    // else if (this.oAuthImplementation.oAuthImplementation instanceof AuthImplementationDigest) {
      
    //   let aInfo = decodeBase64(decodeAES(this.oAuthImplementation.getAuth(), md5('1234567'))).split(":");
    //   oOptions.username = aInfo[0];
    //   oOptions.password = aInfo[1];
    // }
    oOptions.iSecurityVersion = this.oSecurityCap.iSecurityVersion;
    return webRequest.request(szUrl, oOptions);
  }

  //获取安全信息协议（因为不能存密码，aeskey的生成只能在这里生成）
  _getSecurityCap(szUser) {
    let that = this;
    if (!this.oAuthInfo.isLogin) {
      return new Promise((res, rej) => rej());
    }
    let bUser = false;
    let data = null;
    if (szUser) {
      bUser = true;
      data = {
        username: szUser
      };
    }
    return this.request("/ISAPI/Security/capabilities", {
      queryObject: bUser,
      data: data,
      processData: true,
      type: "GET",
      success: (xmlDoc) => {
        that.oSecurityCap.iKeyIterateNum = nodeValue(xmlDoc, "keyIterateNum", "i");
        that.oSecurityCap.isIrreversible = nodeValue(xmlDoc, "isIrreversible", "b");
        that.oSecurityCap.salt = nodeValue(xmlDoc, "salt");
        let szSecurityVersion = nodeAttr(xmlDoc, "securityVersion", "opt");
        if (szSecurityVersion !== "") {
          let aSVer = szSecurityVersion.split(",");
          that.oSecurityCap.iSecurityVersion = parseInt(aSVer[aSVer.length - 1], 10);
        } else {
          that.oSecurityCap.iSecurityVersion = 0; // 信息不加密
        }

        if (that.oSecurityCap.iSecurityVersion) {
          that.oSecurityCap.bSptUserCheck = nodeValue(xmlDoc, "isSupportUserCheck", "b");
        }
      }
    });
  }
  // 根据字符串生成AES Key
  _strToAESKey(szPwd, szUsername) {
    //根据是否密码不可逆
    let getIrreversibleKey = (szKey, szUsername) => {
      let szEncodeKey = szKey;
      if (this.oSecurityCap.isIrreversible) {
        let szSalt = this.oSecurityCap.salt;
        return sha256(szUsername + szSalt + szKey);
      }
      return szEncodeKey;
    };

    var szAESKey = "";
    if (this.oSecurityCap.iKeyIterateNum > 0) {
      szAESKey = sha256(getIrreversibleKey(szPwd, szUsername) + "AaBbCcDd1234!@#$");
      /*SHA256(str + "AaBbCcDd1234!@#$")*/
      for (var i = 1; i < this.oSecurityCap.iKeyIterateNum; i++) {
        szAESKey = sha256(szAESKey);
      }
    }
    szAESKey = szAESKey && szAESKey.substring(0, 32);

    return szAESKey;
  }
}

export default new WebAuth();