/*
* @file: websdk.js
* @description: "file description"
* @author: wangzhihaiyf1
* @create:   2020-07-21 11:09:12
* @update: 2021-05-27 18:23:45 
*/
import WebAuth from './webAuth';
import { encodeAES, encodeBase64, md5, sha256} from '@/common/libs/encryption/secure';
import CGI from './isapi.js';
import {encodeString} from '@util/utils';
class WebSdk {
  constructor() {
    this.oCombinedResult = {
      bSet: false,
      cachePromise: []
    };
    this.oSecurityCap = WebAuth.oSecurityCap;
    this.iAnalogChannelNum = 0; //模拟通道数
    this.iAnalogAlarmOutputNum = 0; // 模拟输出口数
    this.iAnalogAlarmInputNum = 0; // 模拟输入口数
    this.bSupportIOOutputUnify = false;
    this.oDeviceInfo = {
      hostName: location.hostname,
      protocol: location.protocol + "//",
      port: location.port
    };
  }
  resetLoginInfo() {
    WebAuth.reset();
  }

  async registerDevice(szHostName, iPort, szProtocol, bTimeout) {
    let getChannelInfo = () => {
      return this.request('GET', 'AnalogChannelInfo', {}, {
        success: (xmlDoc) => {
          this.iAnalogChannelNum = parseInt($(xmlDoc).find("VideoInputChannel").length, 10);
        }
      });
    };
    let getOutputInfo = () => {
      return this.request('GET', 'AnalogAlarmOutputInfo', {}, {
        success: (xmlDoc) => {
          this.iAnalogAlarmOutputNum = $(xmlDoc).find("IOOutputPort").length;
          // 支持 IO输出口统一返回
          if ($(xmlDoc).find("IOType").length) {
            this.bSupportIOOutputUnify = true; // 支持输出口统一
          }
        }
      });
    };
    let getInputInfo = () => {
      return this.request('GET', 'AnalogAlarmInputInfo', {}, {
        success: (xmlDoc) => {
          this.iAnalogAlarmInputNum = $(xmlDoc).find("IOInputPort").length;
        }
      });
    };
    this.oDeviceInfo.hostName = szHostName;
    this.oDeviceInfo.port = iPort;
    this.oDeviceInfo.protocol = szProtocol + "//";
    await WebAuth.registerDevice(szHostName, iPort, szProtocol, bTimeout).catch(err => {
      console.log(err);
    });
    if (WebAuth.isLogin()) {
      getChannelInfo();
      getOutputInfo();
      getInputInfo();
    }
  }


  login(name, password, cbSucc, cbFail, oContext, aArgs) {
    debugger
    return WebAuth.login(name, password, cbSucc, cbFail, oContext, aArgs);
  }

  noLogin(name, cbSucc, cbFail, oContext, aArgs) {
    return WebAuth.noLogin(name, cbSucc, cbFail, oContext, aArgs);
  }

  logout() {
    return WebAuth.logout();
  }

  isLogin() {
    return WebAuth.isLogin();
  }

  activeDevice(szPass) {
    return WebAuth.activeDevice(szPass);
  }
  //  处理插件URL带上安全版本参数
  getSecurityUrl(szUrl, szIv) {
    let iSecurityVersion = this.oSecurityCap.iSecurityVersion;
    if (iSecurityVersion > 0) {
      szIv = szIv ? szIv : md5((new Date().getTime()).toString());
      if (-1 !== szUrl.indexOf("?")) {
        szUrl += "&security=" + iSecurityVersion + "&iv=" + szIv + "&key=" + WebAuth.getAuthInfo().szAESKey;
      } else {
        szUrl += "?security=" + iSecurityVersion + "&iv=" + szIv + "&key=" + WebAuth.getAuthInfo().szAESKey;
      }
    }
    return szUrl;
  }

  checkVerificationCode(szVerificationCode) {
    let szIv = md5((new Date().getTime()).toString());
    let szKey = sha256(szIv + szVerificationCode);
    szVerificationCode = encodeBase64(szKey);
    let szXml = "<?xml version='1.0' encoding='UTF-8'?>";
    szXml += "<CheckInfo><randomString>" + szIv + "</randomString>";
    szXml += "<verificationCode>" + szVerificationCode + "</verificationCode>";
    szXml += "</CheckInfo>";
    return szXml;
  }

