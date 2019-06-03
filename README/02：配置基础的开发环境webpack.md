
# 项目初始化 package.json 文件

1. 新建一个项目文件夹并用 `vscode` 打开该文件夹，作为项目根目录文件夹

2. 打开 `vscode` 的终端命令行，开始初始化 `package.json` 文件

```
npm init -y
```

* 当然，也可以不加最后的 `-y` ，那样的话，跟着命令行提示一步一步走，按提示可以输入自己的配置

* 加上 `-y` ，省去这些步骤，直接在根目录生成 `package.json` 文件，可打开此文件进行修改，写入自己的配置

# 安装 webpack 插件

## 安装 webpack4.x ,需要先全局安装，再在项目中安装：

```
npm install webpack webpack-cli -g
npm install webpack webpack-cli -D
```

## 配置最基础的 webpack

#### 项目根目录创建 webpack.dev.conf.js 文件，作为开发环境的 webpack 配置文件，先加上如下代码


```
module.exports = {
    // 入口文件配置项
    entry: "",
    // 输出文件配置项
    output: {
        
    },
    // webpack4.x 环境配置项
    mode:""
};
```


以上为最基础的 `webpack4.x` 所需要的配置项

#### entry

入口文件配置项，可配置不同入口

- 单入口字符串类型，如：entry:"a.js" 
- 多入口数组类型，如：entry:["a.js","b.js"]
- 多入口对象类型，如：entry:{a:"a.js",b:"b.js"}

#### output

`output` 为输出文件配置，其可选子项有

- `path`：生成文件的根目录，需要传入一个绝对路径
- `publicpath`：生成资源文件的共用路径，例如生成 css、js、img、字体图标等
- `filename`：定义输出文件名规则
    * `name`：输出文件的 name，如果 entry 的字段值是对象，那么，此 name 对应 entry 字段值的 key
    * `hash`：编译时生成一个 hash 值，可以设置 hash 长度，例如：`[hash:n]`中的 n 就为 hash 的长度值 
    * `chunkhash`：指向当前 chunk 的一个 hash 版本，也就是说，在同一次编译中，每一个 chunk 的 hash 都是不一样的；而在两次编译中，如果某个 chunk 根本没有发生变化，那么该 chunk 的 hash 也就不会发生变化。这在缓存的层面上来说，就是把缓存的粒度精细到具体某个 chunk，只要 chunk 不变，该 chunk 的浏览器缓存就可以继续使用 
- `chunkFilename`：与 filename 类似，都是用来定义生成文件的命名方式的，只不过，chunkFilename 参数指定的是除入口文件外的 chunk（这些 chunk 通常是由于 webpack 对代码的优化所形成的，比如因实际运行的情况来异步加载）的命名

#### mode

`mode` 是 `webpack4.x` 新增的配置，可以在这里写，也可以加在命令中 `--mode development` ，取值有三个：
- `development` 指开发环境
- `production` 指生产环境
- `none` 一般不会用到，因为必须制定一个环境

#### 配置相关参数

知道了 `webpack4.x` 最基本的三要素，那么就开始配置吧，首先入口文件，我们源码一般都在 `src` 文件夹下，根目录新建 `src/index.js`，并添加如下代码：

```
document.getElementById('app').innerHTML = "Webpack works";
```

入口文件有了，开始配置 `webpack.dev.conf.js` 配置如下：

```
const path = require("path");

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
};
```

这里用到了 `path` 是 `node` 的模块， `path.resolve()` 和 `path.join()` 作用没有太大的区别，这里是作合并路径用的

可以在 `webpack.dev.config.js` 文件尾加入如下代码：

```
console.log("--------" + path.resolve(__dirname,"src/index.js"));
```

待一会儿执行命令后，可以看到控制台，输出的路径是什么样的~

## 优化命令

要 `webpack` 按照我们在 `webpack.dev.config.js` 中配置的参数执行命令，需要在 `package.json` 文件中，新增相关 `scripts` 命令

```
"scripts": {
    "dev": "webpack --config webpack.dev.config.js"
}
```


现在通过命令 `npm run dev` 就可执行操作了,运行命令后，看到控制台打印出来的路径了吗？~ 那么不用解释，就该知道 `path.resolve()` 和 `path.join()` 什么作用了吧？~

知道什么作用了，就把打印日志那行代码删了吧~

在项目中还可看到已经生成如下目录：

```
└── dist
   └── js
       └── bundle.js                     
```

说明 `webpack` 配置已经开始工作了

可以测试一下

`dist` 文件夹下，手动创建一个 `index.html` 文件

`dist/index.html` 内加入以下内容：

```
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
    <script type="text/javascript" src="js/bundle.js" charset="utf-8"></script>
</body>
</html>
```

用浏览器打开该页面，可以看到 `Webpack works` 字样~！


## 相关文件配置信息更新情况

#### 以下为本文已涉及到的配置文件的当前详细信息

1. `webpack.dev.conf.js` 文件现在的配置信息情况：

```
const path = require("path");

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
}
```
