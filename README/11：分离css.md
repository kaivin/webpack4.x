## 分离 css

在之前的版本中，分离 `css` 一直用的是 `extract-text-webpack-plugin`，但是如果在 `webpack4.x` 上继续使用，你会发现它会报错的，要想继续使用这个插件，必须 `npm i extract-text-webpack-plugin@next -D` 才可以，这样下载的就是最新的版本，而不是稳定版本，在写本文时，就是 `4.0beta` 版本，当然如果这个版本已经是稳定版本了，那就不用加 `@next` 了~

当然 `webpack` 团队专门针对 `webpack4.x` 又另外写了一个插件来做这件工作，那就是 `mini-css-extract-plugin`

安装插件

```
npm i mini-css-extract-plugin -D
```

需要用到该插件的是生产环境，开发环境，我们不需要去把 `CSS` 单独分离出来，首先，修改 `webpack.production.config.js` 文件：

先引入：

```
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
```

然后修改 `css` `scss` `less` 所使用的 `loader`

```
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
```

可以看出，和开发相比，我们只是把 `style-loader` 的引用整体改为了 `MiniCssExtractPlugin.loader`

接下来，还需要在 `plugins` 中添加引用

```
new MiniCssExtractPlugin({
    filename: 'css/[name].[hash].css',
    chunkFilename: 'css/[name].[hash].css',
})
```

到此，我们分离 `CSS` 就算全部完成了，运行命令 `npm run build` 查看效果

我们打开 `bin` 文件夹，可以看到 `css` 文件夹下已经生成了 `app.css` 文件，而且 `index.html` 文件中也已经自动引入了该文件

直接在浏览器打开该文件，一切显示正常，说明分离成功~


## 相关文件配置信息更新情况

#### 以下为本文已涉及到的配置文件的当前详细信息


1. `webpack.production.config.js` 文件现在的配置信息情况：

```
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',//输出文件的名称
            template: path.resolve(__dirname, 'src/index.html'),//模板文件的路径
            title:'webpack-主页',//配置生成页面的标题
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
    "start": "webpack-dev-server --config webpack.dev.config.js --color --progress"
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
