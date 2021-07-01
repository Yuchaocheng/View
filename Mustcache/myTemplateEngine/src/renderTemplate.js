

import Utils from "../../../Utils"

export default (initTokens, initData) => {
    let resultStr = "";
    const render = (tokens, data) => {

        const length = tokens.length
        for (let index = 0; index < length; index++) {
            const token = tokens[index];
            // /* 这里有个坑，用 Utils.lookup这个函数解决 */
            // var test = {
            //     a: {
            //         b: 5
            //     }
            // }
            // /* 要访问b  */
            // let b = test.a.b //成功

            // let b2 = test["a.b"] // 这样是访问不到的

            const mapObj = {
                text() {
                    resultStr += token[1]
                },
                name() {
                    /* 循环时的特殊语法，表示数据本身 */
                    if (token[1] === ".") {
                        resultStr += data
                    } else {
                        // 这里使用lookup是为了防止  a.b.c这样的属性
                        resultStr += Utils.lookup(data, token[1])
                    }
                },
                /* #标记的token需要根据类型做不同的处理 */
                "#"() {
                    const temData = Utils.lookup(data, token[1])
                    /* #号后如果是数组，则需要遍历render */
                    if (Array.isArray(temData)) {
                        temData.forEach(item => {
                            /* 注意，render函数返回resultStr不用再累增了，因为resultStr相当于全局变量，在每次text和name中已经增加
                               如果render函数中用函数内部的局部变量，那样的话就需要返回并且累增。
                            */
                            render(token[2], item)
                        })
                    } else if ("boolean" === typeof temData) {
                        /* #号后如果是布尔值，只有为true时才需要render */
                        if (temData) {
                            render(token[2], data)
                        }
                    }
                }
            }
            if (mapObj.hasOwnProperty(token[0])) {
                mapObj[token[0]]()
            }
        }
        return resultStr
    }
    render(initTokens, initData)
    return resultStr
}