  /**
   * 敏感信息加密
   * @author wangzhihaiyf1
   * @date   2020-08-17
   * @param  {String}   szStr 需要加密的字符串
   * @return {Object}         加密后的信息对象，结构如下
   * {
   *   szEncodeStr: "",
   *   iSecurityVersion: 1,
   *   szIV: "",
   *   szAESKey: ""
   * }
   */
  encodeAES(szStr) {
    let szIv = md5((new Date().getTime()).toString());
    let szEncryptPwd = encodeAES(encodeBase64(encodeString(szStr)), WebAuth.getAuthInfo().szAESKey, szIv);

    return {
      szEncodeStr: szEncryptPwd,
      iSecurityVersion: this.oSecurityCap.iSecurityVersion,
      szIV: szIv,
      szAESKey: WebAuth.getAuthInfo().szAESKey
    };
  }
  axios (options) {
    if (!options) {
      options = {};
    }
    if (!options.oParam) {
      options.oParam = null;
    }
    // let httpType = "GET";
    return this.request( options.type || "GET", options.cmd, options.oParam, options);
  }
  /**
   * 获取请求信息
   * @param {string} command 请求命令 必传
   * @param {object} oParam 请求参数 可选
   * @param {object} options ajax请求的属性 可选
   * @constructor
   */
  WSDK_GetDeviceConfig(command, oParam, options) {
    if (!options) {
      options = {};
    }
    if (!oParam) {
      oParam = null;
    }
    let httpType = "GET";
    return this.request(httpType, command, oParam, options);
  }

  /**
   * 获取请求信息
   * @param {string} command 请求命令 必传
   * @param {object} oParam 请求参数 可选
   * @param {object} options ajax请求的属性 可选
   * @constructor
   */
  WSDK_GetDeviceConfigResolve(command, oParam, options) {
    if (!options) {
      options = {};
    }
    if (!oParam) {
      oParam = null;
    }
    let httpType = "GET";
    return this.request(httpType, command, oParam, options).catch(()=> {
      //空函数
    });
  }
  /**
     * 获取版本安全信息
     * @param {string} command 请求命令 必传
     * @param {object} oParam 请求参数 可选
     * @param {object} options ajax请求的属性 可选
     * @constructor
     */
  WSDK_GetSecurityVersion(command, oParam, options) {
    if (!options) {
      options = {};
    }
    if (!oParam) {
      oParam = null;
    }
    let httpType = "GET";
    return this.request(httpType, command, oParam, options);
  }

  //缓存获取的XHR, 通过URL区分，如果要更新可以设置最后位进行强制刷新
  WSDK_GetDeviceConfigCache(command, oParam, options, bUpdate) {
    let oCacheOptions = {
      cacheResult: {
        cache: true, //缓存标志位
        bUpdate: !!bUpdate //更新标志位
      }
    };
    $.extend(oCacheOptions, options);
    return this.WSDK_GetDeviceConfig(command, oParam, oCacheOptions);
  }

  /**
   * 配置或删除的请求
   * @param {string} Command 请求命令
   * @param {object} oParam 请求参数
   * @param {object} options ajax请求的属性
   * @constructor
   */
  WSDK_SetDeviceConfig(Command, oParam, options) {
    if (!options) {
      options = {};
    }
    if (!oParam) {
      oParam = null;
    }

    let httpType = "PUT";

    return this.request(httpType, Command, oParam, options);
  }


