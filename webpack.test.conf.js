const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成 html 文件
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 分离 css 文件
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清除生成文件
const copyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 版本号
const appVersion = new Date().getTime()
// 网站图标
const favicon = path.resolve(process.cwd(), 'src/favicon.ico')

module.exports={
    entry:{
        app:[path.resolve(__dirname, 'src/index.js')],
        superSlide: [path.resolve(__dirname, 'src/assets/js/jquery.SuperSlide.2.1.1.js')],
    },
    output:{
        path:path.resolve(__dirname,'test'),
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[name].[chunkhash].js',
        publicPath:"/"
    },
    mode:"production",
    // 开发工具
    devtool: 'cheap-module-source-map',
    // 加载器 loader 配置项
    module:{
        rules:[
            {
                test: require.resolve('jquery'),
                use: [
                    {
                    loader: 'expose-loader',
                    options: 'jQuery'
                },
                {
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader?cacheDirectory=true'],
                include: [path.resolve(__dirname, 'src'), path.resolve('node_modules/webpack-dev-server/client')]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader',
                      options: {
                        sourceMap: true,
                        config: {
                            path: 'postcss.config.js'
                        }
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader', 
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: 'postcss.config.js'
                            }
                        }
                    },
                    {
                        loader: 'sass-loader', 
                        options: { sourceMap: true }
                    }
                ],
                exclude: /node_modules/
            },{// 编译 less 
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader', 
                        options: {
                            importLoaders: 1,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            config: {
                                path: 'postcss.config.js'
                            }
                        }
                    },
                    {
                        loader: 'less-loader', 
                        options: { 
                            sourceMap: true,
                        }
                    }
                ]
            },
            {
                test: /\.(png|jp?g|gif|svg|ico)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,        // 小于8192字节的图片打包成base 64图片
                            name:'images/[name].[hash:8].[ext]',
                            publicPath:''
                        }
                    }
                ]
            },
            {
                // 文件依赖配置项——字体图标
                test: /\.(woff|woff2|svg|eot|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192, 
                        name: 'fonts/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, {
                // 文件依赖配置项——音频
                test: /\.(wav|mp3|ogg)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192, 
                        name: 'audios/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, {
                // 文件依赖配置项——视频
                test: /\.(ogg|mpeg4|webm)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192, 
                        name: 'videos/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, 
        ]
    },
    optimization: {
        namedChunks: true,
        moduleIds: 'hashed',
        splitChunks: {
            maxInitialRequests: 6,
            cacheGroups: {
                dll: {
                    chunks:'all',
                    test: /[\\/]node_modules[\\/](jquery|core-js|vue|vue-router)[\\/]/,
                    name: 'dll',
                    priority: 2,
                    enforce: true,
                    reuseExistingChunk: true
                },
                superSlide: {
                    chunks:'all',
                    test: /[\\/]src[\\/]assets[\\/]js[\\/]/,
                    name: 'superSlide',
                    priority: 1,
                    enforce: true,
                    reuseExistingChunk: true
                },
                commons: {
                    name: 'commons',
                    minChunks: 2,//Math.ceil(pages.length / 3), 当你有多个页面时，获取pages.length，至少被1/3页面的引入才打入common包
                    chunks:'all',
                    reuseExistingChunk: true
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        },
    },
    // 插件配置项
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',//输出文件的名称
            template: path.resolve(__dirname, 'src/index.html'),//模板文件的路径
            title:'webpack4.x',//配置生成页面的标题
            favicon,
            appVersion
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css',
            chunkFilename: 'css/[name].[hash].css',
        }),
        new CleanWebpackPlugin(),// 删除 dist 文件夹
        new copyWebpackPlugin([
            {
                from:path.resolve(__dirname+'/static'),// 打包的静态资源目录地址
                to:'./static' // 打包到dist下面的static
            },
            {
                from:path.resolve(__dirname+'/README'),// 打包的静态资源目录地址
                to:'./README' // 打包到dist下面的README
            },
        ]),
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            //  是否在默认浏览器中自动打开报告
            openAnalyzer: false,
            //  将在“服务器”模式下使用的端口启动HTTP服务器。
            analyzerPort: 9528, 
        })
    ],
    resolve: {
        // 设置可省略文件后缀名
        extensions: [' ','.js','.json','.jsx','.vue'],
        // 查找 module 的话从这里开始查找;
        modules: [path.resolve(__dirname, "src"), path.resolve(__dirname, "node_modules")], // 绝对路径;
        // 配置路径映射（别名）
        alias: {
          '@': path.resolve('src'),
        }
    },
}