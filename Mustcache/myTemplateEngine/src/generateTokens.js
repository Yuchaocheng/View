import Scanner from "./Scanner"
import nestTokensFun from "./nestTokens";

/* 将模板字符串变为tokens数组 */
export default ((templateStr) => {
    const scanner = new Scanner(templateStr);
    const tokens = [];
    let num = 0;  // 开发时做一个保护
    while (!scanner.eos() || num > 1000) {
        let words = scanner.scanUntil(["{{"])
        if (words) {
            tokens.push(["text", words]);
        }
        words = scanner.scanUntil(["}}"])
        if (words) {
            if (words.startsWith("#")) {
                tokens.push(["#", words.slice(1)]);
            } else if (words.startsWith("/")) {
                tokens.push(["/", words.slice(1)]);
            }
            else {
                tokens.push(["name", words]);
            }
        }
        num++
    }
    const nexstTokes = nestTokensFun(tokens)
    console.log(nexstTokes, 111);
})