const PARAM_OPTION_PARAM = "param"; //中文参数
const PARAM_OPTION_ID = "id"; //id数字号 如区域几，硬盘几
const PARAM_OPTION_USER = "user";
const PARAM_OPTION_TIMESTAMP = 'timestamp';

const CGI = {
  //激活状态
  activateStatus: {
    url: "%s%s:%s/SDK/activateStatus",
    noAuth: true,
    hideLoading: true
  },
  language: {
    url: "%s%s:%s/SDK/language",
    noAuth: true,
    hideLoading: true
  },
  //激活设备
  activate: {
    url: "%s%s:%s/ISAPI/System/activate",
    noAuth: true
  },
  //激活IPC
  activateIPC: {
    url: "%s%s:%s/ISAPI/ContentMgmt/InputProxy/channels/activate",
    security1: ["userName", "password"]
  },
  //加密字符串
  challenge: {
    url: "%s%s:%s/ISAPI/Security/challenge",
    noAuth: true
  },
  // session相关
  // sessionCap: { url: "%s%s:%s/ISAPI/Security/sessionLogin/capabilities" },
  sessionLogin: {
    url: "%s%s:%s/ISAPI/Security/sessionLogin?timeStamp=%s",
    req: [PARAM_OPTION_PARAM]
  },
  //登录
  login: {
    url: "%s%s:%s/ISAPI/Security/userCheck?timeStamp=%s",
    req: [PARAM_OPTION_TIMESTAMP]
  },
  // 日志服务器配置
  logServerCap: {
    url: "%s%s:%s/ISAPI/System/logServer/capabilities"
  },
  projectionScreenMgrCap: {
    url: '%s%s:%s/ISAPI/IoTGateway/projectionScreenMgr/capabilities?format=json'
  },
  deviceInfo: {
    url: '%s%s:%s/ISAPI/System/deviceInfo'
   
  }
};
export default CGI;