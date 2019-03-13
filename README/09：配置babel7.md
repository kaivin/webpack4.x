
## 安装 babel 相关插件

```
npm install babel-loader @babel/core @babel/preset-env @babel/runtime @babel/plugin-transform-runtime -D
```

前面虽然已经说到 `webpack` 已经支持了 `es6` 的一些新语法，但是因为没有具体明文说明，为了保险起见，还是老老实实配置 `babel` 吧~


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

同时，需要在 `webpack.dev.config.js` 文件中，增加 `babel-loader`,代码如下：

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



## 相关文件配置信息更新情况

#### 以下为本文已涉及到的配置文件的当前详细信息


1. `webpack.dev.config.js` 文件现在的配置信息情况：

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
            }, 
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


2. `package.json` 文件现在的配置信息情况：

```
{
  "name": "webpack-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack --config webpack.dev.config.js",
    "start": "webpack-dev-server --config webpack.dev.config.js --color --progress"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {},
  "devDependencies": { 
    "@babel/core": "^7.3.4",
    "@babel/plugin-transform-runtime": "^7.3.4",
    "@babel/preset-env": "^7.3.4",
    "@babel/runtime": "^7.3.4",
    "autoprefixer": "^8.6.4",
    "babel-loader": "^8.0.5",
    "chalk": "^2.4.0",
    "css-loader": "^0.28.11",
    "file-loader": "^1.1.11",
    "html-webpack-plugin": "^3.2.0",
    "ip": "^1.1.5",
    "less": "^3.0.2",
    "less-loader": "^4.1.0",
    "node-sass": "^4.8.3",
    "opn": "^5.3.0",
    "postcss-loader": "^2.1.4",
    "postcss-scss": "^1.0.5",
    "sass-loader": "^7.0.1",
    "style-loader": "^0.21.0",
    "url-loader": "^1.0.1",
    "webpack": "^4.6.0",
    "webpack-cli": "^2.0.15",
    "webpack-dev-server": "^3.1.3"
  },
  "browserslist": [
    "defaults",
    "not ie < 11",
    "last 2 versions",
    "> 1%",
    "iOS 7",
    "last 3 iOS versions"
  ]
}
```
