/* eslint-disable */
import {getItem, removeItem} from '@libs/webSession';

import WebSdk from './request/websdk';
import {getProjectConfig, isSupportPlugin, resolvePromise, encodeString, nodeValue} from '@util/utils';
import i18n from "@/Common/static/i18n/index.js";
import Message from '@/common/js/utils/Message.js';
import {decodeAES, decodeBase64, decodeRSA, encodeAES, encodeBase64, encodePwd, generateRSAPrivateKey, generateRSAPublicKey, getRSABits, md5, sha256} from '@/common/libs/encryption/secure';
import _oWebAuth from './request/webAuth';
import DispatchUtils from '@/Portal/view/dispatch/Utils.js';
import store from "@/store/index.js";

class Common {
  constructor() {
    let oProjectConfig = getProjectConfig();
    this.iDeviceType = oProjectConfig.deviceType; //0-后端， 1-前端[目前没有能力区分，本地配置播放参数协议是否支持http]
    this.m_szHostName = location.hostname;
    // 問題：涉及插件相關操作，傳入URL，如果為客戶端本地IP會導致無法使用，為了方便替換，設計一個變量來區分URl
    // 后来发现m_szDispatchHostName 已经做好兼容了 所以直接用m_szDispatchHostName
    // 端口同理 把包放在42上 默认的是42的代理端口8090  所以要获取到设备的端口
    this.m_szDispatchHostName = this.getDispatchInfo('configIp');
    this.m_szDispatchPort = this.getDispatchInfo('port');
    this.aHandleCallback = [];
    // $.support.cors = true;
    this.m_iHttpPort = 80; // 默认80端口
    this.m_szHttpProtocol = location.protocol + '//';
    this.m_iHttpProtocal = 'http://' == this.m_szHttpProtocol ? 1 : 2;
    if (location.port != '') {
      this.m_iHttpPort = location.port;
    } else if (this.m_szHttpProtocol == 'https://') {
      this.m_iHttpPort = 443;
    }
    this.m_szPage = '';
    this.m_bSession = false; // 是否是Session认证
    this.m_szNamePwd = ''; // 用户名密码 （for web）
    this.m_szSessionId = ''; // Session id（for WEB）
    this.m_szPluginNamePwd = ''; //用户名密码（for Plugin）
    this.m_szPluginSessionId = ''; // Session id（for Plugin）
    this.m_szLanType = "";
    
    this.m_bAnonymous = false;// 是否为匿名登录

    //当前登录用户
    this.m_oLoginUser = {
      szName: '', //用户名
      szType: '', //类型: admin/operator/viewer(小写判断)
      szPwd: '',
      bGet: false
    };
    this.m_szDefaultPwd = '\x7F\x7F\x7F\x7F\x7F\x7F';

    this.m_bSessionValid = false;
    this.m_bTimegoutLogout = true;
    this.m_bSupportPlugin = isSupportPlugin();   // 是否支持插件
  }
  async init() {
    this.extendJQuery();
    this.initPageParams();
    let oProjectConfig = await getProjectConfig();
    this.iDeviceType = oProjectConfig.deviceType;
    if ("preview" === this.m_szPage || "playback" === this.m_szPage || "intelligentDisplay" === this.m_szPage) {
      this.m_bTimegoutLogout = false;
    }
    await WebSdk.registerDevice(this.m_szHostName, this.m_iHttpPort, location.protocol, this.m_bTimegoutLogout).catch(err => {
      console.log(err);
    });
    if (!_oWebAuth.isLogin() && "login" !== this.m_szPage) {
      this.goLogin();
      return;
    }

    // 去除backspace的返回上一页行为
    document.onkeypress = this.banBackSpace;
    document.onkeydown = this.banBackSpace;
    this.m_oLoginUser.bGet = false;
    this.initRequest();
    this.initUserSecurityTips();
    this.listenLogin();
  }
  //设置ajax和免登录
  initRequest() {
    let that = this;
    WebSdk.setRequestOptions({
      401: () => {
        that.sessionValid();
      }
    });
  }
  initUserSecurityTips() {
    setTimeout(() => {
      let bNormalUserInitialPassword = getItem("bNormalUserInitialPassword") === "true";
      let bNormalUserPasswordModified = getItem("bNormalUserPasswordModified") === "true";
      if (bNormalUserInitialPassword) {
        Message.info({
          message: i18n.t("changeInitPswTips") //提示信息
        });
        removeItem("bNormalUserInitialPassword");
      } else if (bNormalUserPasswordModified) {
        Message.info({
          message: i18n.t("pwdModifyTips") //提示信息
        });
        removeItem("bNormalUserPasswordModified");
      }
    }, 2000);
  }
  initPageParams() {
    this.m_szPage = "login";
    if (-1 !== location.hash.indexOf("login")) {
      this.m_szPage = "login";
    } else if (-1 !== location.hash.indexOf("preview")) {
      this.m_szPage = "preview";
    } else if (-1 !== location.hash.indexOf("playback")) {
      this.m_szPage = "playback";
    } else if (-1 !== location.hash.indexOf("download")) {
      this.m_szPage = "download";
    } else if (-1 !== location.hash.indexOf("application")) {
      this.m_szPage = "application";
    } else if (-1 !== location.hash.indexOf("intelligentDisplay")) {
      this.m_szPage = "intelligentDisplay";
    } else if (-1 !== location.hash.indexOf("config")) {
      this.m_szPage = "config";
    } else if (-1 !== location.hash.indexOf("operations")) {
      this.m_szPage = "operations";
    } else if (-1 !== location.hash.indexOf("heop")) {
      this.m_szPage = "heop";
    }
  }
  //初始化登录用户信息
  initLoginUserInfo() {
    let self = this;
    let bNoLogin = false;
    // let oDeviceInfo = getDeviceDispatchInfo();
    // if (oDeviceInfo) {
    //   // 融合云或ehome不通过登录页
    //   if ('ehome' === oDeviceInfo.mode || 'ezviz' === oDeviceInfo.mode) {
    //     bNoLogin = true;
    //   }
    // }
    if (self.m_oLoginUser.bGet) {
      return resolvePromise();
    }
    self.m_oLoginUser.szName = bNoLogin ? 'admin' : WebSdk.getUserName();
    self.m_oLoginUser.szPwd = '';
    return new Promise(resolve => {
      WebSdk.WSDK_GetDeviceConfig('user', null, {
        success: xmlDoc => {
          $(xmlDoc)
            .find('User')
            .each((index, elem) => {
              if (self.m_oLoginUser.szName === nodeValue(elem, 'userName')) {
                let szUserLevel = nodeValue(elem, 'userLevel');
                if ('Administrator' === szUserLevel) {
                  self.m_oLoginUser.szType = 'admin';
                } else if ('Operator' === szUserLevel) {
                  self.m_oLoginUser.szType = 'operator';
                } else if ('Viewer' === szUserLevel) {
                  self.m_oLoginUser.szType = 'viewer';
                }
              }
            });
          self.m_oLoginUser.bGet = true;
          resolve();
        },
        error: () => {
          if ('admin' === self.m_oLoginUser.szName) {
            self.m_oLoginUser.szType = 'admin';
          }
          self.m_oLoginUser.bGet = true;
          resolve();
        }
      });
    });
  }
  // 扩展JQuery，1.9版本以上$.browser对象去掉了
  extendJQuery() {
    if (!$.browser) {
      $.extend({
        browser: {}
      });
      (function () {
        var szUserAgent = navigator.userAgent.toLowerCase();
        // Useragent RegExp
        var rwebkit = /(webkit)[\x2f]([\w.]+)/;
        var ropera = /(opera)(?:.*version)?[\x2f]([\w.]+)/;
        var rmsie = /(msie) ([\w.]+)/;
        var rmsie2 = /(trident.*rv:)([\w.]+)/; // IE11
        var rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/;

        var match =
          rwebkit.exec(szUserAgent) ||
          ropera.exec(szUserAgent) ||
          rmsie.exec(szUserAgent) ||
          rmsie2.exec(szUserAgent) || // IE11
          (szUserAgent.indexOf('compatible') < 0 && rmozilla.exec(szUserAgent)) || [];

        if (match.length > 0 && match[1].indexOf('trident') > -1) {
          // IE11
          match[1] = 'msie';
        }

        if (match[1]) {
          $.browser[match[1]] = true;
          $.browser.version = match[2] || '';
        }

        // Deprecated, use jQuery.browser.webkit instead
        if ($.browser.webkit) {
          $.browser.safari = true;
        }
      })();
    }
  }
  //获取跳转的IP或端口信息
  getDispatchInfo(szType, szRouter) {
    return DispatchUtils.getDispatchInfo(szType, szRouter);
  }
  handleHelpUrl(szUrl, szType, fnCallback) {
    if (szType == 'set' && typeof fnCallback == 'function') {
      this.aHandleCallback.push(fnCallback);
    } else if (szType == 'get') {
      var iLen = this.aHandleCallback.length;
      try {
        for (var i = 0; i < iLen; i++) {
          szUrl = this.aHandleCallback[i](szUrl);
        }
      } catch (e) {
        //出错吧不处理
      }
      return szUrl;
    }
    return szUrl;
  }
  //判断设备文件是否存在(已登录)
  isDeviceFileExist(szUrl) {
    let bExist = false;
    return new Promise(resolve => {
      WebSdk.WSDK_GetDeviceConfig(
        'webPing', {
        cmd: szUrl
      }, {
        timeout: 2000,
        success: () => {
          bExist = true;
          resolve(bExist);
        },
        error: () => {
          bExist = false;
          resolve(bExist);
        }
      }
      );
    });
  }
  /*
   * description: 获取锁定错误信息
   * @ oXmlDoc: 包含错误信息的XML
   * @ bReset: 是否为重置密码相关锁定
   * @ bGuid: 是否为GUID方式
   * */
  getLockTips(oXmlDoc) {
    let szTips = '';
    let szLockStr = nodeValue(oXmlDoc, 'lockStatus'); //锁定状态
    let iLockTime = nodeValue(oXmlDoc, 'resLockTime', 'i'); //锁定时间-秒
    let iRetryLeft = nodeValue(oXmlDoc, 'retryTimes', 'i'); //剩余次数
    var szSubStatusCode = nodeValue(oXmlDoc, "subStatusCode"); //错误码
    try {
      if (oXmlDoc.lockStatus) {
        szLockStr = oXmlDoc.lockStatus; //锁定状态
        iLockTime = oXmlDoc.resLockTime; //锁定时间-秒
        iRetryLeft = oXmlDoc.retryTimes; //剩余次数
        szSubStatusCode = oXmlDoc.subStatusCode;
      }
    } catch (e) {
      //console.log(e);
    }
    let bLocked = 'locked' === szLockStr;
    if (bLocked) {
      //用户被锁定
      let szLockTime;
      if (iLockTime < 60) {
        szLockTime = i18n.t('seconds');
      } else {
        iLockTime = Math.ceil(iLockTime / 60);
        szLockTime = i18n.t('minute');
      }
      if(szSubStatusCode==='maxPasswordAttempts'){
        szTips = i18n.tExtend("maxPasswordAttempts", [iLockTime, szLockTime]);
      }else{
        szTips = i18n.tExtend('userLock', [iLockTime, szLockTime]);
      }
    } else if ('unlock' === szLockStr) {
      //未被锁定，提示xxx次后锁定
      szTips = i18n.t("adminPwdError") + i18n.tExtend('lockTimeTips', [iRetryLeft]);
    }
    return {
      bLocked: bLocked,
      szTips: szTips
    };
  }
  setSecurityQA(aQAList, szPwd, oResponse, cb, bShowSuccessTip) {
    let self = this;
    let aIdArray = [];
    let szXml = "<?xml version='1.0' encoding='UTF-8'?><SecurityQuestion><QuestionList>";
    for (let i = 0, iMax = _oWebAuth.oSecurityCap.iMaxQANum; i < iMax; i++) {
      if (i && $.inArray(aQAList[i].szId, aIdArray) > -1) {
        Message.error({
          message: i18n.t("sameSQAnswerTips")
        });

        return false;
      }
      szXml += '<Question><id>' + aQAList[i].szId + '</id><answer>' + encodeString(aQAList[i].szAnswer) + '</answer></Question>';
      aIdArray.push(aQAList[i].szId);
    }
    szXml += '</QuestionList>';
    szXml += '<password>' + encodeString(szPwd) + '</password>';
    szXml += '</SecurityQuestion>';
    WebSdk.WSDK_SetDeviceConfig('questionInfoList', null, {
      data: szXml,
      success: () => {
        if (bShowSuccessTip) {
          Message.success({
            message: i18n.t("saveSucceeded")
          });
        }
        if ('function' === typeof cb) {
          cb();
        }
      },
      error: (xmlDoc, xhr) => {
        let oLockTips = self.getLockTips(xmlDoc);
        if (oLockTips.szTips) {
          Message.error({
            message: oLockTips.szTips
          });
        } else {
          if (!!oResponse.saveState(xhr, "", undefined, true)) {
            Message.error({
              message: oResponse.saveState(xhr, "", undefined, true)
            });
          }
        }
      }
    });
  }
  async exportGuid(szPwd, oPlugin, oResponse) {
    let self = this;
    let szUrl = self.m_szHttpProtocol + self.m_szHostName + ':' + self.m_iHttpPort + '/ISAPI/Security/GUIDFileData';
    let szIv = md5(new Date().getTime().toString());
    szUrl = WebSdk.getSecurityUrl(szUrl, szIv);
    let szEncriptedPwd = encodeAES(encodeBase64(encodeString(szPwd)), _oWebAuth.oAuthInfo.szAESKey, szIv);
    let szXml = "<?xml version='1.0' encoding='UTF-8'?><LoginPassword><password>" + szEncriptedPwd + '</password></LoginPassword>';
    let szAuth = await WebSdk.getPluginAuth();
    oPlugin.exportFile(szUrl, szAuth, 2, szXml, 0).then(
      oResult => {
        if (0 === oResult.statusCode) {
          Message.success({
            message: i18n.t("exportOK")
          });
        } else if (1 === oResult.statusCode) {
          //文件路径为空：取消导出
          return;
        }
      },
      result => {
        //chrome高版本下测试发现本地服务，返回的状态码有问题所以兼容处理一下，否则管理员密码错误的情况下，直接连提示都没有
        let szTip = i18n.t('exportFailed');
        let oLockTips = {};
        if (result && result.responseXML) {
          oLockTips = self.getLockTips(result.responseXML);
          if (oLockTips.szTips) {
            szTip = oLockTips.szTips;
          }
        }
        Message.error({
          message: szTip
        });
      }
    );
  }
  //更新web认证信息
  updateWebAuth(szUserName, szPwd) {
    _oWebAuth.updateAuth(szUserName, szPwd);
  }
  //  设置安全邮箱
  setSecurityEmail(szEmailAddress, szPwd, oResponse, cb, bShowSuccessTip) {
    let self = this;
    if (!szEmailAddress) {
      return;
    }
    let oJson = {
      SecurityEmail: {
        SecurityInformation: [{
          emailAddress: szEmailAddress
        }],
        password: encodeString(szPwd)
      }
    };
    WebSdk.WSDK_SetDeviceConfig('setSecurityEmail', null, {
      dataType: 'JSON',
      data: oJson,
      success: (oJson, xhr) => {
        if (bShowSuccessTip) {
          Message.success({
            message: i18n.t("saveSucceeded")
          });
        }
        if ('function' === typeof cb) {
          cb();
        }
      },
      error: (oJson, xhr) => {
        let oLockTips = {};
        if (oJson) {
          oLockTips = self.getLockTips(oJson);
        } else if (xhr.responseXML) {
          oLockTips = self.getLockTips(xhr.responseXML);
        }
        if (oLockTips.szTips) {
          Message.error({
            message: oLockTips.szTips
          });
        } else {
          Message.error({
            message: oResponse.saveState(xhr, "", undefined, true)
          });
        }
      }
    });
  }
  //获取设备语言
  getDeviceLanguage() {
    return WebSdk.WSDK_GetDeviceConfig("language", null, {
      success: xmlDoc => {
        if ("chinese" === $(xmlDoc).find("Language").eq(0).find("type").eq(0).text()) {
          this.m_szLanType = "zh";
        } else {
          this.m_szLanType = "en";
        }
      }
    });
  }

