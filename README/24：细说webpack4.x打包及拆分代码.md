## webpack4.x打包拆分

在第14章[开发、生产环境的拆分代码](https://github.com/kaivin/webpack4.x/blob/master/README/14：开发、生产环境的拆分代码.md)中，其实已经对`webpack4.x`的打包拆分，做过简单的介绍，但是在当时我对这一块其实也是一脸懵逼状态~，只知道是这样配置的，但是具体该如何操作也是不清楚的，这里会略微细说一下，当然也只是个人了解到的了~

在上一章中，说到过对第三方插件库的打包问题，说到了打包速度和打包后包文件体积的问题，打包的文件体积不宜过大，现在`webpack`打包时包文件体积大于200kb(好像是~忘记了)会有提示警告，要让我们拆分，通常来说我们项目依赖的第三方插件库，我们是不会去修改它们的源码的，这些文件是不会有改动的，我们不用打包它们，或者说，不用每次都打包它们，

### 单独打包

在第14章[开发、生产环境的拆分代码](https://github.com/kaivin/webpack4.x/blob/master/README/14：开发、生产环境的拆分代码.md)中，介绍过将这些第三方插件包单独打包到一个文件中，这里我们先拿测试环境打包做实验，测试环境的配置是未做压缩的打包配置。

首先修改`webpack.test.conf.js`的`entry`如下：
```
entry:{
    app:[path.resolve(__dirname, 'src/index.js')],
    vendor: ["jquery","vue",'vue-router']
},
```

先将`jquery,vue,vue-router`这三个项目依赖打包到一个文件中去，先注释掉`optimization`配置中的`runtimeChunk`配置项。

执行`yarn test`，这里我配置了`BundleAnalyzerPlugin`，终端中会输出这样一句话`Webpack Bundle Analyzer is started at http://127.0.0.1:9528` 在浏览器中打开这个链接地址，就可以看到，打包的项目各`js`文件中的依赖关系，可以看到在`vendor.js`和`app.js`中都打包了`jquery`，这说明我们的打包是正确的，`app.js`中没有`vue` 是因为在页面中并没有引入`vue`，实际项目是肯定会引入的。

我们需要实现的是，`vendor.js`中存放所有我们引入的第三方库，而其他页面中的`js`文件不再再次打包这些文件，这样才是正确的打包

其实也简单，我们需要修改`optimization`的配置：

```
optimization: {
    splitChunks: {
        cacheGroups: {
            a: {
                chunks:'initial',
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
},
```

这里我们只是为`cacheGroups.vendor`新增了配置`chunks:'initial'`,这里是只针对初始化模块，默认是`all`，具体配置项，可看第14章。

改完之后，再次运行`yarn test` 控制台可以看到前后两次打包的`app.js`和`vendor.js`的体积大小，打开`http://127.0.0.1:9528`看文件依赖关系，一目了然，`app.js`已经没有了`jquery`。

但是这依然有一个问题，从控制台看两次打包文件后缀的`hash`值可以发现，两次打包的`hash`值都发生了变化，但是其实并没有修改任何`js`文件,`hash`值的变化，说明`webpack`每次都重新打包了这些`js`文件，但是我们没有做修改的文件，再次打包，那就是在浪费时间，项目大的话，打包速度可能会非常非常慢，这里我们要实现每次只打包有修改的文件，未做修改的文件，依然沿用上次打包的文件。

这个也非常简单，我们取消对`optimization.runtimeChunk`的注释，先运行一遍`yarn test`，可以看到，这时是多了一个叫`manifest.js`的文件，然后我们修改`src/index.js`文件，随便添加点什么东西~有修改就行，然后再次执行`yarn test`

比较这两次打包的文件`hash`值变化，会发现，`vendor.js`的`hash`值并未发生变化，这说明我们的目的达到了。

那么到此我们就初步优化了打包速度，以及打包后文件体积大小的问题了

再配合`expose-loader`，个人认为，已经算是比较完美的方法了，经非常大程度上对引入及打包拆分做了优化，当然还能继续优化，

### 使用 DLL & DllReference