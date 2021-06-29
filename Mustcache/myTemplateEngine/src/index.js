import generateTokens from "./generateTokens"
window.templateEngine = {
    render(templateStr) {
        generateTokens(templateStr)
    }
}
