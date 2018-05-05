## html-webpack-plugin

上一章我们在 `dist` 目录下创建了一个 `index.html` 文件，并且手动在里面引入了我们生成的 `bundle.js` 文件

这里需要知道，`dist` 整个文件夹和里面的内容，我们之前是没有手动创建的，这个是我们执行命令后，自动创建的，`dist` 目录属于构建目录，是我们源码的输出目录，我们希望里面的一切都是可以自动化的，包括 `index.html` 文件也能自动创建，`js` 文件也能自动引入到页面，所以我们需要用到插件 `html-webpack-plugin` 。

首先安装该插件：

```
npm install html-webpack-plugin -D
```

要用该插件，首先我们得有一个模板文件，好让插件在执行命令时，知道参照谁来生成对应的 `html` 文件，我们在 `src` 目录下，新建一个 `index.html` 文件，作为模板文件，并添加如下代码：

```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title><%= htmlWebpackPlugin.options.title%></title>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

以上代码 `title` 中 `<%= htmlWebpackPlugin.options.title%>` 是插件 `html-webpack-plugin` 的功能，让我们可以配置该页面的标题。

接下来，我们修改 `webpack.dev.config.js` 文件，首先是引入该插件

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
```

既然用到了插件，那就需要 `webpack` 的 `plugins` 配置项了，新增 `plugins` 配置项，并使用 `HtmlWebpackPlugin` 插件：

```
// 插件配置项
plugins: [
    new HtmlWebpackPlugin({
        filename: 'index.html',//输出文件的名称
        template: path.resolve(__dirname, 'src/index.html'),//模板文件的路径
        title:'webpack-主页',//配置生成页面的标题
    }),
]
```

以上配置了 `HtmlWebpackPlugin` 插件必须的两个参数 `filename` 和 `template`，还配置了常用的一个参数 `title`，具体插件还有哪些可配置项，可去 `npm` 官网查看该插件的具体配置项

配置完后，我们先删除整个 `dist` 文件夹，再执行命令 `npm run dev` 会发现 `dist` 目录下已经生成了 `index.html` 文件，`vscode` 打开该文件，会发现 `bundle.js` 已经自动引入，浏览器打开该文件，`Webpack works` 字样照常显示，一切正常~


## 相关文件配置信息更新情况

#### 以下为本文已涉及到的配置文件的当前详细信息

1. `webpack.dev.config.js` 文件现在的配置信息情况：

```
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // 入口文件配置项
    entry:path.resolve(__dirname, 'src/index.js'),
    // 输出文件配置项
    output:{
        path:path.resolve(__dirname,"dist"),
        filename:"js/bundle.js",
        publicPath:""
    },
    // webpack4.x 环境配置项
    mode:"development",
    // 插件配置项
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',//输出文件的名称
            template: path.resolve(__dirname, 'src/index.html'),//模板文件的路径
            title:'webpack-主页',//配置生成页面的标题
        }),
    ]
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
    "html-webpack-plugin": "^3.2.0",
    "webpack": "^4.6.0",
    "webpack-cli": "^2.0.15"
  }
}
```