  sessionValid() {
    let that = this;
    if (this.m_bSessionValid) {
      return;
    }
    if (-1 !== location.hash.indexOf("login")) {
      return;
    }
    if (-1 !== location.hash.indexOf("pwdReset")) {
      return;
    }
    this.m_bSessionValid = true;
    WebSdk.logout();
    setTimeout(function () {
      localStorage.setItem("authExchanger/" + that.m_szHostName + ":" + that.m_iHttpPort, "{}");
      that.goLogin();
    }, 3000);

    Message.alert(i18n.t('goLoginPageTip'), i18n.t("errorInfo"), {
      size: 'middle',
      type: 'error',
      onConfirm: () => {
        localStorage.setItem("authExchanger/" + that.m_szHostName + ":" + that.m_iHttpPort, "{}");
        that.goLogin();
      }
    });
  }

  //设置监听事件
  listenLogin() {
    let self = this;
    let szAuthExchanger = "authExchanger/" + self.m_szHostName + ":" + self.m_iHttpPort;
    let szAuthTrigger = "authTrigger/" + self.m_szHostName + ":" + self.m_iHttpPort;
    let storageFun = function (event) {
      if (!event.newValue) {
        return;
      }
      if (event.newValue === event.oldValue) { // ie下同一个key的值不变也会触发监听，导致页面卡死，所有这里进行判断防止页面卡死
        return;
      }
      if (event.key == szAuthTrigger) {
        if (self.m_szPage !== "login") {
          let szAuthObj = sessionStorage.getItem("authInfo");
          localStorage.setItem(szAuthExchanger, szAuthObj);
          //localStorage里内容仅存放100毫秒
          setTimeout(function () {
            localStorage.removeItem(szAuthExchanger);
          }, 100);
        }
      } else if (event.key == szAuthExchanger) {
        if (event.newValue !== "{}") {
          let szAuthObj = sessionStorage.getItem("authInfo");
          let oAuthJson = JSON.parse(decodeBase64(event.newValue));
          if (oAuthJson.isLogin) {
            if (szAuthObj !== event.newValue) {
              sessionStorage.setItem("authInfo", event.newValue);
              if (self.m_szPage === "login") {
                window.location.href = "./index.html#/preview?t=" + Date.now();
                store.commit('UPDATE_ROUTE', '/preview');  // 更新全局路由数据
              } else {
                window.location.reload();
              }
            }
          } else {
            sessionStorage.removeItem("authInfo");
            if (self.m_szPage !== "login") {
              self.goLogin();
            }
            return;
          }
        } else {
          sessionStorage.removeItem("authInfo");
          if (self.m_szPage !== "login") {
            self.goLogin();
          }
          return;
        }
      }
    };
    //兼容性
    if ($.browser.msie && parseInt($.browser.version, 10) < 9) {
      window.onstorage = storageFun;
    } else {
      window.addEventListener("storage", storageFun, false);
    }
    try {
      if (localStorage.getItem(szAuthExchanger)) {
        localStorage.removeItem(szAuthExchanger);
      }
      //设置触发监听的变量
      let now = Date.now || function () {
        return new Date().getTime();
      };
      if (self.m_szPage === "login") {
        localStorage.setItem(szAuthTrigger, now());
      }
    } catch (e) {
      //...
    }
  }
  getToken() {
    //session2.0不保存密码，认证信息需要用token，从设备获取
    var szToken = "";
    WebSDK.WSDK_GetDeviceConfig("tokenInfo", null, {
      async: false,
      success: function (status, oData) {
        if (oData && oData.Token) {
          szToken = oData.Token.value;
        }
      }
    });
    return szToken;
  }

