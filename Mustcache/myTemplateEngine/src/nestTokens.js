
export default (tokens) => {
    // console.log(tokens, 22);
    const nestTokens = [];
    // 栈结构，遇见#号时压栈，遇见/时出栈
    const sections = []

    // console.log(tokens);
    for (let index = 0; index < tokens.length; index++) {
        const element = tokens[index];
        if (element[0] === "#") {
            // 创建一个数组，以收集子元素
            element[2] = []
            sections.push(element);
        } else if (element[0] === "/") {
            const section = sections.pop()
            if (!sections.length) {
                // 该部分section为最外层#和/结构，直接压入nestTokens。
                nestTokens.push(section)
            } else {
                // 如果sections还有长度，则说明该部分section被上一层包裹，所以压入上一层的第二项中
                // sections.length - 1 是当前的栈顶
                sections[sections.length - 1][2].push(section)
            }
        } else {
            if (!sections.length) {
                // 当前项并没有被#和/包裹，直接压入nestTokens
                nestTokens.push(element)
            } else {
                // 当前项被#和/包裹，压入栈结构的最上层
                sections[sections.length - 1][2].push(element)
            }
        }
    }
    return nestTokens
}