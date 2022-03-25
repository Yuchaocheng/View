// import { Loading } from 'hui';
// import i18n from "@/Common/static/i18n/index.js";
import {decodeAES, decodeBase64, encodeAES, encodeBase64, md5} from '@libs/encryption/secure';
import WebAuth from './webAuth';
import {parseXmlFromStr, encodeString, xmlToStr, deepObj, decodeString} from '@util/utils';
import CGI from './isapi.js';
// import DispatchUtils from '@/Portal/view/dispatch/Utils.js';
import ajax from './ajax';

class AjaxClient {
  constructor() {
    this.options = {
      timeout: 30000, //超时时间，默认30000ms
      data: null, //发送的数据，没有则为null
      complete: null, //请求完成回调
      success: null, //请求成功回调
      error: null, //请求失败回调
      401: null,
      403: null,
    };
  }

  /**
   * 设置Ajax请求options参数
   * @author wangzhihaiyf1
   * @date   2020-07-21
   * @param  {Object}
   */
  setOptions(oOptions) {
    this.options = Object.assign(this.options, oOptions);
  }

  /**
   * 获取Ajax请求options参数，为了外部修改，返回时拷贝一份
   * @author wangzhihaiyf1
   * @date   2020-07-21
   * @return {Object}
   */
  getOptions() {
    return this.options;
  }

  /**
   * ajax成功回调
   * @author wangzhihaiyf1
   * @date   2020-07-21
   * @param  {Object} Ajax请求返回的xhr对象
   * @param  {Object} Ajax请求options参数
   * @return {null}
   */
  processSuccessCB(xhr, options, ajaxOptions) {
    if (!xhr) {
      return;
    }
    if (4 !== xhr.readyState) {
      return;
    }
    if (typeof options.success === "function") {
      let oResponse = this._getResponseData(ajaxOptions, xhr);
      return options.success(oResponse, xhr);
    }
  }

  /**
   * ajax失败回调
   * @author wangzhihaiyf1
   * @date   2020-07-21
   * @param  {Object} Ajax请求返回的xhr对象
   * @param  {string} Ajax请求返回的状态码
   * @param  {Object} Ajax请求options参数
   * @return {null}
   */
  processErrorCB(xhr, textStatus, options) {
    if (typeof options.error !== "function") {
      return;
    }
    //$ajax中，如果是timeout错误，readyState不会变为4，保持0
    // 所以为了上层能够得到这个错误需要特殊处理这个错误类型
    if (4 === xhr.readyState || "timeout" === textStatus || "error" === textStatus) {
      let oResponse = this._getResponseData(options, xhr);
      return options.error(oResponse, xhr);
    }
  }

  /**
   * ajax完成回调
   * @author wangzhihaiyf1
   * @date   2020-07-21
   * @param  {Object} Ajax请求返回的xhr对象
   * @param  {Object} Ajax请求options参数
   * @return {null}
   */
  processCompleteCB(xhr, options) {
    //最后处理complete
    if (typeof options.complete === "function") {
      options.complete(this._getResponseData(options, xhr), xhr);
    }
  }

  /**
   * 发送ajax请求
   * @author wangzhihaiyf1
   * @date   2020-07-21
   * @param  {String} 请求url
   * @param  {Object} Ajax请求options参数
   * @return {Object} 请求promise对象
   */
  submitRequest(szUrl, options) {

    let that = this;
    let oAjaxOptions = {};// 传给ajax函数的options对象
    let oRequestOptions = this.getOptions();
    oRequestOptions = Object.assign(oRequestOptions, options)

    /**
     * [合并ajax请求的options]
     * @author wangzhihaiyf1
     * @date   2020-07-21
     * @return {[null]}
     */
    let dealNormalOption = () => {
      let szName = oRequestOptions.username ? oRequestOptions.username : "";
      let szPass = oRequestOptions.password ? oRequestOptions.password : "";
      let iAuthType = WebAuth.getAuthType();
      if (2 === iAuthType) { // 摘要认证
        let szAuth = WebAuth.getPluginAuthV2();
        szAuth = decodeBase64(szAuth);
        if (szAuth) {
          szName = szAuth.split(":")[0] || "";
          szPass = szAuth.split(":")[1] || "";
        }
      }
      oAjaxOptions = Object.assign(oAjaxOptions, {
        type: oRequestOptions.type,
        auth: {
          username: szName,
          password: szPass,
        },
        timeout: oRequestOptions.timeout,
        // cmd: oRequestOptions.cmd,
        iSecurityVersion: oRequestOptions.iSecurityVersion,
        url: szUrl,
        // processData: !!oRequestOptions.processData,
        data: oRequestOptions.data,
        loginPassword: oRequestOptions.loginPassword,
        params: oRequestOptions.params || {}
      });
    };

    /**
     * 设置Ajax请求的回调处理（success\error\complete）
     * @author wangzhihaiyf1
     * @date   2020-07-21
     * @param  {[Object]} promise的resolve函数
     * @param  {[Object]} promise的reject函数
     * @return {[null]}
     */
    let dealCallbackOption = (resolve, reject) => {
      let oResult;
      // get请求时显示等待框
      oAjaxOptions = Object.assign(oAjaxOptions, {
        success: function (data, textStatus, xhr) {
          //覆盖默认的保存提示
          if (oRequestOptions.success) {
            oResult = that.processSuccessCB(xhr, oRequestOptions, oAjaxOptions);
          }

          //成功
          resolve(oResult ? oResult : data);
        },
        error: function (xhr, textStatus) {
          //失败重载
          if (oRequestOptions.error) {
            oResult = that.processErrorCB(xhr, textStatus, oRequestOptions);
          }

          delete xhr.then;
          if (xhr.status === 200) { //有种情况 请求成功也进入了error 导致上层数据不对
            resolve(oResult ? oResult : xhr.responseText);
          } else {
            reject(oResult ? oResult : xhr);
          }
        },
        complete: function (xhr) {
          that.processCompleteCB(xhr, oRequestOptions);
        }
      });
    };
  
    dealNormalOption();
    return ajax(oAjaxOptions);
  }

