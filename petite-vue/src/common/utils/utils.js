  // 字符串转XML
  export function parseXmlFromStr(szXml) {
    if (null === szXml || "" === szXml) {
      return null;
    }
    szXml = szXml.replace(/&(?!lt;|amp;|gt;|apos;|quot;)/g, "&amp;");
    var oXml = null;
    try {
      if (window.navigator.userAgent.indexOf("MSIE 9.0") > 0) {
        oXml = new ActiveXObject("Microsoft.XMLDOM");
        oXml.async = false;
        oXml.loadXML(szXml);
      } else {
        var oParser = new DOMParser();
        oXml = oParser.parseFromString(szXml, "text/xml");
      }
    } catch (e) {
      oXml = new ActiveXObject("Microsoft.XMLDOM");
      oXml.async = false;
      oXml.loadXML(szXml);
    }
    return oXml;
  }
  //获取浏览器可支持的RSA密钥长度
  export function getRSABits() {
    var aRes = window.navigator.userAgent.toLowerCase().match(/msie\s([\d.]+)/);
    return (aRes && Number(aRes[1]) < 9) ? 256 : 1024;
  }
  export function min(aData) {
    var iResult = Infinity;
    var iItem;
    for (var i = 0, len = aData.length; i < len; ++i) {
      iItem = parseFloat(aData[i]);
      if (iResult > iItem) {
        iResult = iItem;
      }
    }
    return iResult;
  }
  export function max(aData) {
    var iResult = -Infinity;
    var iItem;
    for (var i = 0, len = aData.length; i < len; ++i) {
      iItem = parseFloat(aData[i]);
      if (iResult < iItem) {
        iResult = iItem;
      }
    }
    return iResult;
  }
  //根据统计类型获取开始时间和结束时间  CountType; 统计类型:daily weekly monthly yearly
  //获取JSON节点值
  export function jsonNodeValue(oNode, szItemName, szType) {
    if (!oNode) {
      return "";
    }
    var oItem = oNode[szItemName];
    if ("i" === szType) {
      return parseInt(oItem, 10) || 0;
    } else if ("f" === szType) {
      return parseFloat(oItem) || 0;
    } else if ("b" === szType) {
      return "true" === oItem;
    }
    return oItem || "";
  }
  //将UTC时间转换为设备本地时间
  export function convertToLocalTime(szUTCTime, iDiffTime) {
    szUTCTime = szUTCTime.replace('T', ' ').replace('Z', '');
    if (typeof iDiffTime === "undefined") {
      iDiffTime = 0;
    }
    var szFormat = "yyyy-MM-dd hh:mm:ss";
    var _aDate = szUTCTime.split(" ")[0].split("-");
    var _iFullYear = parseInt(_aDate[0], 10);
    var _iMonth = parseInt(_aDate[1], 10) - 1;
    var _iDay = parseInt(_aDate[2], 10);

    var _aTimes = szUTCTime.split(" ")[1].split(":");
    var _iHour = parseInt(_aTimes[0], 10);
    var _iMinute = parseInt(_aTimes[1], 10);
    var _iSecond = parseInt(_aTimes[2], 10);

    var _dLocalDate = new Date(Date.UTC(_iFullYear, _iMonth, _iDay, _iHour, _iMinute, _iSecond));
    _dLocalDate.setTime(_dLocalDate.getTime() + iDiffTime);
    return this.dateFormat(_dLocalDate, szFormat).replace(' ', 'T') + 'Z';
  }

  // XML转字符串
  export function xmlToStr(oXml) {
    if (null === oXml) {
      return "";
    }

    var szXml = "";
    try {
      var oSerializer = new XMLSerializer();
      szXml = oSerializer.serializeToString(oXml);
    } catch (e) {
      try {
        szXml = oXml.xml;
      } catch (m) {
        return "";
      }
    }
    if (-1 === szXml.indexOf('<?xml')) {
      szXml = "<?xml version='1.0' encoding='utf-8'?>" + szXml;
    }

    return szXml;
  }

  // 获取XML节点值
  export function nodeValue(oNode, szItemName, szType, szValue) {
    // console.log(oNode.getElementsByTagName(szItemName));
    let oItem = oNode.getElementsByTagName(szItemName).length ? oNode.getElementsByTagName(szItemName)[0] : {};
    if (undefined === szValue) {
      let szText = oItem.textContent || '';
      if ("i" === szType) {
        return parseInt(szText, 10) || 0;
      } else if ("f" === szType) {
        return parseFloat(szText) || 0;
      } else if ("b" === szType) {
        return "true" === szText;
      } else if ("t" === szType) {
        let type = 1; //不返回数据默认为true
        if ("true" === szText) {
          type = 1;
        } else if ("false" === szText) {
          type = 2;
        } else if ("readonly" === szText) {
          type = 3;
        }
        return type;
      } else if ("l" === szType) { //比较当前节点是否存在
        return $(oNode).find(szItemName).length > 0;
      } else if ("a" === szType) {
        return szText.split(",");
      }
      return szText;
    }
    oItem.innerText = szValue;
    return this;
  }

  // 获取XML节点属性值
  export function nodeAttr(oNode, szItemName, szAttrName, szType) {
    if (
      $(oNode)
        .find(szItemName)
        .eq(0)
        .attr(szAttrName)
    ) {
      var szText = $(oNode)
        .find(szItemName)
        .eq(0)
        .attr(szAttrName);
      if ("i" === szType) {
        return parseInt(szText, 10) || 0;
      } else if ("f" === szType) {
        return parseFloat(szText) || 0;
      } else if ("b" === szType) {
        return "true" === szText;
      } else if ("a" === szType) {
        return szText.split(",");
      }
      return szText;
    }
    if ("i" === szType) {
      return 0;
    } else if ("f" === szType) {
      return 0;
    } else if ("b" === szType) {
      return false;
    } else if ("a" === szType) {
      return [];
    }
    return "";
  }


  // 是否为域名
  export function isDomain(str) {
    let regTextUrl = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;
    return regTextUrl.test(str);
  }

  export function lengthw(str) {
    return str.replace(/[^\x20-\xff]/g, "rr").length;
  }

  // 计算字符串在utf-8下的字节数
  export function lengthUtf8(str) {
    try {
      str = str.toString();
    } catch (e) {
      return 0;
    }
    let szCode = "";
    let iLen = 0;
    for (let i = 0, l = str.length; i < l; i++) {
      szCode = str.charCodeAt(i);
      if (szCode === 10) { // 回车换行是2个字节
        iLen += 2;
      } else if (szCode < 0x007f) {
        iLen += 1;
      } else if (szCode >= 0x0080 && szCode <= 0x07ff) {
        iLen += 2;
      } else if (szCode >= 0x0800 && szCode <= 0xffff) {
        iLen += 3;
      } else if (szCode >= 0x10000 && szCode <= 0x1ffff) {
        iLen += 4;
      } else if (szCode >= 0x200000 && szCode <= 0x3ffffff) {
        iLen += 5;
      } else {
        iLen += 6;
      }
    }
    return iLen;
  }

  export function isIPv4Address(str) {
    if (str.length === 0) {
      return false;
    }
    var reVal = /^(\d{1}|\d{2}|[0-1]\d{2}|2[0-4]\d|25[0-5])\.(\d{1}|\d{2}|[0-1]\d{2}|2[0-4]\d|25[0-5])\.(\d{1}|\d{2}|[0-1]\d{2}|2[0-4]\d|25[0-5])\.(\d{1}|\d{2}|[0-1]\d{2}|2[0-4]\d|25[0-5])$/;
    return (reVal.test(str));
  }

  export function isIPv6Address(strInfo) {
    return (/:/).test(strInfo) && strInfo.match(/:/g).length < 8 && (/::/).test(strInfo) ? (strInfo.match(/::/g).length === 1 && (/^::$|^(::)?([\da-f]{1,4}(:|::))*[\da-f]{1,4}(:|::)?$/i).test(strInfo)) : (/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i).test(strInfo);
  }

  export function isIPAddress(str) {
    return this.isIPv4Address(str) || this.isIPv6Address(str);
  }

  export function isIpMask(szMask) {
    var exp = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/;
    return exp.test(szMask);
  }
  export function isNotSpecChar(str) {
    return !(/[%\u0027:*?<>|/\\"]/).test(str);
  }
  export function isChinese(str) {
    //eslint认为到\x00到\x1f的字符输入是错误的，需要从20开始
    return (/[^\x20-\xff]/).test(str);
  }
  export function isNotChinese(str) {
    //eslint认为到\x00到\x1f的字符输入是错误的，需要从20开始
    return (/[\x20-\xff]/).test(str);
  }
  export function isNormalChar(str) {
    return (/^\w*$/).test(str);
  }
  // 是否为D类地址 224.0.0.0 - 239.255.255.255
  export function isDNSAddress(_str) {
    if (!this.isIPAddress(_str)) {
      return false;
    } else if (!this.isDIPAddress(_str) && !this.isIPv6Address(_str)) {
      return false;
    }
    return true;
  }
  export function isCountry(str) {
    return ((/[A-Z][A-Z]/).test(str) && str.length === 2);
  }
  // 是否为多播地址
  export function isMulticastAddress(str) {
    if ("0.0.0.0" === str) { //特殊情况处理，需要进一步确认是否可以放开此限制
      return true;
    }
    // if (this.isIPv4Address(str)) {
    //   return this.inAddressRange(str, ["224.0.0.0/8", "239.255.255.255/8"]);
    // } else if (this.isIPv6Address(str)) {
    //   return this.inAddressRange(str, 'ff00::/8');
    // }
    // return false;
    let re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //匹配IP地址的正则表达式
    let bIpv6 = (/:/).test(str) && str.match(/:/g).length < 8 && (/::/).test(str) ? (str.match(/::/g).length === 1 && (/^::$|^(::)?([\da-f]{1,4}(:|::))*[\da-f]{1,4}(:|::)?$/i).test(str)) : (/^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i).test(str);
    if (re.test(str)) {
      if (RegExp.$1 === 0 && RegExp.$2 === 0 && RegExp.$3 === 0 && RegExp.$4 === 0) {
        return true;
      }
      if (RegExp.$1 > 223 && RegExp.$1 < 240 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
        return true;
      }
    } else if (bIpv6) {
      if (str.indexOf("ff") === 0 || str.indexOf("FF") === 0) {
        return true;
      }
    }
    return false;
    // var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //匹配IP地址的正则表达式
    // if (re.test(str)) {
    //   if (RegExp.$1 === 0 && RegExp.$2 === 0 && RegExp.$3 === 0 && RegExp.$4 === 0) {
    //     return true;
    //   }
    //   if (RegExp.$1 > 223 && RegExp.$1 < 240 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
    //     return true;
    //   }
    // }
    // if ("0.0.0.0" === str) { //特殊情况处理，需要进一步确认是否可以放开此限制
    //   return true;
    // }
    // return false;
  }
  // 是否为D类地址 224.0.0.0 - 239.255.255.255
  export function isDIPAddress(_str) {
    var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //匹配IP地址的正则表达式
    if (re.test(_str)) {
      if (RegExp.$1 > 0 && RegExp.$1 < 224 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
        return true;
      }
    }
    return false;
  }
  // 是否为HiDDNS
  export function isHiDDNS(str) {
    var regTextUrl = /^([a-z]|[a-z][-a-z0-9]{0,62}[a-z0-9])$/;
    return regTextUrl.test(str);
  }
  export function isExclude(str, checkValue) {
    if (checkValue.length > 0) {
      return !checkValue.includes(str);
    }
    return true;
  }
  export function isMatch(str, checkValue) {
    return checkValue === str;
  }
  // 路由器PIN码校验规则
  export function checkAPPinCode(str) {
    var regTextUrl = /^\d{8}$/;
    return regTextUrl.test(str);
  }
  // 是否为合法电子邮件地址
  export function isEmail(str) {
    return (/^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/).test(str);
  }
  // 协议转化x，只需要归一化，y需要1-归一化
  //  Function:        PointPosTrans
  //  Description:    协议转化x，只需要归一化，y需要1-归一化
  //  Input:          iType：0-设备转成插件所需归一化；1-归一化的转成设备所需
  //  bJian:是否是y轴，需要1-操作
  //  iPosVal: 坐标参数；iNormalized：归一参考值
  //  iDefault：默认值
  //  Output:            无
  //  return:            oPoint
  export function pointPosTrans(iType, bJian, iPosVal, iNormalized) {
    var iRetrunVal = 0;
    if (!isNaN(iPosVal)) {
      iRetrunVal = iPosVal;
    }
    if (0 === iType) { //设备转成插件所需归一化
      if (bJian) {
        iRetrunVal = parseFloat(1 - parseFloat(iPosVal / iNormalized)).toFixed(4);
      } else {
        iRetrunVal = parseFloat(iPosVal / iNormalized).toFixed(4);
      }
    } else {
      if (bJian) {
        iRetrunVal = parseInt((1 - iPosVal) * iNormalized, 10);
      } else {
        iRetrunVal = parseInt(iPosVal * iNormalized, 10);
      }
    }
    return iRetrunVal;
  }
  //转换成格式化UTC时间
  export function utcDateFormat(oDate, fmt) {
    var o = {
      "M+": oDate.getUTCMonth() + 1, //月份
      "d+": oDate.getUTCDate(), //日
      "h+": oDate.getUTCHours(), //小时
      "m+": oDate.getUTCMinutes(), //分
      "s+": oDate.getUTCSeconds(), //秒
      "q+": Math.floor((oDate.getUTCMonth() + 3) / 3), //季度
      "S": oDate.getUTCMilliseconds() //毫秒
    };
    if ((/(y+)/).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (oDate.getUTCFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }
  //将本地时间转换为UTC时间
  export function convertToUTCTime(szLocalTime, szFormat) {
    if (typeof szFormat === "undefined") {
      szFormat = "yyyy-MM-dd hh:mm:ss";
    }
    szLocalTime = szLocalTime.replace("T", " ").replace("Z", "");
    var _dLocalDate = new Date(Date.parse(szLocalTime.replace(/-/g, "/")));
    _dLocalDate = this.utcDateFormat(_dLocalDate, szFormat);
    _dLocalDate = _dLocalDate.replace(" ", "T") + "Z";
    return _dLocalDate;
  }

  export function decodeString(str) {
    let a = document.createElement('a');
    a.innerHTML = str;
    if (window.navigator.userAgent.indexOf("MSIE 8.0") > -1) {
      return str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&apos;/g, "'").replace(/&amp;/g, "&");
    }

    return (a.textContent || a.innerText);
  }

  // 字符转义
  export function encodeString(str) {
    if (str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    return "";
  }

  //深度遍历所有key, 替换成val，val可以是函数，输入原始信息，将返回值设置回val, 用于敏感信息加密
  export function deepObj(obj, key, val) {
    let getVal = val;
    if (typeof val !== "function") {
      getVal = () => val;
    }

    if (obj && obj.documentElement) {
      $(obj).find(key).each(function () {
        $(this).text(getVal($(this).text()));
      });
    } else if ("object" === typeof obj) {
      if (typeof obj[key] !== "object" && Object.prototype.hasOwnProperty.call(obj, key)) {
        obj[key] = getVal(obj[key]);
      } else if (typeof obj === "object") {
        $.each(obj, (index) => {
          this.deepObj(obj[index], key, val);
        });
      }
    }
  }

  export function getXmlNodeCap(xmlDoc, arrNodeNames, destination) {
    if (!xmlDoc || !arrNodeNames) {
      return {};
    }

    let iLength = arrNodeNames.length;
    let oResult = typeof destination === "object" ? destination : {};
    let aNode;
    for (let i = 0; i < iLength; i++) {
      aNode = arrNodeNames[i].split("@");
      oResult[aNode[0]] = $(xmlDoc).find(aNode[0]).length > 0;
    }
    return oResult;
  }

  //从xml中取出数组中的节点名称和类型生成对象，类型用@分割，目前支持int, float, bool
  export function getXmlNodeObject(xmlDoc, arrNodeNames, oDestination) {
    if (!xmlDoc || !arrNodeNames) {
      return {};
    }
    let oCurNode;
    let iLength = arrNodeNames.length;
    let oResult = oDestination ? oDestination : {};
    let aNode;
    for (let i = 0; i < iLength; i++) {
      aNode = arrNodeNames[i].split("@");
      oCurNode = $(xmlDoc).find(aNode[0]).eq(0);
      if (oCurNode.children().length === 0) {
        if (aNode[1] === "i") {
          oResult[aNode[0]] = parseInt(oCurNode.text(), 10);
        } else if (aNode[1] === "f") {
          oResult[aNode[0]] = parseFloat(oCurNode.text());
        } else if (aNode[1] === "b") {
          oResult[aNode[0]] = oCurNode.text() === "true";
        } else {
          oResult[aNode[0]] = oCurNode.text();
        }
      } else {
        oResult[arrNodeNames[i]] = oCurNode.get(0);
      }
    }
    return oResult;
  }
  //根据json对象设置相应的xml
  export function setXmlNodeObject(xmlDoc, oNodeList, aSetParamList) {
    if (!xmlDoc || !oNodeList) {
      return xmlDoc;
    }
    if (aSetParamList) {
      $.each(aSetParamList, (key, value) => {
        let szKey = value.split("@")[0];
        if (typeof (oNodeList[szKey]) !== "undefined") {
          $(xmlDoc).find(szKey).text(oNodeList[szKey].toString());
        }
      });
      return xmlDoc;
    }
    $.each(oNodeList, (key, value) => {
      if (null !== value) {
        $(xmlDoc).find(key.split("@")[0]).text(value.toString());
      }
    });
    return xmlDoc;
  }

  export function getIPAddr(oNode) {
    let szAddr = this.nodeValue(oNode, "ipAddress, ipv6Address, hostName");
    if ("0.0.0.0" === szAddr) {
      szAddr = "";
    }
    return szAddr;
  }

  export function checkAddressingType(szAddress, szIPVersion) {
    let szIpAddressType = "hostName";
    if (szIPVersion === 'v4') {
      if (this.isIPv4Address(szAddress) === true) {
        szIpAddressType = "ipAddress";
      }
    } else if (szIPVersion === 'v6') {
      if (this.isIPv6Address(szAddress) === true) {
        szIpAddressType = "ipv6Address";
      }
    } else {
      if (this.isIPv4Address(szAddress) === true) {
        szIpAddressType = "ipAddress";
      } else if (this.isIPv6Address(szAddress) === true) {
        szIpAddressType = "ipv6Address";
      }
    }
    return szIpAddressType;
  }

  export function getIPAddrXml(szAddr) {
    let szAddrType = this.checkAddressingType(szAddr);
    let szXml = "";
    if ("" === szAddr) {
      szXml = "<ipAddress>0.0.0.0</ipAddress>";
    } else if ("hostName" === szAddrType) {
      szXml = "<hostName>" + szAddr + "</hostName>";
    } else if ("ipAddress" === szAddrType) {
      szXml = "<ipAddress>" + szAddr + "</ipAddress>";
    } else if ("ipv6Address" === szAddrType) {
      szXml = "<ipv6Address>" + szAddr + "</ipv6Address>";
    }
    return szXml;
  }
  export function ignorePromiseError(deferred) {
    return new Promise(function (resolve) {
      deferred.then((data) => {
        resolve({
          bResult: true,
          data: data
        });
      }, (data) => {
        resolve({
          bResult: false,
          data: data
        });
      });
    });
  }
  //补齐数字前的0 num:数字， length需要的长度
  export function prefixInteger(num, length) {
    return (new Array(length).join('0') + num).slice(-length);
  }

  export function debounce(func, wait) {
    let iTimeout = -1;
    return function () {
      clearTimeout(iTimeout);
      iTimeout = setTimeout(func, wait);
    };
  }
  // 只执行一次
  export function once(func) {
    let ran;
    let result;

    if (typeof func !== "function") {
      return false;
    }
    return function () {
      if (ran) {
        return result;
      }
      ran = true;
      result = func.apply(this, arguments);

      // clear the `func` variable so the function may be garbage collected
      func = null;
      return result;
    };
  }
  //创建xml DOM对象
  export function createXml() {
    var oXml;
    try {
      if ($.browser.msie && parseInt($.browser.version, 10) === 9) {
        oXml = new ActiveXObject("Microsoft.XMLDOM");
      } else {
        oXml = document.implementation.createDocument("", "", null);
      }
    } catch (e) {
      oXml = new ActiveXObject("Microsoft.XMLDOM");
    }
    oXml.async = "false";
    return oXml;
  }
  // 是否为数字(整形、浮点型, 包括正负数)
  export function isNumberIncludeNegative(str) {
    return (/^[-]{0,1}?\d+(\.\d+)?$/).test(str);
  }
  export function waitAll(aPromise) {
    return new Promise((resolve, reject) => {
      let length = aPromise.length;
      let aSuccessResult = [];
      let aErrorResult = [];
      let aPromiseResult = [];
      for (let i = 0; i < length; i++) {
        aPromiseResult.push(aPromise[i].then((result) => {
          aSuccessResult.push(result);
        }, (result) => {
          aErrorResult.push(result);
        }));
      }
      Promise.all(aPromiseResult).then(() => {
        if (aErrorResult.length > 0) {
          reject(aErrorResult);
        } else {
          resolve(aSuccessResult);
        }
      });
    });
  }
  export function objectValue(oData, szKey, szType, newVal) {
    //获取数据路径
    let aKeyList = (szKey + "").split(" "); //解析路径
    let aValidKeyList = [];
    aKeyList.forEach((val) => {
      if (val !== "") {
        aValidKeyList.push(val);
      }
    });
    let bSet = typeof newVal !== "undefined";
    //获取需要操作的对象
    let iLen = aValidKeyList.length;
    let operateData = oData;
    for (let i = 0; i < iLen; i++) {
      if (iLen !== i + 1) {
        operateData = operateData[aValidKeyList[i]];
        //没找到对应的数据
        if (bSet && typeof operateData === "undefined") {
          operateData = {};
        } else if (typeof operateData === "undefined") {
          break;
        }
      }
    }
    //没有数据返回
    if (!operateData) {
      return;
    }

    //获取对应的类型数据
    function getTypeVal(val, type) {
      newVal = val;
      //整形数据，NaN非法则返回0
      if (type === "i") {
        newVal = parseInt(newVal, 10);
        newVal = isNaN(newVal) ? 0 : newVal;
      } else if (type === "b") { //bool数据
        //false则为false,否则自动转换
        if (typeof newVal === "string" && newVal === "false") {
          newVal = false;
        } else {
          newVal = !!newVal;
        }
      } else if (type === "f") { //浮点数据
        newVal = parseFloat(newVal);
      } else if (type === "p") {
        //获取原始类型，不处理
      } else if (type === "l") {
        newVal = typeof newVal !== "undefined";
      } else {
        //默认返回字符串，和nodeValue一致
        newVal = newVal + "";
      }
      return newVal;
    }

    //设置数据
    if (typeof newVal !== "undefined") {
      //返回设置的数据
      operateData[aValidKeyList[iLen - 1]] = getTypeVal(newVal, szType);
      return operateData[aValidKeyList[iLen - 1]];
    }

    //获取数据
    return getTypeVal(operateData[aValidKeyList[iLen - 1]], szType);
  }

  // 转化成16进制
  export function toHex(str) {
    let val = "";
    for (let i = 0; i < str.length; i++) {
      if (val === "") {
        val = str.charCodeAt(i).toString(16);
      } else {
        if (str.charCodeAt(i) < 16) {
          val += "0" + str.charCodeAt(i).toString(16);
        } else {
          val += str.charCodeAt(i).toString(16);
        }
      }
    }
    return val;
  }

  export function resolvePromise(param) {
    return new Promise(resolve => {
      resolve(param);
    });
  }

  export function rejectPromise(param) {
    return new Promise((resolve, reject) => {
      reject(param);
    });
  }



  // 是否为空字符串
  export function isEmpty(str) {
    str = $.trim(str);
    return str.length === 0;
  }

  //检查数字
  export function checkNumber(num, iDefault) {
    let iGoodValue = iDefault;
    if (this.isNumber(num.toString())) {
      iGoodValue = Number(num);
    }
    return iGoodValue;
  }
  // 是否为数字(整形、浮点型)
  export function isNumber(str) {
    return this.isInt(str) || this.isFloat(str);
  }
  // 是否为数字(整形、浮点型, 浮点型保留一位小数)
  export function isNumber_1(str) {
    return this.isInt(str) || (/^\d+\.\d?$/).test(str);
  }
  // 是否为数字, 正数and负数
  export function isNumber_2(str) {
    return this.isInt(str) || (/^(-)?\d+$/).test(str);
  }
  // 是否为整型
  export function isInt(str) {
    return (/^\d+$/).test(str);
  }
  // 是否为浮点型
  export function isFloat(str) {
    return (/^\d+\.\d+$/).test(str);
  }
  // 检查密码复杂度
  export function checkPasswordComplexity(szPwd) {
    if (!szPwd) {
      return 0;
    }
    var iResult = 0;
    szPwd.match(/[a-z]/g) && iResult++;
    szPwd.match(/[A-Z]/g) && (iResult += iResult ? 2 : 1);
    szPwd.match(/[0-9]/g) && iResult++;
    szPwd.match(/[^a-zA-Z0-9]/g) && (iResult += iResult ? 2 : 1);
    if (szPwd.length < 8) {
      iResult = 0;
    }
    iResult && iResult--;
    iResult = iResult > 3 ? 3 : iResult;
    return iResult;
  }
  // 解析用户名、密码
  export function parseNamePwd(szNamePwd) {
    let oRet = {
      szName: "",
      szPass: ""
    };
    if ("" === szNamePwd) {
      return oRet;
    }
    if (":" === szNamePwd.charAt(0)) {
      szNamePwd = szNamePwd.substring(1);
    }
    let nPos = szNamePwd.indexOf(":");
    if (nPos > -1) {
      oRet.szName = szNamePwd.substring(0, nPos);
      oRet.szPass = szNamePwd.substring(nPos + 1);
    }

    return oRet;
  }
  //设备和插件的坐标系转换
  export function changeDiviceToPluginPoints(aPoints, iRatioW, iRatioH) {
    let aChangePoints = [];
    for (let i = 0, iLen = aPoints.length; i < iLen; i++) {
      aChangePoints[i] = [];
      aChangePoints[i][0] = aPoints[i][0] / iRatioW;
      aChangePoints[i][1] = 1 - (aPoints[i][1] / iRatioH);
    }
    return aChangePoints;
  }
  // 根据id获取通道信息
  export function getChannelIndex(array, id, key) {
    let result = [];
    let iChannelId = 0;
    $.each(array, (i, item) => {
      let oInfo = item;
      iChannelId = item["channelId"];
      if (iChannelId === id) {
        if ($.isArray(key)) {
          $.each(key, (j, jtem) => {
            result[jtem] = oInfo[jtem];
          });
        } else if (typeof (key) === 'string') {
          result[key] = oInfo[key];
        }
      }
    });
    return result;
  }

  export function getInstancePromise() {
    let res;
    let rej;
    let deffer = new Promise((resolve, reject) => {
      res = resolve;
      rej = reject;
    });
    deffer.resolve = res;
    deffer.reject = rej;
    return deffer;
  }

  export function getImgRealSize(szUrl) {
    return new Promise((resolve, reject) => {
      let _oImg = new Image();
      let _iTimer = -1;
      if ($.browser.msie && 11 > parseInt($.browser.version, 10)) { //IE且版本为IE11以下
        _oImg.onreadystatechange = function () {
          if (_oImg.readyState === 'complete') { //需要等图片加载完毕之后，再进行回调
            if (-1 !== _iTimer) {
              clearTimeout(_iTimer);
              _iTimer = -1;
            }
            resolve({
              iWidth: _oImg.width,
              iHeight: _oImg.height
            });
          }
        };
      } else { // IE11或非IE, 因为IE11修正私有的onreadystatechange, 替换为标准的onload
        // 完全加载完毕的事件
        _oImg.onload = function () {
          if (-1 !== _iTimer) {
            clearTimeout(_iTimer);
            _iTimer = -1;
          }
          resolve({
            iWidth: _oImg.width,
            iHeight: _oImg.height
          });
        };
      }

      _oImg.onerror = function () {
        if (-1 !== _iTimer) {
          clearTimeout(_iTimer);
          _iTimer = -1;
        }
        reject();
      };

      // 设置超时时间为60s
      _iTimer = setTimeout(function () {
        reject();
      }, 60000);

      _oImg.src = szUrl;
    });
  }

  //带pending的promise,用于处理通知和进度获取等，对外提供pending，notify进行通知和回调
  export function getPendingPromise(oPromise) {
    if (!oPromise) {
      oPromise = this.getInstancePromise();
    }
    let pendingCallback = () => {
      //...
    };
    oPromise.pending = function (callback) {
      pendingCallback = callback;
      return oPromise;
    };

    oPromise.notify = function (oNotify) {
      pendingCallback(oNotify);
    };

    oPromise.then((toNext) => {
      pendingCallback = () => {
        //...
      };
      return toNext;
    }, (toNext) => {
      pendingCallback = () => {
        //...
      };
      return toNext;
    });
    return oPromise;
  }

  export function showMask() {
    $("html").append('<div id="mask" class="mask"></div> ');
    $("#mask").css("height", $(document).height());
    $("#mask").css("width", $(document).width());
    $("#mask").show();
  }

  export function hideMask() {
    $("#mask").hide();
  }

  export function fileSeparator() {
    if (navigator.platform.toLowerCase().lastIndexOf("linux") >= 0) {
      return "/";
    }
    return "\\";
  }

  //图片数据转换成二进制数据
  export function urlToBase64(szUrl, cb) {
    //通过canvas解析图片
    let canvas = document.createElement('CANVAS');
    let ctx = canvas.getContext('2d');
    let img = new Image();
    img.onload = () => {
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img, 0, 0);
      //转换成数据流
      let dataURL = canvas.toDataURL('image/jpeg');
      //转换成二进制数据
      let arr = dataURL.split(',');
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      let imgFile = new Blob([u8arr], {
        type: mime
      });
      if (cb) {
        cb(imgFile);
      }
      canvas = null;
    };
    img.onerror = () => {
      if (cb) {
        cb();
      }
    };
    img.src = szUrl;
  }