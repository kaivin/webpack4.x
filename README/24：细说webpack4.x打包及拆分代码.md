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

再配合`expose-loader`，个人认为，已经算是比较完美的方法了，经非常大程度上对引入及打包拆分做了优化。

当然项目还能继续优化拆分，对本项目来说，我们用到了`superSlide`这个插件，也想让它拆分出来，单独打包，我们需要做的就是：

1. 新增入口配置：

```
entry:{
    app:[path.resolve(__dirname, 'src/index.js')],
    superSlide: [path.resolve(__dirname, 'src/assets/js/jquery.SuperSlide.2.1.1.js')],
    vendor: ["jquery","vue",'vue-router']
},
```

2. 新增缓存组：

```
cacheGroups: {
    a: {
    chunks:'initial',
    test: /[\\/]node_modules[\\/]/,
    name: 'vendor',
    priority: 10,
    enforce: true,
    },
    b: {
    chunks:'initial',
    test: /[\\/]src[\\/]assets[\\/]js[\\/]/,
    name: 'superSlide',
    priority: 10,
    enforce: true,
    },
}
```

需要注意这里`test`需要匹配到该插件的目录所在位置，否则拆分可不会成功~

到此，我们再次执行`yarn test`，然后运行`http://127.0.0.1:9528`，可以看到，`app.js`中已经不存在`superSlide`的依赖了，而是被单独打包成一个独立文件，`app.js`体积再次缩小~

对于`webpack`打包优化的方法，网上有一种使用 `DllPlugin` 和 `DllReferencePlugin` 配合来提取那些我们不需要经常更新，并且每个页面都有引用的第三方库的方法，并且做到不让其他模块的变化污染`dll`库的`hash`缓存，在`webpack4`中我们不需要使用者两个插件，也能实现这种效果，我们只需要配置好`optimization`的配置即可。

首先说一个项目我们往往都会抽离的几个`chunk`包:

1. `common`:将被多个页面同时引用的依赖包打到一个包中，一般都是引入2次以上，即打入该包中。也可以根据自己项目的页面数量来调整
2. `dll`:这个就是网上使用 `DllPlugin` 和 `DllReferencePlugin` 配合打出的包。
3. `manifest`: `webpack`运行时代码，每当依赖包变化，webpack运行时代码也会变化，这个需要单独抽离，以减少`common`包的`hash`值变化的可能性
4. 页面入口文件对应的`app.js`

我们要实现的效果是，项目的每次迭代发布，尽量减少 `chunk hash`值得改变，那么以上这些要求，在`webpack4`我们都可以通过`optimization`的配置项来实现。

**runtimeChunk**

在`webpack4`中，抽离`manifest`，只需要配置`runtimeChunk`即可：

```
optimization: {
    runtimeChunk: {
        name: 'manifest'
    },
},
```

**splitChunks**

这个配置，可以让我们以一定的规则抽离想要的包，其中的`cacheGroups`字段，每增加一个`key`值，就相当于多一个抽包规则。

该配置的`maxInitialRequests`字段，表示在一个入口中，最大初始请求`chunk`数（不包含按需加载的，也就是页面中通过`script`引入的`chunk`）,默认是3个，但是我们抽离的包`common`,`dll`,`manifest`,`app.js`，一个页面最少引入4个`js` 所以这个也需要重新配置，修改我们现有的配置，修改后如下：

```
entry:{
    app:[path.resolve(__dirname, 'src/index.js')],
    superSlide: [path.resolve(__dirname, 'src/assets/js/jquery.SuperSlide.2.1.1.js')],
},

optimization: {
    splitChunks: {
        maxInitialRequests: 6,
        cacheGroups: {
            dll: {
                chunks:'all',
                test: /[\\/]node_modules[\\/](jquery|vue|vue-router)[\\/]/,
                name: 'dll',
                priority: 2,
                enforce: true,
                reuseExistingChunk: true
            },
            superSlide: {
                chunks:'all',
                test: /[\\/]src[\\/]assets[\\/]js[\\/]/,
                name: 'superSlide',
                priority: 1,
                enforce: true,
                reuseExistingChunk: true
            },
            commons: {
                name: 'commons',
                minChunks: 2,//Math.ceil(pages.length / 3), 当你有多个页面时，获取pages.length，至少被1/3页面的引入才打入common包
                chunks:'all',
                reuseExistingChunk: true
            }
        }
    },
    runtimeChunk: {
        name: 'manifest'
    },
},
```

