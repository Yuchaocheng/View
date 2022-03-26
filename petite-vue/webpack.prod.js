const { merge } = require("webpack-merge");
const webpack = require("webpack");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin").default;

const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const path = require("path");

const BASE_CONFIG = require("./webpack.base");

const PRODUCT_CONFIG = merge(BASE_CONFIG, {
    mode: "production",
    output: {
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                // 以<style>标签形式引用css
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
        ],
    },
    plugins: [
        //提取css到style.css中
        new MiniCssExtractPlugin({
            filename: "css/[contenthash:10].css",
        }),
        new BundleAnalyzerPlugin({
            analyzerPort: 8889,
        }),
        //使用插件定义全局变量DEV
        new webpack.DefinePlugin({
            DEV: JSON.stringify("production"),
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: "all",
            minChunks: 1,
            minSize: 1,
            cacheGroups: {
                // 打包业务中公共代码
                common: {
                    name: "common",
                    test: /[\\/]common[\\/]/,
                    priority: 0,
                },
                // 打包第三方库的文件
                vendor: {
                    name: "vendor",
                    test({ resource }) {
                        const isNodeModules = /[\\/]node_modules[\\/]/.test(resource);
                        const isLibs = /[\\/]common[\\/]libs[\\/]/.test(resource);
                        if (isNodeModules || isLibs) {
                            return true;
                        }
                    },
                    priority: 10,
                },
                // 打包组件
                components: {
                    name: "components",
                    test: /[\\/]components[\\/]/,
                    priority: 20,
                },
            },
        },
        runtimeChunk: { name: "manifest" }, // 运行时代码
        minimizer: [
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
});

console.log(PRODUCT_CONFIG, "PRODUCT_CONFIG");
module.exports = PRODUCT_CONFIG;