  /**
   * 从Ajax请求xhr中解析报文body
   * @author wangzhihaiyf1
   * @date   2020-07-21
   * @param  {[Object]} ajax请求返回的xhr对象
   * @return {[Object]} 从Ajax请求xhr中解析报文body，xml或json格式
   */
  _getResponseData(options, xhr) {
    let szResponse = xhr.responseText;
    let oResponse = null;
    if ("undefined" !== typeof szResponse) {
      if (xhr.responseXML) {
        oResponse = xhr.responseXML;
      } else if (szResponse.indexOf("<?xml") > -1) {
        oResponse = xhr.responseXML;
      } else if (szResponse.length && szResponse.charAt(0) === "{") {
        try {
          oResponse = JSON.parse(szResponse);
        } catch (e) {
          //console.log("转换json失败:%s", e.message);
        }
      }
      this._dealSecurityResponse(options, oResponse);
    } else {
      oResponse = xhr.responseText || null;
    }

    return oResponse;
  }

  _getAesIV() {
    return md5((new Date().getTime()).toString());
  }

  _decodeAES(szDecodeStr, szIv) {
    let szStr;
    let szAESKey = WebAuth.getAuthInfo().szAESKey;
    try {
      szStr = decodeAES(szDecodeStr, szAESKey, szIv);
    } catch (e) {
      szStr = "";
    }
    return decodeBase64(szStr);
  }

  _encodeAES(szEncodeStr, szIv) {
    let szAESKey = WebAuth.getAuthInfo().szAESKey;
    return encodeAES(encodeBase64(encodeString(szEncodeStr)), szAESKey, szIv);
  }

  _dealSecurityRequest(oAJaxOption) {
    if (!oAJaxOption.cmd) {
      return;
    }

    let that = this;
    let oData = oAJaxOption.data;
    let iSVer = oAJaxOption.iSecurityVersion;
    let oCGI = CGI[oAJaxOption.cmd];
    let szIv = this._getAesIV();
    let aSVer = oCGI["security" + iSVer];
    let bJsonData = false;
    let szUrl = oAJaxOption.url;

    if (typeof oData === "string" && oData.indexOf("<?xml") > -1) {//字符串格式XML，转成XML对象
      oData = parseXmlFromStr(oData);
    } else if (
      oData    //防止是null
      && typeof oData === "object" //将普通对象转json
      && !oData.documentElement    //XML对象不做处理
      && !oAJaxOption.queryObject //设备密码不可逆专用判断，由ajax方法进行转换，不处理
    ) { //JSON对象
      bJsonData = true;
    } else if (
      oData
      && typeof oData === "object" //将普通对象转json
      && oData.documentElement    //XML对象不做处理
      && oCGI && oCGI["security" + iSVer]  //当前对象包含敏感信息加密
    ) { // xml对象
      oData = parseXmlFromStr(xmlToStr(oData)); //多转一次，防止引用的xml传进来被多次加密
    }

    if (aSVer) {
      // 发送前url及数据进行加密处理
      var szSeparator = szUrl.indexOf("?") !== -1 ? "&" : "?";
      szUrl += szSeparator + "security=" + iSVer + "&iv=" + szIv;
      if (oAJaxOption.loginPassword) {
        szUrl += "&loginPassword=" + this._encodeAES(oAJaxOption.loginPassword, szIv);
      }
      if (oData) {
        aSVer.forEach((val) => {
          deepObj(oData, val, (str) => {
            if (!str) {
              return '';
            }
            return that._encodeAES(str, szIv);
          });
        });
      }
    }

    if (bJsonData) {
      try {
        oData = JSON.stringify(oData);
      } catch (e) {
        //to do
      }
    }
    
    oAJaxOption.data = oData;
    oAJaxOption.url = szUrl;
  }

  _dealSecurityResponse(oAJaxOption, oResponseData) {
    if (!oAJaxOption.cmd) {
      return;
    }
    let that = this;
    let szUrl = oAJaxOption.url;
    let iSVer = oAJaxOption.iSecurityVersion;
    let oCGI = CGI[oAJaxOption.cmd];
    let aSVer = oCGI["security" + iSVer];
    let szType = oAJaxOption.type;// 请求方法
    let szIv;
    if (aSVer && szUrl && (-1 !== szUrl.indexOf("&iv="))) {
      szIv = szUrl && szUrl.substr(4 + szUrl.indexOf("&iv="), 32);
    }

    if (szIv && ("GET" === szType || "POST" === szType)) {
      aSVer.forEach((val) => {
        deepObj(oResponseData, val, (str) => {
          if (!str) {
            return '';
          }
          return decodeString(that._decodeAES(str, szIv));
        });
      });
    }
  }
}

export default new AjaxClient();
