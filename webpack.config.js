const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
<<<<<<< HEAD
    mode: "development",
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /.js/,
                loader:"babel-loader",
                options:{
                    plugins:["transform-vue-jsx"]
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(eot|svg|ttf|woff|)$/,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        host:'0.0.0.0',
        useLocalIp:true,
        port: 8899,
        compress: false,
        open: true,
    },
=======
  mode: 'development',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /.js/,
        loader: 'babel-loader',
        options: {
          plugins: ['transform-vue-jsx']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 8899,
    compress: false,
    open: true
  }
>>>>>>> 2c5633e3a756149e2c28853baabe9f237f7763f7
};