  //用于保存多个参数时仅显示错误的信息或者全成功时进行成功提示
  //传入的参数为单个函数，函数可以是async函数，在函数中顺序执行的参数设置方法会被加入一个promise列表，
  //待所方法完成后进行提示
  async setSaveGroup(func) {
    //清空promise队列
    this.oCombinedResult.cachePromise.length = 0;
    //设置标志位，之后的设置方法就会都自动加入队列
    this.oCombinedResult.bSet = true;
    //调用传入的设置参数函数
    try {
      await func();
    } catch (e) {
      //to do
    }
    //完成后进行提示，then成功回调，catch失败回调
    let oFin = Promise.all(this.oCombinedResult.cachePromise).then(() => {
      // let curzhr = xhr;
      // $.each(xhr, (i, val) => {
      //   if (xhr && $(xhr.responseXML).find("statusCode").eq(0).text() === "7") { //更改网络模式需要重启
      //     curzhr = val;
      //     return false;
      //   }
      // });
    }).catch(() => {
      // todo
    });
    //完成了重置标志位
    this.oCombinedResult.bSet = false;
    return oFin;
  }

  setRequestOptions(oOptions) {
    WebAuth.setRequestOptions(oOptions);
  }

  async getPluginAuth() {
    return WebAuth.getPluginAuth();
  }

  /**
   * 获取原始的用户名和密码，只SessionV1用到，UDP取流
   * @author wangzhihaiyf1
   * @date   2021-04-24
   * @return {[type]}   [description]
   */
  async getPluginAuthV2() {
    return WebAuth.getPluginAuthV2();
  }

  updateAuth(name, password) {
    return WebAuth.updateAuth(name, password);
  }

  getUserName() {
    return WebAuth.getUserName();
  }

  generateUrl(szUrl) {
    let result = szUrl;
    try {
      if (typeof (window.rewriteRequestUrl || (opener && opener.rewriteQuestUrl) || top.rewriteQuestUrl) === "function") {
        let szHandleUrl = (window.rewriteRequestUrl || (opener && opener.rewriteQuestUrl) || top.rewriteQuestUrl)(szUrl);
        if (szHandleUrl) {
          result = szHandleUrl;
        }
      }
    } catch (e) {
      //console.log(e);
    }
    return result;
  }

  //替换URL中的%s
  formatString(...params) {
    let url = params[0];
    for (let i = 1; i < params.length; i++) {
      if (params[i] !== "") {
        url = url.replace("%s", params[i]);
      } else {
        url = url.replace("/%s", "");
      }
    }
    return url;
  }

  checkCommand(command, options) {
    //判断这个名字是否在CGI命令对象中
    if (!(command in CGI)) {
      this.callUserFun(null, options);
      return false;
    }
    return true;
  }

  //仅会在错误的情况下进入
  callUserFun(xmlDoc, options) {
    if (!options) {
      return;
    }
    if (!xmlDoc) {
      xmlDoc = '';
    }
    if (typeof options.error === "function") {
      options.error(xmlDoc);
    }
    if (typeof options.complete === "function") {
      options.complete(xmlDoc);
    }
  }


  // 调request方法
  request(httpType, szCommand, oCommandParam, oAJaxOption) {
    if (!this.checkCommand(szCommand, oAJaxOption)) {
      this.callUserFun(null, oCommandParam);
      return null;
    }
    //该接口要适应所有URL，可能会变化，所以参数不能写死
    let oCGI = CGI[szCommand]; 
    let oParam = oCommandParam;
    let options = oAJaxOption;

    // ajaxClient中使用
    oAJaxOption.command = szCommand;

    //如果CGI命令需要的参数在用户传入的参数中找不到，则返回失败
    if (typeof oCGI.req !== "undefined") {
      for (let i = 0; i < oCGI.req.length; i++) {
        if (!(oCGI.req[i] in oParam)) {
          this.callUserFun(null, options);
          return null;
        }
      }
    }
    

    // 确定 type 类型
    if (!oAJaxOption['type']) {
      if (oCGI.method) {
        oAJaxOption['type'] = oCGI["method"];
      } else {
        oAJaxOption['type'] = httpType;
      }
    }

    //找到cgi命令的url，此处还不进行参数替换
    let cgi = oCGI.url;
    const { protocol, hostName, port } = this.oDeviceInfo;

    let url = this.formatString(cgi, protocol, hostName, port);

    if (typeof oCGI.req !== "undefined") {
      for (let i = 0; i < oCGI.req.length; i++) {
        url = this.formatString(url, oParam[oCGI.req[i]]);
      }
    }

    return WebAuth.request(url, options);
  }
}

export default new WebSdk();