const path = require("path");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        filename: "bundle.js"
    },
    devServer: {
        // 静态资源依赖文件
        contentBase: path.resolve(__dirname, "dist"),
        compress: false,
        port: 8999,
        open: true,
        // 虚拟打包的路径，bundle.js文件没有真正的生成
        publicPath: "/xuni/"
    },
    target: "web"
}