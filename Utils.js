

class Utils {
    // 根据.，取到多层属性
    lookup(obj, attrName) {
        let result = JSON.parse(JSON.stringify(obj))// 不希望改变原数组，需要深拷贝。这里做简单处理。
        const attrArr = attrName.split(".")
        while (attrArr.length) {
            const curAttr = attrArr.shift();
            if (typeof result === "object" && result !== null) {
                result = result[curAttr]
            } else {
                // 取不到返回null
                return null
            }
        }
        return result
    }
}


/* 测试 */

// const utils = new Utils()

// const obj = {
//     a: {
//         b: {
//             c: "cccc"
//         }
//     }
// }
// const result = utils.lookup(obj, "a.b.c")
// console.log(obj,"obj");
// console.log(result, "result");

export default new Utils()