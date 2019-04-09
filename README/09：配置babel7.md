
## 安装 babel 相关插件

#### 2019.04.09
此页面有部分扩充内容<a href="#babel个性化配置">点击查看</a>   

```
npm install babel-loader @babel/core @babel/preset-env @babel/runtime @babel/plugin-transform-runtime -D
```


#### 项目根目录添加 `.babelrc` 文件

在 `.babelrc` 文件中加入以下代码：

```
{
  "presets": [
    ["@babel/preset-env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      },
      "useBuiltIns": "usage"
    }]
  ],
  "plugins": [
    "@babel/plugin-transform-runtime"
  ]
}
```

同时，需要在 `webpack.dev.conf.js` 文件中，增加 `babel-loader`,代码如下：

```
module: {
    rules: [
        {
            test: /\.(js|jsx)$/,
            use: ['babel-loader?cacheDirectory=true'],
            include: path.resolve(__dirname, 'src')
        }
    ]
}
```

至此，`babel` 相关配置，告一段落

#### <a name="babel个性化配置">babel个性化配置</a> 
新版中 `@babel/runtime` 只包含了一些 `helpers`，如果需要 `core-js` `polyfill` 浏览器不支持的 `API`，可以用 `transform` 提供的选项 `{"corejs": 2}` 并安装依赖 `@babel/runtime-corejs2`。

由于本项目配置了`"useBuiltIns": "usage"`，并且本项目的`superSlide`又依赖`core-js`，所以这里需要做一些特定的配置，并需要下载`@babel/runtime-corejs2`插件。

```
yarn add @babel/runtime-corejs2 -D
```
修改`.babelrc`文件：
```
{
  // targets, useBuiltIns 等选项用于编译出兼容目标环境的代码
  // 其中 useBuiltIns 如果设为 "usage"
  // Babel 会根据实际代码中使用的 ES6/ES7 代码，以及与你指定的 targets，按需引入对应的 polyfill
  // 而无需在代码中直接引入 import '@babel/polyfill'，避免输出的包过大，同时又可以放心使用各种新语法特性。
    "presets": [
      ["@babel/preset-env", {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        },
        "useBuiltIns": "usage"
      }]
    ],
    "plugins": [
      ["@babel/plugin-transform-runtime",{
        "corejs": 2
      }]
    ]
}
```


## 相关文件配置信息更新情况

#### 以下为本文已涉及到的配置文件的当前详细信息


1. `webpack.dev.conf.js` 文件现在的配置信息情况：

```
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const open = require('opn');//打开浏览器
const chalk = require('chalk');// 改变命令行中输出日志颜色插件
const ip = require('ip').address();

module.exports = {
    // 入口文件配置项
    entry:{
        app:[path.resolve(__dirname, 'src/index.js')],
    },
    // 输出文件配置项
    output:{
        path:path.resolve(__dirname,"dist"),
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[name].[chunkhash].js',
        publicPath:""
    },
    // 开发工具
    devtool: 'eval-source-map',
    // webpack4.x 环境配置项
    mode:"development",
    // 加载器 loader 配置项
    module:{
        rules:[
            {
                test: /\.(js|jsx)$/,
                use: ['babel-loader?cacheDirectory=true'],
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.css$/,
                use: [{
                        loader: 'style-loader'
                    },{
                        loader: 'css-loader'
                    },{
                        loader: 'postcss-loader',
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
                    {
                        loader: 'style-loader', 
                    },
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
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader', 
                    },
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
                test: /\.(png|jp?g|gif|svg)$/,
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
            }, {
                test:/\.html$/,
                use:[
                    {
                        loader:"html-loader",
                        options:{
                            attrs:["img:src","img:data-src"] 
                        }
                    }
                ]
            }
        ]
    },
    // 插件配置项
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',//输出文件的名称
            template: path.resolve(__dirname, 'src/index.html'),//模板文件的路径
            title:'webpack-主页',//配置生成页面的标题
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    // 开发服务配置项
    devServer: {
        port: 8080,
        contentBase: path.resolve(__dirname, 'dist'),
        historyApiFallback: true,
        host: ip,
        overlay:true,
        hot:true,
        inline:true,
        after(){
            open(`http://${ip}:${this.port}`)
            .then(() => {
                console.log(chalk.cyan(`http://${ip}:${this.port} 已成功打开`));
            })
            .catch(err => {
                console.log(chalk.red(err));
            });
        }
    }
}
```