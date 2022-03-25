import axios from 'axios'

const ajax = axios.create({
  timeout: 3000 // 请求超时时间
})

// log
const logResponse = (res) => {
  const titleCss = [
    'color: mediumseagreen', 'font-size: 18px', 'font-weight:700' 
  ].join(';');
  const subTitleCss = [
    'color: #409EFF', 'font-size: 14px'
  ].join(';');
  console.groupCollapsed(`%c ${res.config.method} ${res.config.url}`, titleCss);
  console.log('%c Data:', subTitleCss,  JSON.parse(JSON.stringify(res.data || {})))
  try {
    console.log('%c Params:', subTitleCss, res?.config?.data && JSON.parse(res.config.data) )
  } catch (e) {
    console.log('%c Params:', subTitleCss, res.config && res.config.data)
  }
  console.log('%c Response:', subTitleCss, res)
  console.info('%c Time:', subTitleCss, new Date())
  console.groupEnd()
}


// 请求拦截处理
ajax.interceptors.request.use(config => {
  console.log(config);
  return {
    ...config,
    url: config.url,
    method: config.type,
    data: config.data
  }
  
}, error => {
  // error 处理 ....
  return Promise.reject(error)
})

// 响应拦截处理
ajax.interceptors.response.use(response => {
  logResponse(response);
  // success 处理....
  // debugger
  return {
    xhr: response.request,
    data: _getResponseData(response.config, response.request)
  };
}, error => {
  // error 处理 ....
  return Promise.reject(error);
})


const _getResponseData = (options, xhr) => {
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
    // 解密处理
    // _dealSecurityResponse(options, oResponse);
  } else {
    oResponse = xhr.responseText || null;
  }

  return oResponse;
}
export default ajax
