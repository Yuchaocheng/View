import parseAttrs from './attrsString'; //提取模板中的标签属性

const SingleTagList = ['input', 'img', 'br']; // 单标签特殊处理，只列举了一些常见的
export default function parse(templateStr) {
  let index = 0;
  let restStr = templateStr;
  const stack = [];
  const aResult = [];
  const startRexExp = /^<(([a-z][a-z\d]*)(\s.+?)?)>/; //匹配开始标签
  const endRegExp = /^<\/([a-z][a-z\d]*)>/; //匹配结尾标签
  const contentRegExp = /(.+?)<\/?[a-z][a-z\d]*(\s.+?)?>/s; //匹配标签内容
  while (index < templateStr.length) {
    restStr = templateStr.slice(index);
    /* 匹配标签开头 */
    /* 匹配开头不能是数字，后面允许有数字 */
    if (startRexExp.test(restStr)) {
      // 压栈
      const startTag = RegExp.$1;
      const tagName = RegExp.$2;
      const attrsString = RegExp.$3;
      const oNodeInfo = {
        tag: tagName,
        type: Node.ELEMENT_NODE,
        children: []
      };
      const { attrs, directives } = parseAttrs(attrsString);
      if (attrs.length) {
        oNodeInfo.attrs = attrs;
      }
      if (directives.length) {
        oNodeInfo.directives = directives;
      }
      if (SingleTagList.includes(tagName)) {
        // 单标签，单标签开始即结束了，相当于进行了双标签的入栈和出栈操作
        if (stack.length) {
          const oLastNodeInfo = stack[stack.length - 1];
          oLastNodeInfo.children.push(oNodeInfo);
        } else {
          /* 暂时只匹配纯文本节点，不考虑其他节点和文本节点都有的情况 */
          aResult.push(oNodeInfo);
        }
      } else {
        // 双标签
        stack.push(oNodeInfo);
      }
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
        const oLastNodeInfo = stack[stack.length - 1];
        oLastNodeInfo.children.push(oContent);
      } else {
        /* 暂时只匹配纯文本节点，不考虑其他节点和文本节点都有的情况 */
        aResult.push(oContent);
      }
      console.log(`检测到结束${endTag}`);
      index += endTag.length + 3;
    } else if (contentRegExp.test(restStr)) {
      // 匹配文本节点，全为空的跳过，全为空说明是空格或换行，不需要统计
      let content = RegExp.$1;
      /* \s 就是[ \t\v\n\r\f]。表示空白符，包括空格、水平制表符、垂直制表符、换行符、回车符、换页符。*/
      if (!/^\s+$/.test(content)) {
        const oLastNodeInfo = stack[stack.length - 1];
        oLastNodeInfo.children.push({
          type: Node.TEXT_NODE,
          text: content.trim() //存入栈中的文本节点，去掉前后空格。但是index的叠加是需要算上空格的
        });
      }
      index += content.length;
    } else {
      index++;
      throw new Error('怎么进else了？排查下是何特殊情况');
    }
  }
  return aResult[0];
}
