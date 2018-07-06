## clean-webpack-plugin

在上一章我们把 `css` 单独抽离出来，但是打开 `js` 文件夹，会发现，这里有两个 `app.js` 文件，只是 `hash` 值不同而已，打开 `bin/index.html` 文件，发现其引用了其中的一个，也就是说，另一个是完全没用的，当我们修改入口文件的 `js` 代码，再次执行 `npm run build` 时，会发现 `js` 文件夹又会生成新的 `app.js` 文件，我们只需要被引用的那一个，其他的我们都需要删除它，这里需要用到 `clean-webpack-plugin`

```
npm i clean-webpack-plugin -D
```

修改 `webpack.production.config.js` 文件，添加引用

```
const CleanWebpackPlugin = require('clean-webpack-plugin');
```

然后在 `plugins` 中使用该插件

```
new CleanWebpackPlugin(['./bin']),// 删除 bin 文件夹
```

再次执行 `npm run build` 查看 `bin/js` 文件夹内的文件，已经只存在一个被 `bin/index.html` 引用的 `app.js` 文件了~


## 相关文件配置信息更新情况

#### 以下为本文已涉及到的配置文件的当前详细信息


1. `webpack.production.config.js` 文件现在的配置信息情况：

```
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    // 入口文件配置项
    entry:{
        app:[path.resolve(__dirname, 'src/index.js')],
    },
    // 输出文件配置项
    output:{
        path:path.resolve(__dirname,"bin"),
        filename: 'js/[name].[chunkhash].js',
        chunkFilename: 'js/[name].[chunkhash].js',
        publicPath:""
    },
    // 开发工具
    devtool: 'cheap-module-source-map',
    // webpack4.x 环境配置项
    mode:"production",
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
                use: [
                    MiniCssExtractPlugin.loader,
                    {
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
            },
            {
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
        new CleanWebpackPlugin(['./bin']),// 删除 bin 文件夹
        new webpack.HashedModuleIdsPlugin(),// 实现持久化缓存
        new HtmlWebpackPlugin({
            filename: 'index.html',// 输出文件的名称
            template: path.resolve(__dirname, 'src/index.html'),// 模板文件的路径
            title:'webpack-主页',// 配置生成页面的标题
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash].css",
            chunkFilename: "css/[name].[hash].css"
        })
    ],
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
    "start": "webpack-dev-server --config webpack.dev.config.js --color --progress",
    "build": "webpack --config webpack.production.config.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {},
  "devDependencies": { 
    "autoprefixer": "^8.6.4",
    "babel-cli": "^6.26.0",
    "babel-core": "^6.26.0",
    "babel-loader": "^7.1.4",
    "babel-plugin-transform-decorators-legacy": "^1.3.4",
    "babel-plugin-transform-runtime": "^6.23.0",
    "babel-preset-env": "^1.6.1",
    "chalk": "^2.4.0",
    "clean-webpack-plugin": "^0.1.19",
    "css-loader": "^0.28.11",
    "file-loader": "^1.1.11",
    "html-webpack-plugin": "^3.2.0",
    "ip": "^1.1.5",
    "less": "^3.0.2",
    "less-loader": "^4.1.0",
    "mini-css-extract-plugin": "^0.4.0",
    "node-sass": "^4.8.3",
    "opn": "^5.3.0",
    "postcss-loader": "^2.1.4",
    "postcss-scss": "^1.0.5",
    "precss": "^3.1.2",
    "sass-loader": "^7.0.1",
    "style-loader": "^0.21.0",
    "url-loader": "^1.0.1",
    "webpack": "^4.6.0",
    "webpack-cli": "^2.0.15",
    "webpack-dev-server": "^3.1.3"
  }
}
```
