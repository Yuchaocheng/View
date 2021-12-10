export default function(str) {
  const attrs = []; //属性存放列表
  const directives = []; //指令存放列表
  let index = 0;
  let restStr = str;
  while (index < str.length) {
    restStr = str.slice(index);
    if (/^(\s+(.+?)="(.+?)")/s.test(restStr)) {
      const name = RegExp.$2;
      const value = RegExp.$3;
      const oInfo = {
        name,
        value
      };
      // v-开头的即是指令
      if (name.startsWith('v-')) {
        oInfo.name = oInfo.name.slice(2); // 指令的name不包含v-,把它截取掉
        if(oInfo.name==='for'){
          const match =  oInfo.value.match(/^(.+?)\s+in\s+(.+)$/);
          // for指令比较特殊，需要做一些额外的处理
          oInfo.alias = match[1]
          oInfo.for = match[2]
        }
        directives.push(oInfo);
      } else {
        attrs.push(oInfo);
      }
      index += RegExp.$1.length;
    } else {
      index++;
    }
  }
  return {
    attrs,
    directives
  };
}
