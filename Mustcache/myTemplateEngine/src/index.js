import generateTokens from "./generateTokens"
import renderTemplate from "./renderTemplate"
window.templateEngine = {
    render(templateStr, data) {
        // 根据模板字符串生成tokens数组
        const nestTokens = generateTokens(templateStr);

        // 根据tokens数组和数据生成dom字符串
        const domStr = renderTemplate(nestTokens, data);
        return domStr
    }
}
