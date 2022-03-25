const HtmlWebpackPlugin = require("html-webpack-plugin");

const path = require("path");

const DIST_PATH = path.resolve(__dirname, "dist");
const SRC_PATH = path.resolve(__dirname, "src");

module.exports = {
    stats: {
        errorDetails: true,
    },

    entry: path.resolve(SRC_PATH, "index.js"),
    output: {
        path: path.resolve(DIST_PATH),
        filename: "[name]/[chunkhash].js",
        chunkFilename: "[name]/[chunkhash].min.js",
        // 打包输出为一个库
        library: {
            name: "HiPei", //整个库向外暴露的变量名
            type: "umd", //库暴露的方式
        },
    },
    resolveLoader: {
        modules: [path.join(__dirname, "node_modules")],
    },
    resolve: {
        alias: {
            "@": SRC_PATH,
            "@service": path.join(SRC_PATH, "./common/service"),
            "@libs": path.join(SRC_PATH, "./common/libs"),
            "@util": path.join(SRC_PATH, "./common/utils"),
            "@mini-vue": path.resolve(SRC_PATH, "./common/libs/petite-vue.js"),
        },
        modules: [path.join(__dirname, "node_modules"), SRC_PATH],
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(SRC_PATH, "index.html"),
        }),
    ],
};
