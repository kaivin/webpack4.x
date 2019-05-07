
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

这里需要说明的是：
1. 项目用到了`@babel/runtime-corejs2`该插件，那么就必须下载`core-js`插件，而且是项目依赖，这两个插件在终端下载完后，如果直接运行`yarn start`，那么会出现如下警告：

```
WARNING: We noticed you're using the `useBuiltIns` option without declaring a core-js version. Currently, we assume version 2.x when no version is passed. Since this default version will likely change in future versions of Babel, we recommend explicitly setting the core-js version you are using via the `corejs` option.

You should also be sure that the version you pass to the `corejs` option matches the version specified in your `package.json`'s `dependencies` section. If it
doesn't, you need to run one of the following commands:

  npm install --save core-js@2    npm install --save core-js@3
  yarn add core-js@2              yarn add core-js@3
```
~~此时重启终端命令行，再次运行`yarn start` 就不会出现这个警告了~~
出现上述警告是因为`.babelrc`中缺少配置，这里不仅需要在`@babel/plugin-transform-runtime`中声明`core-js`的版本，也需要在`@babel/preset-env`声明使用`core-js`:

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
        "useBuiltIns": "usage",
        "corejs": 2
      }]
    ],
    "plugins": [
      ["@babel/plugin-transform-runtime",{
        "corejs": 2
      }]
    ]
}
```
此时再次运行`yarn start`会发现终端就不会再出现上面那种警告了

2. 如果在运行开发环境过程中出现如下错误：

```
Can't resolve 'core-js/library/fn/object/assign
```
只要是这种找不到`core-js/library`，都说明你下载的是`3.x`版本的`core-js`，在`3.x`版本，已经没有`library`文件，原来的`library`文件夹下的文件，可以在`core-js@3`版本的`es`文件夹下找到，这里报错的原因是`babel`的插件和`core-js`的版本对应没有及时更新，所以，我们只能暂时做降级处理，删除`3.x`版本的`core-js`，并重新下载`core-js@2.6.5`版本，再次运行`yarn start` 就不会再出现这种问题了

当我们在`.babelrc`文件中做了`corejs`相关配置后，我们上面所下载的那些`babel`相关插件中就会有关于`core-js`的代码会起作用了，目前这些插件的版本中所使用过的`corejs`版本还都是`2.x`版本，所以配置`corejs`时，下载插件如下：
```
yarn add core-js@2.6.5
yarn add @babel/runtime-corejs2 -D
```


如果后期这些`babel`插件对依赖的`core-js`版本升级到`3.x`，那么上面两个插件就可以更新了：
```
yarn add core-js
yarn add @babel/runtime-corejs3 -D
```
`@babel/runtime-corejs2` 和 `@babel/runtime-corejs3` 是两个插件，不难看出，一个是`corejs`的`2.x`版本，一个是`3.x`版本，升级到`3.x`版本，就需要把`.babelrc`文件中对`corejs`配置的`2`改为`3`，这样`corejs`这一块的配置就不会再出问题了~


**项目中已经安装的`babel`相关的插件也都需要升级到`7.4.4`版本，否则也还是会报错**

