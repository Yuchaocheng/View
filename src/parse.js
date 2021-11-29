const templateStr = `<div>
    <h3>你好</h3>
    <ul>
        aaaaaaa
        <li>A</li>
        bbbbbb
        <li>B</li>
        <li>C</li>
    </ul>
</div>`

export function parse(templateStr) {
    let index = 0;
    let restStr = templateStr
    const contentStack = [];
    const tagStack = [];
    const aResult = []
    const startRexExp = /^<([a-z][a-z\d]*)>/
    const endRegExp = /^<\/([a-z][a-z\d]*)>/
    /* 匹配内容，内容的匹配，是在标签和标签中间，至于是开头标签和结尾标签的哪种匹配，是都有可能的 */
    const contentRegExp = /(.+?)<\/?[a-z][a-z\d]*>/s
    while (index < templateStr.length) {
        console.log(restStr);
        console.log(2222222222);
        // debugger
        restStr = templateStr.slice(index)
        /* 匹配标签开头 */
        /* 开头不能是数字，后面允许有数字 */
        if (startRexExp.test(restStr)) {
            // 压栈
            const startTag = RegExp.$1;
            tagStack.push(startTag);
            contentStack.push({
                tag: startTag,
                nodeType: Node.ELEMENT_NODE,
                children: []
            });
            console.log(`检测到开始${startTag}`);

            // +2是把<>符号也算上了
            index += startTag.length + 2
        } else if (endRegExp.test(restStr)) {
            /* 匹配标签结尾 */
            // 出栈
            const endTag = RegExp.$1
            const oContent = contentStack.pop()
            if (!oContent || endTag !== oContent.tag) {
                throw new Error('模板字符串格式错误')
            }
            if (contentStack.length) {
                const oLastContent = contentStack[contentStack.length - 1]
                oLastContent.children.push(oContent)
            } else {
                /* 暂时只匹配纯文本节点，不考虑其他节点和文本节点都有的情况 */
                aResult.push(oContent)
            }
            console.log(`检测到结束${endTag}`);
            index += endTag.length + 3
        } else if (contentRegExp.test(restStr)) {
            // debugger
            const content = RegExp.$1
            const oLastContent = contentStack[contentStack.length - 1]
            oLastContent.children.push({
                nodeType: Node.TEXT_NODE,
                content,
            })
            index += content.length
        } else {
            // 主要是空格等一些特殊情况
            index++
            // throw new Error('怎么进else了？排查下是何特殊情况')
        }
    }
    console.log(aResult, 'aResult');
}
const AST = parse(templateStr)