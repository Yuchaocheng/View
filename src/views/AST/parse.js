import parseAttrs from './attrsString'; //将模板中的attrs字符串转换成{name,value}形式
export default function parse(templateStr) {
  let index = 0;
  let restStr = templateStr;
  const stack = [];
  const aResult = [];
  const startRexExp = /^<(([a-z][a-z\d]*)(\s.+?)?)>/;
  const endRegExp = /^<\/([a-z][a-z\d]*)>/;
  /* 匹配内容，内容的匹配，是在标签和标签中间，至于是开头标签和结尾标签的哪种匹配，是都有可能的 */
  const contentRegExp = /(.+?)<\/?[a-z][a-z\d]*(\s.+?)?>/s;
  while (index < templateStr.length) {
    restStr = templateStr.slice(index);
    /* 匹配标签开头 */
    /* 开头不能是数字，后面允许有数字 */
    // console.log(restStr);
    // debugger
    if (startRexExp.test(restStr)) {
      // 压栈
      const startTag = RegExp.$1;
      const tagName = RegExp.$2;
      const attrsString = RegExp.$3;
      stack.push({
        tag: tagName,
        nodeType: Node.ELEMENT_NODE,
        attrs: parseAttrs(attrsString),
        children: []
      });
      console.log(`检测到开始${tagName}`);

      // +2是把<>符号也算上了
      index += startTag.length + 2;
    } else if (endRegExp.test(restStr)) {
      /* 匹配标签结尾 */
      // 出栈
      const endTag = RegExp.$1;
      const oContent = stack.pop();
      if (!oContent || endTag !== oContent.tag) {
        throw new Error('模板字符串格式错误');
      }
      if (stack.length) {
        const oLastContent = stack[stack.length - 1];
        oLastContent.children.push(oContent);
      } else {
        /* 暂时只匹配纯文本节点，不考虑其他节点和文本节点都有的情况 */
        aResult.push(oContent);
      }
      console.log(`检测到结束${endTag}`);
      index += endTag.length + 3;
    } else if (contentRegExp.test(restStr)) {
      // 匹配文本节点，全为空的跳过，全为空说明是空格或换行，不需要统计
      let content = RegExp.$1;
      /* \s 就是[ \t\v\n\r\f]。表示空白符，包括空格、水平制表符、垂直制表符、换行符、回车符、换页符。
      记忆方式：s是space character的首字母。 */
      if (!/^\s+$/.test(content)) {
        const oLastContent = stack[stack.length - 1];
        oLastContent.children.push({
          nodeType: Node.TEXT_NODE,
          content: content.trim() //存入栈中的文本节点，去掉前后空格。但是index的叠加是需要算上空格的
        });
      }
      index += content.length;
    } else {
      // 主要是空格等一些特殊情况
      index++;
      throw new Error('怎么进else了？排查下是何特殊情况');
    }
  }
  return aResult;
}
