const SvgSymbolIconWebpackPlugin = require('@conch/svg-symbol-icon/webpack-plugin.js');
const { icons } = require('@hui-icon-sets/control-host-icon/icons.json');
module.exports = {
    mode: "development",
    context: "/",
    /* 这些模块不参与打包 */
    node: {
        setImmediate: false,
        process: "mock",
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty",
    },
    output: {
        path: "\\dist",
        filename: "js/[name].js",
        publicPath: "/",
        chunkFilename: "js/[name].js",
    },
    resolve: {
        alias: {
            /* \\项目根目录 */
            "@": "\\src",
            // vue运行时文件，不包含编译器
            vue$: "vue/dist/vue.runtime.esm.js",
        },
        extensions: [".mjs", ".js", ".jsx", ".vue", ".json", ".wasm"],
        modules: ["node_modules", "\\node_modules", "\\node_modules\\@vue\\cli-service\\node_modules"],
        plugins: [
            /* config.resolve.plugin('pnp') */
            {},
        ],
    },
    resolveLoader: {
        modules: [
            "\\node_modules\\@vue\\cli-plugin-babel\\node_modules",
            "node_modules",
            "\\node_modules",
            "\\node_modules\\@vue\\cli-service\\node_modules",
        ],
        plugins: [
            /* config.resolve.plugin('pnp-loaders') */
            {},
        ],
    },
    module: {
        /* 不参与解析，因为库本身做掉了，注意。这些是库本身，并不是.vue文件  */
        noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
        rules: [
            /* config.module.rule('vue') */
            {
                test: /\.vue$/,
                use: [
                    /* config.module.rule('vue').use('cache-loader') */
                    /* cache-loader对vue文件进行缓存处理，如果第二次编译时vue文件未改变，则可加快打包速度。
                       vue认为cache-loader对文件缓存的处理比各loader自身做的缓存更好                    
                    */
                    {
                        loader: "\\node_modules\\cache-loader\\dist\\cjs.js",
                        options: {
                            cacheDirectory: "\\node_modules\\.cache\\vue-loader",
                            cacheIdentifier: "3ec084f2",
                        },
                    },
                    /* config.module.rule('vue').use('vue-loader') */
                    /* vue-loader 解析vue文件，将vue文件中的style、template、scritp模块解析成js代码块，被其他模块处理 */
                    {
                        loader: "\\node_modules\\vue-loader\\lib\\index.js",
                        options: {
                            compilerOptions: {
                                whitespace: "condense",
                            },
                            cacheDirectory: "\\node_modules\\.cache\\vue-loader",
                            cacheIdentifier: "3ec084f2",
                        },
                    },
                ],
            },
            /* config.module.rule('images') */
            {
                test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
                use: [
                    /* config.module.rule('images').use('url-loader') */
                    {
                        loader: "\\node_modules\\url-loader\\dist\\cjs.js",
                        options: {
                            limit: 4096,
                            fallback: {
                                /* 大于4kb的用file-loader处理 */
                                loader: "\\node_modules\\file-loader\\dist\\cjs.js",
                                options: {
                                    name: "img/[name].[hash:8].[ext]",
                                },
                            },
                        },
                    },
                ],
            },
            /* config.module.rule('svg') */
            {
                test: /\.(svg)(\?.*)?$/, //svg使用file-loader处理
                use: [
                    /* config.module.rule('svg').use('file-loader') */
                    {
                        loader: "\\node_modules\\file-loader\\dist\\cjs.js",
                        options: {
                            name: "img/[name].[hash:8].[ext]",
                        },
                    },
                ],
            },
            /* config.module.rule('media') */
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use: [
                    /* config.module.rule('media').use('url-loader') */
                    {
                        loader: "\\node_modules\\url-loader\\dist\\cjs.js",
                        options: {
                            limit: 4096, //音视频小文件用url-loader处理
                            fallback: {
                                loader: "\\node_modules\\file-loader\\dist\\cjs.js",
                                options: {
                                    name: "media/[name].[hash:8].[ext]",
                                },
                            },
                        },
                    },
                ],
            },
            /* config.module.rule('fonts') */
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                use: [
                    /* config.module.rule('fonts').use('url-loader') */
                    {
                        loader: "\\node_modules\\url-loader\\dist\\cjs.js",
                        options: {
                            limit: 4096,
                            fallback: {
                                loader: "\\node_modules\\file-loader\\dist\\cjs.js",
                                options: {
                                    name: "fonts/[name].[hash:8].[ext]",
                                },
                            },
                        },
                    },
                ],
            },
            /* config.module.rule('pug') */
            /* 支持pug语法 */
            {
                test: /\.pug$/,
                oneOf: [
                    /* config.module.rule('pug').oneOf('pug-vue') */
                    {
                        resourceQuery: /vue/,
                        use: [
                            /* config.module.rule('pug').oneOf('pug-vue').use('pug-plain-loader') */
                            {
                                loader: "pug-plain-loader",
                            },
                        ],
                    },
                    /* config.module.rule('pug').oneOf('pug-template') */
                    {
                        use: [
                            /* config.module.rule('pug').oneOf('pug-template').use('raw') */
                            {
                                loader: "raw-loader",
                            },
                            /* config.module.rule('pug').oneOf('pug-template').use('pug-plain-loader') */
                            {
                                loader: "pug-plain-loader",
                            },
                        ],
                    },
                ],
            },
            /* config.module.rule('css') */
            {
                test: /\.css$/,
                oneOf: [
                    /* config.module.rule('css').oneOf('vue-modules') */
                    {
                        /* 匹配 <style lang=module></style> 这类文件 */
                        /* 
                      test、exclude、include是resource的简写
                          resource: {
                            test: /\.js$/,
                            exclude: [],
                            include: []
                          }
                      */
                        // 处理 <style lang=module></style>这些文件
                        resourceQuery: /module/,
                        use: [
                            /* config.module.rule('css').oneOf('vue-modules').use('vue-style-loader') */
                            // 最后一步通过vue-style-loader将代码插入到页面中
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('css').oneOf('vue-modules').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]_[local]_[hash:base64:5]",
                                    },
                                },
                            },
                            /* config.module.rule('css').oneOf('vue-modules').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    /* config.module.rule('css').oneOf('vue') */
                    {
                        /* 匹配普通的style标签 <style></style> */
                        resourceQuery: /\?vue/,
                        use: [
                            /* config.module.rule('css').oneOf('vue').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('css').oneOf('vue').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                },
                            },
                            /* config.module.rule('css').oneOf('vue').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    /* config.module.rule('css').oneOf('normal-modules') */
                    {
                        // 匹配.module.xx文件
                        test: /\.module\.\w+$/,
                        use: [
                            /* config.module.rule('css').oneOf('normal-modules').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('css').oneOf('normal-modules').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]_[local]_[hash:base64:5]",
                                    },
                                },
                            },
                            /* config.module.rule('css').oneOf('normal-modules').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    /* config.module.rule('css').oneOf('normal') */
                    {
                        use: [
                            /* config.module.rule('css').oneOf('normal').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('css').oneOf('normal').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                },
                            },
                            /* config.module.rule('css').oneOf('normal').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
            /* config.module.rule('postcss') */
            {
                test: /\.p(ost)?css$/,
                oneOf: [
                    /* config.module.rule('postcss').oneOf('vue-modules') */
                    {
                        resourceQuery: /module/,
                        use: [
                            /* config.module.rule('postcss').oneOf('vue-modules').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('postcss').oneOf('vue-modules').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]_[local]_[hash:base64:5]",
                                    },
                                },
                            },
                            /* config.module.rule('postcss').oneOf('vue-modules').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    /* config.module.rule('postcss').oneOf('vue') */
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            /* config.module.rule('postcss').oneOf('vue').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('postcss').oneOf('vue').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                },
                            },
                            /* config.module.rule('postcss').oneOf('vue').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    /* config.module.rule('postcss').oneOf('normal-modules') */
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            /* config.module.rule('postcss').oneOf('normal-modules').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('postcss').oneOf('normal-modules').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]_[local]_[hash:base64:5]",
                                    },
                                },
                            },
                            /* config.module.rule('postcss').oneOf('normal-modules').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    /* config.module.rule('postcss').oneOf('normal') */
                    {
                        use: [
                            /* config.module.rule('postcss').oneOf('normal').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('postcss').oneOf('normal').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                },
                            },
                            /* config.module.rule('postcss').oneOf('normal').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
            /* config.module.rule('scss') */
            {
                test: /\.scss$/,
                oneOf: [
                    /* config.module.rule('scss').oneOf('vue-modules') */
                    {
                        resourceQuery: /module/,
                        use: [
                            /* config.module.rule('scss').oneOf('vue-modules').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('scss').oneOf('vue-modules').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]_[local]_[hash:base64:5]",
                                    },
                                },
                            },
                            /* config.module.rule('scss').oneOf('vue-modules').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('scss').oneOf('vue-modules').use('sass-loader') */
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: false,
                                },
                            },
                        ],
                    },
                    /* config.module.rule('scss').oneOf('vue') */
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            /* config.module.rule('scss').oneOf('vue').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('scss').oneOf('vue').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                },
                            },
                            /* config.module.rule('scss').oneOf('vue').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('scss').oneOf('vue').use('sass-loader') */
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: false,
                                },
                            },
                        ],
                    },
                    /* config.module.rule('scss').oneOf('normal-modules') */
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            /* config.module.rule('scss').oneOf('normal-modules').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('scss').oneOf('normal-modules').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]_[local]_[hash:base64:5]",
                                    },
                                },
                            },
                            /* config.module.rule('scss').oneOf('normal-modules').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('scss').oneOf('normal-modules').use('sass-loader') */
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: false,
                                },
                            },
                        ],
                    },
                    /* config.module.rule('scss').oneOf('normal') */
                    {
                        use: [
                            /* config.module.rule('scss').oneOf('normal').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('scss').oneOf('normal').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                },
                            },
                            /* config.module.rule('scss').oneOf('normal').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('scss').oneOf('normal').use('sass-loader') */
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: false,
                                },
                            },
                        ],
                    },
                ],
            },
            /* config.module.rule('sass') */
            {
                test: /\.sass$/,
                oneOf: [
                    /* config.module.rule('sass').oneOf('vue-modules') */
                    {
                        resourceQuery: /module/,
                        use: [
                            /* config.module.rule('sass').oneOf('vue-modules').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('sass').oneOf('vue-modules').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]_[local]_[hash:base64:5]",
                                    },
                                },
                            },
                            /* config.module.rule('sass').oneOf('vue-modules').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('sass').oneOf('vue-modules').use('sass-loader') */
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: false,
                                    sassOptions: {
                                        indentedSyntax: true,
                                    },
                                },
                            },
                        ],
                    },
                    /* config.module.rule('sass').oneOf('vue') */
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            /* config.module.rule('sass').oneOf('vue').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('sass').oneOf('vue').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                },
                            },
                            /* config.module.rule('sass').oneOf('vue').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('sass').oneOf('vue').use('sass-loader') */
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: false,
                                    sassOptions: {
                                        indentedSyntax: true,
                                    },
                                },
                            },
                        ],
                    },
                    /* config.module.rule('sass').oneOf('normal-modules') */
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            /* config.module.rule('sass').oneOf('normal-modules').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('sass').oneOf('normal-modules').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]_[local]_[hash:base64:5]",
                                    },
                                },
                            },
                            /* config.module.rule('sass').oneOf('normal-modules').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('sass').oneOf('normal-modules').use('sass-loader') */
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: false,
                                    sassOptions: {
                                        indentedSyntax: true,
                                    },
                                },
                            },
                        ],
                    },
                    /* config.module.rule('sass').oneOf('normal') */
                    {
                        use: [
                            /* config.module.rule('sass').oneOf('normal').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('sass').oneOf('normal').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                },
                            },
                            /* config.module.rule('sass').oneOf('normal').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('sass').oneOf('normal').use('sass-loader') */
                            {
                                loader: "sass-loader",
                                options: {
                                    sourceMap: false,
                                    sassOptions: {
                                        indentedSyntax: true,
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
            /* config.module.rule('less') */
            {
                test: /\.less$/,
                oneOf: [
                    /* config.module.rule('less').oneOf('vue-modules') */
                    {
                        resourceQuery: /module/,
                        use: [
                            /* config.module.rule('less').oneOf('vue-modules').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('less').oneOf('vue-modules').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]_[local]_[hash:base64:5]",
                                    },
                                },
                            },
                            /* config.module.rule('less').oneOf('vue-modules').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('less').oneOf('vue-modules').use('less-loader') */
                            {
                                loader: "E:\\study\\JavaScript\\webpack\\bWebpack\\node_modules\\less-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                },
                            },
                        ],
                    },
                    /* config.module.rule('less').oneOf('vue') */
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            /* config.module.rule('less').oneOf('vue').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('less').oneOf('vue').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                },
                            },
                            /* config.module.rule('less').oneOf('vue').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('less').oneOf('vue').use('less-loader') */
                            {
                                loader: "E:\\study\\JavaScript\\webpack\\bWebpack\\node_modules\\less-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                },
                            },
                        ],
                    },
                    /* config.module.rule('less').oneOf('normal-modules') */
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            /* config.module.rule('less').oneOf('normal-modules').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('less').oneOf('normal-modules').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]_[local]_[hash:base64:5]",
                                    },
                                },
                            },
                            /* config.module.rule('less').oneOf('normal-modules').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('less').oneOf('normal-modules').use('less-loader') */
                            {
                                loader: "E:\\study\\JavaScript\\webpack\\bWebpack\\node_modules\\less-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                },
                            },
                        ],
                    },
                    /* config.module.rule('less').oneOf('normal') */
                    {
                        use: [
                            /* config.module.rule('less').oneOf('normal').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('less').oneOf('normal').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                },
                            },
                            /* config.module.rule('less').oneOf('normal').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('less').oneOf('normal').use('less-loader') */
                            {
                                loader: "E:\\study\\JavaScript\\webpack\\bWebpack\\node_modules\\less-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                },
                            },
                        ],
                    },
                ],
            },
            /* config.module.rule('stylus') */
            {
                test: /\.styl(us)?$/,
                oneOf: [
                    /* config.module.rule('stylus').oneOf('vue-modules') */
                    {
                        resourceQuery: /module/,
                        use: [
                            /* config.module.rule('stylus').oneOf('vue-modules').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('stylus').oneOf('vue-modules').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]_[local]_[hash:base64:5]",
                                    },
                                },
                            },
                            /* config.module.rule('stylus').oneOf('vue-modules').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('stylus').oneOf('vue-modules').use('stylus-loader') */
                            {
                                loader: "stylus-loader",
                                options: {
                                    sourceMap: false,
                                    preferPathResolver: "webpack",
                                },
                            },
                        ],
                    },
                    /* config.module.rule('stylus').oneOf('vue') */
                    {
                        resourceQuery: /\?vue/,
                        use: [
                            /* config.module.rule('stylus').oneOf('vue').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('stylus').oneOf('vue').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                },
                            },
                            /* config.module.rule('stylus').oneOf('vue').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('stylus').oneOf('vue').use('stylus-loader') */
                            {
                                loader: "stylus-loader",
                                options: {
                                    sourceMap: false,
                                    preferPathResolver: "webpack",
                                },
                            },
                        ],
                    },
                    /* config.module.rule('stylus').oneOf('normal-modules') */
                    {
                        test: /\.module\.\w+$/,
                        use: [
                            /* config.module.rule('stylus').oneOf('normal-modules').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('stylus').oneOf('normal-modules').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                    modules: {
                                        localIdentName: "[name]_[local]_[hash:base64:5]",
                                    },
                                },
                            },
                            /* config.module.rule('stylus').oneOf('normal-modules').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('stylus').oneOf('normal-modules').use('stylus-loader') */
                            {
                                loader: "stylus-loader",
                                options: {
                                    sourceMap: false,
                                    preferPathResolver: "webpack",
                                },
                            },
                        ],
                    },
                    /* config.module.rule('stylus').oneOf('normal') */
                    {
                        use: [
                            /* config.module.rule('stylus').oneOf('normal').use('vue-style-loader') */
                            {
                                loader: "\\node_modules\\vue-style-loader\\index.js",
                                options: {
                                    sourceMap: false,
                                    shadowMode: false,
                                },
                            },
                            /* config.module.rule('stylus').oneOf('normal').use('css-loader') */
                            {
                                loader: "\\node_modules\\css-loader\\dist\\cjs.js",
                                options: {
                                    sourceMap: false,
                                    importLoaders: 2,
                                },
                            },
                            /* config.module.rule('stylus').oneOf('normal').use('postcss-loader') */
                            {
                                loader: "\\node_modules\\postcss-loader\\src\\index.js",
                                options: {
                                    sourceMap: false,
                                    plugins: [
                                        function() {
                                            /* omitted long function */
                                        },
                                    ],
                                },
                            },
                            /* config.module.rule('stylus').oneOf('normal').use('stylus-loader') */
                            {
                                loader: "stylus-loader",
                                options: {
                                    sourceMap: false,
                                    preferPathResolver: "webpack",
                                },
                            },
                        ],
                    },
                ],
            },
            /* config.module.rule('js') */
            {
                test: /\.m?jsx?$/,
                exclude: [
                    function() {
                        /* omitted long function */
                    },
                ],
                use: [
                    /* config.module.rule('js').use('cache-loader') */
                    // 使用cache-loader做缓存，对比react是使用babel-loader内自带的cache做缓存
                    {
                        loader: "\\node_modules\\cache-loader\\dist\\cjs.js",
                        options: {
                            cacheDirectory: "\\node_modules\\.cache\\babel-loader",
                            cacheIdentifier: "304caf9a",
                        },
                    },
                    /* config.module.rule('js').use('babel-loader') */
                    {
                        loader: "\\node_modules\\babel-loader\\lib\\index.js",
                    },
                ],
            },
            /* config.module.rule('eslint') */
            {
                enforce: "pre",
                test: /\.(vue|(j|t)sx?)$/,
                exclude: [/node_modules/, "\\node_modules\\@vue\\cli-service\\lib"],
                use: [
                    /* config.module.rule('eslint').use('eslint-loader') */
                    {
                        loader: "\\node_modules\\eslint-loader\\index.js",
                        options: {
                            extensions: [".js", ".jsx", ".vue"],
                            cache: true,
                            cacheIdentifier: "74d784fa",
                            emitWarning: false,
                            emitError: false,
                            eslintPath: "\\node_modules\\eslint",
                            formatter: undefined,
                        },
                    },
                ],
            },
        ],
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                /* node-nodules的内容打包到vendors */
                vendors: {
                    name: "chunk-vendors",
                    test: /[\\\/]node_modules[\\\/]/,
                    priority: -10,
                    chunks: "initial",
                },
                /* 使用到2遍的公共东西提取到chunk-common */
                common: {
                    name: "chunk-common",
                    minChunks: 2,
                    priority: -20,
                    chunks: "initial",
                    reuseExistingChunk: true,
                },
            },
        },
        minimizer: [
            /* config.optimization.minimizer('terser') */
            /* TerserPlugin压缩插件选项 */
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        arrows: false,
                        collapse_vars: false,
                        comparisons: false,
                        computed_props: false,
                        hoist_funs: false,
                        hoist_props: false,
                        hoist_vars: false,
                        inline: false,
                        loops: false,
                        negate_iife: false,
                        properties: false,
                        reduce_funcs: false,
                        reduce_vars: false,
                        switches: false,
                        toplevel: false,
                        typeofs: false,
                        booleans: true,
                        if_return: true,
                        sequences: true,
                        unused: true,
                        conditionals: true,
                        dead_code: true,
                        evaluate: true,
                    },
                    mangle: {
                        safari10: true,
                    },
                },
                sourceMap: true,
                cache: true,
                parallel: true,
                extractComments: false,
            }),
        ],
    },
    plugins: [
        /* config.plugin('vue-loader') */
        new VueLoaderPlugin(),
        /* config.plugin('define') */
        new DefinePlugin({
            "process.env": {
                NODE_ENV: '"development"',
                BASE_URL: '"/"',
            },
        }),
        /* config.plugin('case-sensitive-paths') */
        new CaseSensitivePathsPlugin(), // 大小写一致 //友好错误提示
        /* config.plugin('friendly-errors') */ new FriendlyErrorsWebpackPlugin({
            additionalTransformers: [
                function() {
                    /* omitted long function */
                },
            ],
            additionalFormatters: [
                function() {
                    /* omitted long function */
                },
            ],
        }),
        /* config.plugin('html') */
        new HtmlWebpackPlugin({
            title: "vue_cli",
            templateParameters: function() {
                /* omitted long function */
            },
            template: "\\public\\index.html",
        }), //预加载插件
        new SvgSymbolIconWebpackPlugin({ icons }),
        /* config.plugin('preload') */ new PreloadPlugin({
            rel: "preload", // 兼容性较差，空闲时加载，性能更高
            include: "initial",
            fileBlacklist: [/\.map$/, /hot-update\.js$/], //map和热更新文件先不加载
        }),
        /* config.plugin('prefetch') */
        new PreloadPlugin({
            rel: "prefetch",
            include: "asyncChunks",
        }), // 复制插件，将public文件夹下的内容赋值到dist文件夹下
        /* config.plugin('copy') */ new CopyPlugin([
            {
                from: "\\public",
                to: "\\dist",
                toType: "dir",
                ignore: [
                    // 不复制的内容
                    ".DS_Store",
                    {
                        glob: "index.html",
                        matchBase: false,
                    },
                ],
            },
        ]),
    ],
    entry: {
        app: ["./src/main.js"],
    },
};
