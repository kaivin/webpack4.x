const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成 html 文件
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 分离 css 文件
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 清除生成文件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // 压缩 JS
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩 css

// 版本号
const appVersion = new Date().getTime()
// 网站图标
const favicon = path.resolve(process.cwd(), 'src/favicon.ico')

module.exports={
    entry:{
        app:[path.resolve(__dirname, 'src/index.js')],
    },
    output:{
        path:path.resolve(__dirname,'dist'),
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[name].[chunkhash].js',
        publicPath:""
    },
    mode:"production",
    // 开发工具
    devtool: 'cheap-module-source-map',
    // 加载器 loader 配置项
    module:{
        rules:[
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
                            publicPath:'/'
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
        splitChunks: {
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                priority: 10,
                enforce: true,
              },
            }
        },
        // runtimeChunk: {
        //     name: 'manifest'
        // },
        minimizer: [ // 用于配置 minimizers 和选项
            // webpack 不支持es6语法的压缩，这里要使用需要babel配合
            // new UglifyJsPlugin({
            //     cache: true,
            //     parallel: true,
            //     sourceMap: true // set to true if you want JS source maps
            // }),// 压缩 js
            // new OptimizeCSSAssetsPlugin({}), // 压缩 css
        ]
    },
    // 插件配置项
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',//输出文件的名称
            template: path.resolve(__dirname, 'src/index.html'),//模板文件的路径
            title:'webpack4.x',//配置生成页面的标题
            // minify:{
            //     removeRedundantAttributes:true, // 删除多余的属性
            //     collapseWhitespace:true, // 折叠空白区域
            //     removeAttributeQuotes: true, // 移除属性的引号
            //     removeComments: true, // 移除注释
            //     collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
            // }, // 压缩 html 文件
            favicon,
            appVersion
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash].css',
            chunkFilename: 'css/[name].[hash].css',
        }),
        new CleanWebpackPlugin(),// 删除 dist 文件夹
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