  //获取第三方插件的认证信息
  getOtherPluginAuth () {
    var oAuthInfo = _oWebAuth.getAuthInfo();
    var iAuthType = oAuthInfo.authType; //认证类型
    var szAuth = "";
    if (iAuthType === 2) {
        //摘要
        szAuth = oAuthInfo.userInfo;
    } else if (iAuthType === 3) {
        szAuth = oAuthInfo.auth;
    } else if (iAuthType === 4) {
        szAuth = getToken();
    }
    function getToken() {
        //session2.0不保存密码，认证信息需要用token，从设备获取
        var szToken = "";
        WebSdk.WSDK_GetDeviceConfig("tokenInfo", null, {
            async: false,
            success: function (status, oData) {
                if (oData && oData.Token) {
                    szToken = oData.Token.value;
                }
            }
        });
        return szToken;
    }
    return szAuth;
  }

  getUrlWithToken(szUrl, szToken) {
    let oAuthInfo = _oWebAuth.getAuthInfo();
    if (oAuthInfo.bSupportSessionTag) {
      if (!szToken) {
        szToken = this.getToken();
      }
      var index = szUrl.indexOf("token");
      if (index !== -1) {
        szUrl = szUrl.substring(0, index - 1);
      }
      if (szUrl.indexOf("?") >= 0) {
        szUrl += "&token=" + szToken;
      } else {
        szUrl += "?token=" + szToken;
      }
    }
    return szUrl;
  }
  goLogin() {
    window.location.href = "/doc/index.html#/portal/login";
    store.commit('UPDATE_ROUTE', 'portal/login');  // 更新全局路由数据
    window.location.reload();
  }

