
export default (tokens) => {
    // 最终形成的嵌套数组
    const nestTokens = [];
    // 栈结构，遇见#号时压栈，遇见/时出栈
    const sections = []


    // 个人实现（成功）
    // for (let index = 0; index < tokens.length; index++) {
    //     const element = tokens[index];
    //     if (element[0] === "#") {
    //         // 创建一个数组，以收集子元素
    //         element[2] = []
    //         sections.push(element);
    //     } else if (element[0] === "/") {
    //         const section = sections.pop()
    //         if (!sections.length) {
    //             // 该部分section为最外层#和/结构，直接压入nestTokens。
    //             nestTokens.push(section)
    //         } else {
    //             // 如果sections还有长度，则说明该部分section被上一层包裹，所以压入上一层的第二项中
    //             // sections.length - 1 是当前的栈顶
    //             sections[sections.length - 1][2].push(section)
    //         }
    //     } else {
    //         if (!sections.length) {
    //             // 当前项并没有被#和/包裹，直接压入nestTokens
    //             nestTokens.push(element)
    //         } else {
    //             // 当前项被#和/包裹，压入栈结构的最上层
    //             sections[sections.length - 1][2].push(element)
    //         }
    //     }
    // }



    // 源码实现

    // 新建一个收集器，它的地址指向当前正在收集普通数据（即非#和/的项）的selection
    let collector = nestTokens; //最开始收集的肯定是结果数组
    for (let index = 0; index < tokens.length; index++) {
        const element = tokens[index];
        if (element[0] === "#") {
            collector.push(element) // 当遇见#号，首先要把当前这一项push进nestTokens
            sections.push(element);
            // 收集器地址指向变为当前token的第二项
            collector = element[2] = [] // 其次当前这项肯定需要一个下标为2的数组，用来存放子元素
        } else if (element[0] === "/") {
            sections.pop()
            if (!sections.length) {
                // sections是空的，就说明当前收集的为最高层数组（结果数组）nestTokens。改变地址。
                collector = nestTokens
            } else {
                collector = sections[sections.length - 1][2]
            }
        } else {
            collector.push(element)
        }
    }

    /* 总结
    *  该nestTokens最重要的环节就是最后那个else，将当前项push进收集器。
    *  它的整体思路将原数组一项一项处理。从上到下遍历每一项，根据是否被#和/包含，或者包含层数的不同，
    *  改变他们最终的去处，这样遍历完后，每一项都到了它应该去的地方。组合后就出最后的结果了
    *
    */

    return nestTokens
}