修改过后，执行`yarn test` 再次查看`http://127.0.0.1:9528`,发现`core-js`被多次打包，本项目在引用`superSlide`插件时，因为没有`core-js`而报错，我们下载了该插件，此时它也属于项目依赖包，我们也需要将其打包到`dll`中，修改`dll`缓存组配置：

```
dll: {
    chunks:'all',
    test: /[\\/]node_modules[\\/](jquery|core-js|vue|vue-router)[\\/]/,
    name: 'dll',
    priority: 2,
    enforce: true,
    reuseExistingChunk: true
},
```
再次执行`yarn test`，可以看到，`core-js` 已经被提取到`dll`包中去了，我们看包依赖发现，虽然我们配置了`vue` `vue-router` 但是在打包后，项目中并没有打包这两个库的任何文件，那是因为虽然我们配置了这两个库需要打包到`dll`中，但实际项目中，我们并没有做任何引用~，所以不会打包进项目。

那么到这里拆分打包就算比较完善了，但是实际上，它还会有其他问题。

### module chunk moduleIds namedChunks

前端经常说到模块化，也就是`module`，而`webpack`打包又有`chunk`的概念，`webpack`有`xxxModuleIdsPlugin`以及`xxxChunksPlugin`这些插件，那么在`webpack`中`module`和`chunk`到底是一种什么样的关系呢？

* `chunk`: 是指代码中引用的文件（如：`js`、`css`、图片等）会根据配置合并为一个或多个包，我们称一个包为 `chunk`。
* `module`: 是指将代码按照功能拆分，分解成离散功能块。拆分后的代码块就叫做 `module`。可以简单的理解为一个 `export/import` 就是一个 `module`。

每个`chunk`包可以包含多个`module`，比如我们打包的`dll.xxxxxxxx.js`， `chunk` 的 `id` 为`dll`，包含了`jquery`,`core-js`两个`module`。

一个`module` 还能跨`chunk`引用另一个`module`，也就是跨`js`引用功能块。

**webpack 内部维护了一个自增的 id，每个 module 都有一个 id。所以当增加或者删除 module 的时候，id 就会变化，导致其它文件虽然没有变化，但由于 id 被强占，只能自增或者自减，导致整个 id 的顺序都错乱了。**

我们上面配置`runtimeChunk`时，保证了`hash`的稳定性，但是在`chunk`包内部的`module`的`id`因为`webpack`的这个机制，在我们对包做增删操作时，其实会有所改变，进而可能影响所有 `chunk` 的 `content hash` 值，这就会导致缓存失效，为了解决这个问题，我们不用它的自增`id`就行了，改为使用它的`hash`为`id`，在`webpack4`中，我们只需要这样配置就行:

```
optimization: {
    moduleIds: 'hashed',
}
```

那么除了`moduleId`，每个分离出的`chunk`也有其`chunkId`，同样的，在`webpack4`中，我们只需配置如下参数即可：

```
optimization: {
    namedChunks: true,
}
```

至此，项目的打包拆分就算趋近于完美了~，到这里后的`optimization`配置如下：

```
optimization: {
    namedChunks: true,
    moduleIds: 'hashed',
    splitChunks: {
        maxInitialRequests: 6,
        cacheGroups: {
            dll: {
                chunks:'all',
                test: /[\\/]node_modules[\\/](jquery|core-js|vue|vue-router)[\\/]/,
                name: 'dll',
                priority: 2,
                enforce: true,
                reuseExistingChunk: true
            },
            superSlide: {
                chunks:'all',
                test: /[\\/]src[\\/]assets[\\/]js[\\/]/,
                name: 'superSlide',
                priority: 1,
                enforce: true,
                reuseExistingChunk: true
            },
            commons: {
                name: 'commons',
                minChunks: 2,//Math.ceil(pages.length / 3), 当你有多个页面时，获取pages.length，至少被1/3页面的引入才打入common包
                chunks:'all',
                reuseExistingChunk: true
            }
        }
    },
    runtimeChunk: {
        name: 'manifest'
    },
},
```

此时的`webpack`配置，已经可以说是非常完整了，剩下的除了`eslint`的支持，就是与各框架的搭配配置了~