  // 4.0代码common.js文件里的
  banBackSpace(e) {
    //获取event对象
    var ev = e || window.event;
    //获取事件源
    var oTemp = ev.target || ev.srcElement;
    //获取事件源类型
    var szType = oTemp.type || oTemp.getAttribute('type');

    //获取作为判断条件的事件类型
    var bReadOnly = oTemp.readOnly;
    var bDisabled = oTemp.disabled;

    //处理undefined值情况
    bReadOnly = (bReadOnly == undefined) ? false : bReadOnly;
    bDisabled = (bDisabled == undefined) ? true : bDisabled;

    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
    //并且readOnly属性为true或disabled属性为true的，则退格键失效
    var bFlag1 = ev.keyCode === 8 && (szType === "password" || szType === "text" || szType === "textarea") && (bReadOnly === true || bDisabled === true);

    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var bFlag2 = ev.keyCode === 8 && szType !== "password" && szType !== "text" && szType !== "textarea";

    // 光标移动到最后，解决默认密码选中状态下，Backspace键按下，在IE8/IE11浏览器会自动退回到上一个页面的问题。
    var oObj = $(e.target).get(0);
    var iLen = $(e.target).val().length;
    if (document.selection) {
      var oSel = oObj.createTextRange();
      oSel.moveStart('character', iLen);
      oSel.collapse();
      oSel.select();
      // oObj.selectionStart === 0 && oObj.selectionEnd === 0 用来防止普通的input框全选删除无法全删问题的出现
    } else if (typeof oObj.selectionStart == 'number' && typeof oObj.selectionEnd == 'number' && oObj.selectionStart === 0 && oObj.selectionEnd === 0) {
      oObj.selectionStart = oObj.selectionEnd = iLen;
    }
    
    //判断
    if (bFlag1 || bFlag2) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false; //IE
        return false;
      }
    }
  }
}
let common = new Common();
export default common;
/* eslint-disable */