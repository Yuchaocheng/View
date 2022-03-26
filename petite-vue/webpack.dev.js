//引入webpack-merge插件进行合并
const { merge } = require("webpack-merge");
const webpack = require("webpack");

const BASE_CONFIG = require("./webpack.base");
let DEV_CONFIG = {
    mode: "development",
    module: {
        rules: [
            {
                test: /\.css$/,
                // 以<style>标签形式引用css
                use: ['style-loader', "css-loader"],
            },
        ],
    },
    devServer: {
        open: true,
        port: 8085,
        host: "local-ip",
        hot: true,
        client: {
            progress: true,
        },
        proxy: {
            "/ISAPI": {
                target: "http://10.12.99.195",
            },
            "/SDK": {
                target: "http://10.12.99.195",
            },
        },
    },
    devtool: "source-map",
    plugins: [
        //定义全局变量
        new webpack.DefinePlugin({
            DEV: JSON.stringify("dev"),
        }),
    ],
};

module.exports = merge(BASE_CONFIG, DEV_CONFIG);
