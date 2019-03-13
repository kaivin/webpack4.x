## 编译 CSS 文件

处理 `css` 的相关技术有 `postcss`、 `scss`、`less`，接下来，会一一介绍

#### `.css` 文件的编译

编译 `.css` 文件，需要用到 `css-loader` 和 `style-loader`

`css-loader` 使你能够使用类似 `@import` 和 `url(...)` 的方法实现 `require()` 的功能；

`style-loader` 将所有的计算后的样式加入页面中； 二者组合在一起使你能够把样式表嵌入 `webpack` 打包后的JS文件中。

安装相关插件

```
npm install css-loader style-loader -D
```

修改在 `webpack.dev.config.js` 文件，新增 `module` 配置，添加如下代码：

```
// 加载器 loader 配置项
module:{
    rules:[
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
    ]
},
```

开始测试效果，在 `src` 文件夹下 新建 `css/reset.css` 文件，并添加如下代码：

```
body{
    margin:0;
    padding:0;
    color:red;
}
```

在入口文件 `src/index.js` 顶部引入该样式文件

```
import './css/reset.css';
```

执行命令 `npm start` 查看效果，文字已经变成红色了~ 配置成功


#### 使用 postcss 插件

对于 `CSS3` 的许多特性来说，需要添加各种浏览器兼容前缀，开发过程中，这样加太麻烦，`postcss` 帮你自动添加各种浏览器前缀

安装相关插件

```
npm install postcss-loader autoprefixer -D
```

首先需要在根目录创建 `postcss.config.js` 文件，添加如下内容

```
module.exports = {
    plugins: [
      require('autoprefixer')
    ]
}
```

修改 `webpack.dev.config.js` 文件的 `module` 配置如下：

```
// 加载器 loader 配置项
module:{
    rules:[
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
        }
    ]
},
```

修改`package.json` 文件，添加如下代码：

```
"browserslist": [
    "defaults",
    "not ie < 11",
    "last 2 versions",
    "> 1%",
    "iOS 7",
    "last 3 iOS versions"
  ]
```

在`package.json` 文件中添加要兼容哪些浏览器版本，我们这里只用 `postcss` 的给代码添加浏览器前缀功能， `autoprefixer` ，测试一下效果如何

在 `src/index.html` 的 `body` 中，添加如下代码：

```
<div id="postcss"></div>
```

在 `src/index.js` 中，添加如下代码：

```
document.getElementById('postcss').innerHTML = "<h1>我自动添加了浏览器前缀</h1>";
```

在 `src/css/reset.css` 中，添加如下代码：

```
#postcss{
    border-radius: 5px;
    box-shadow: 10px 10px 10px rgba(0,0,0,.3);
    width:500px;
    height:600px;
    border:1px solid red;
}
```

然后执行命令 `npm start` 浏览器打开开发者工具，找到我们添加的代码啊，查看 `css` 样式，会发现，已经自动帮我们添加了浏览器前缀~



#### 使用 scss 预处理 css

`scss` 的好用之处，这里不做赘述，先安装插件，这里使用 `node-sass`，安装 `node-sass` 往往是最容易出错的，首先需要电脑安装 `python` 软件，然后必须先全局安装 `node-gyp` 然后才能全局安装 `node-sass`，而安装 `node-sass` 如果不FQ的话，只能用 `cnpm` 进行安装，全局安装完 `node-sass`，再在项目中安装一遍就可以了

```
npm install node-gyp -g
cnpm install node-sass -g
npm install postcss-scss sass-loader -D
cnpm install node-sass -D
```

使用 `vscode` 编辑器，要让其支持 `scss` 语法，需要在 `文件-首选项-设置` 中添加以下代码

```
"files.associations": {
    "*.css": "scss"
},
```

修改 `postcss.config.js`

```
module.exports = {
    parser: 'postcss-scss',
    plugins: [
      require('autoprefixer')
    ]
}
```

然后修改 `webpack.dev.config.js` 文件，添加 `sass-loader`

```
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
```

接下来，先测试效果

在 `src` 文件夹下，新建 `scss/public.scss` 文件 添加如下代码：

```
$primary:               #f5f5f5 !default;//主色

#postcss{
    background: $primary;
    h1{
        width:100%;
        height:36px;
        line-height: 36px;
        color: darken($primary,30%);
    }
}
```

然后在 `src/index.js` 中，引入该样式文件

```
import './scss/public.scss';
```

执行命令 `npm start` 查看效果，一切显示正常，新增的 `scss` 相关样式也都显示正常~


#### 使用 less 预处理 css

安装相关插件

```
npm install less less-loader -D
```

修改 `webpack.dev.config.js` 文件，添加 `less-loader`

```
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
```


在 `src` 文件夹下，新建 `less/index.less` 文件 添加如下代码：

```
@green: #8bab34;

#app{
    margin:20px;
    width:600px;
    height:30px;
    border:1px solid @green;
}
```

然后在 `src/index.js` 中，引入该样式文件

```
import './less/index.less';
```

执行命令 `npm start` 查看效果，一切显示正常，新增的 `less` 相关样式也都显示正常~

`less` 和 `scss`，使用其一即可，这里因为后期会说到 `antd` ，而本人又更倾向于使用 `scss` ，所以两者都加上了，都会用得到

`antd` 是使用 `less` 作为样式预处理的一个 `UI` 库，引用它的 `ui` 组件，需要处理它的 `less` 样式，所以这里也加入了 `less-loader`


## 相关文件配置信息更新情况

#### 以下为本文已涉及到的配置文件的当前详细信息

1. `webpack.dev.config.js` 文件现在的配置信息情况：

```
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const open = require('opn');//打开浏览器
const chalk = require('chalk');// 改变命令行中输出日志颜色插件
const ip = require('ip').address();

module.exports = {
    // 入口文件配置项
    entry: path.resolve(__dirname, 'src/index.js'),
    // 输出文件配置项
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js',
        publicPath: ""
    },
    // webpack4.x 环境配置项
    mode:"development",
    // 加载器 loader 配置项
    module:{
        rules:[
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
        ]
    },
    // 插件配置项
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',//输出文件的名称
            template: path.resolve(__dirname, 'src/index.html'),//模板文件的路径
            title:'webpack-主页',//配置生成页面的标题
        }),
    ],
    // 开发服务配置项
    devServer: {
        port: 8080,
        contentBase: path.resolve(__dirname, 'dist'),
        historyApiFallback: true,
        host: ip,
        overlay:true,
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
    "autoprefixer": "^8.6.4",
    "chalk": "^2.4.0",
    "css-loader": "^0.28.11",
    "html-webpack-plugin": "^3.2.0",
    "ip": "^1.1.5",
    "less": "^3.0.2",
    "less-loader": "^4.1.0",
    "node-sass": "^4.8.3",
    "opn": "^5.3.0",
    "postcss-loader": "^2.1.4",
    "postcss-scss": "^1.0.5",
    "precss": "^3.1.2",
    "sass-loader": "^7.0.1",
    "style-loader": "^0.21.0",
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

3. `postcss.config.js` 文件现在的配置信息情况：

```
module.exports = {
    parser: 'postcss-scss',
    plugins: [
      require('autoprefixer')
    ]
}
```
