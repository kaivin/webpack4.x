## webpack 引入 eslint

首先安装`webpack`支持`eslint`三件套:

```
yarn add eslint eslint-loader eslint-friendly-formatter -D
```

然后修改`webpack.dev.conf.js`文件，添加如下`rule`：

```
{
    test: /\.js$/,
    use:[
        {loader:'eslint-loader'}
    ],
    enforce: "pre", // 编译前检查
    exclude: /node_modules/, // 不检测的文件
    include: [path.resolve(__dirname, 'src')], // 指定检查的目录
    options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
        formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
    }
},
```

然后新建`.eslintrc.js`文件，先添加如下代码：

```
module.exports = {
    root: true, // 作用的目录是根目录
    parserOptions: {
      sourceType: 'module' // 按照模块的方式解析
    },
    env: {
      browser: true, // 开发环境配置表示可以使用浏览器的方法
      node: true //
    },
    rules: {
      // 自定义的规则
      "linebreak-style": [0 ,"error", "windows"],
      "indent": ['error', 4]
    }
}
```

#### eslint 配置项

* `root` 限定配置文件的使用范围
* `parser` 指定`eslint`的解析器
* `parserOptions` 设置解析器选项
* `extends` 指定`eslint`规范
* `plugins` 引用第三方的插件
* `env`   指定代码运行的宿主环境
* `rules` 启用额外的规则或覆盖默认的规则
* `globals` 声明在代码中的自定义全局变量

`rule` 中规则的开启关闭：

1. “off” 或 0 - 关闭规则
2. “warn” 或 1 - 开启规则
3. “error” 或 2 - 开启规则

配置我们自己的`eslint` 规则，我们还需要以下这些插件：

```
yarn add babel-eslint eslint-plugin-html eslint-plugin-import eslint-plugin-promise eslint-plugin-node eslint-config-standard eslint-plugin-standard -D
```

插件下载完成后，修改`.eslinrc.js`文件：

```
module.exports = {
    root: true, // 作用的目录是根目录
    extends: 'standard', // 继承标准规则
    plugins: [
        'html' // 使用eslint-plugin-html
    ],
    parser: "babel-eslint",
    parserOptions: {
        sourceType: 'module' // 按照模块的方式解析
    },
    env: {
      browser: true, // 开发环境配置表示可以使用浏览器的方法
      node: true, //
      es6: true
    },
    rules: { // 重新覆盖 extends: 'standard'的规则
      // 自定义的规则
      "linebreak-style": [0 ,"error", "windows"],
      "indent": ['error', 4], // error类型，缩进4个空格
      'space-before-function-paren': 0, // 在函数左括号的前面是否有空格
      'eol-last': 0, // 不检测新文件末尾是否有空行
      'semi': ['error', 'always'], // 必须在语句后面加分号
      "quotes": ["error", "double"],// 字符串没有使用单引号
      "no-console": ["error",{allow:["log","warn"]}],// 允许使用console.log()
      "arrow-parens": 0,
      "no-new":0//允许使用 new 关键字
    },
    // global:{// 允许全局变量,将$设置为true，表示允许使用全局变量$
    //     $:false,
    // }
}
```
修改完后，我们要确保`webpack.dev.conf.js`文件的本地服务的配置项`overly`为`true`，当我们运行`yarn start` 时，终端就会显示所有语法错误了。

这里我暂时没有配置`global`，因为我配置`$`后，报的错并未找到具体解决办法，注释掉后，错误不存在了，然后我们再次运行`yarn start`，这是报了这样一个错误：

```
Error:options/query cannot be used with loaders
```
检查我们的`webpack.dev.conf.js` 文件，发现我们配置`eslint-loader`的`options`和其他`loader`不一样~，其他`loader`的`options`都是和`loader`同级，而这个却和它的父级是同级，显然是不对的，我们修改配置项，顺带也把`babel-loader`的配置项修改一下，具体代码如下：

```
{
    test: /\.js$/,
    use:[{loader:'eslint-loader',
        options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
            formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
        }
    }],
    enforce: "pre", // 编译前检查
    exclude: /node_modules/, // 不检测的文件
    include: [path.resolve(__dirname, 'src')], // 指定检查的目录
},
{
    test: /\.(js|jsx)$/,
    use: [{
        loader:'babel-loader',
        options:{//options、query不能和loader数组一起使用
            cacheDirectory:true//利用缓存，提高性能，babel is slow
        },
    }],
    include: path.resolve(__dirname, 'src'),
    
},
```
此时，我们再次运行`yarn start`你会发现终端报了数都数不完的语法检测错误~，这说明了一点，我们的`eslint`配置已经成功了~

接下来就是看这些错误都是出在哪里，哪些是可以通过`eslin-loader`的`exclude`和`.eslinrc.js`的`rule`排除掉不去修改的，剩下的就是我们慢慢去一个一个修改了~

比如本项目的报错中，可以发现很多的报错来自`src/assets/js/jquery.SuperSlide.2.1.1.js`文件，我们不需要`eslint`去检测该文件，那么我们需要在`eslint-loader`的配置中排除该文件：
```
{
    test: /\.js$/,
    use:[{loader:'eslint-loader',
        options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
            formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
        }
    }],
    enforce: "pre", // 编译前检查
    exclude: [/node_modules/,path.resolve(__dirname, 'src/assets/js/jquery.SuperSlide.2.1.1.js')], // 不检测的文件
    include: [path.resolve(__dirname, 'src')], // 指定检查的目录
},
```

然后再次运行`yarn start`，可以看到终端中，已经不再有该`js`文件引起的语法报错了~，剩下的那些就看通过修正，或者忽略的方式全部排查掉吧~

当然，这里的`eslint`配置并不全面，比如支持`vue`，支持`react`等等，具体项目，再具体配置相关插件即可~

那么到此，整个单独`webpack4`的配置就全部结束了，接下来就可以去搭配项目做基于项目框架的各种搭配配置了！