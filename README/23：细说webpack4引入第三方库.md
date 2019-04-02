## webpack4 对 JS 文件的引入

在本项目的第19章[引入第三方插件库](https://github.com/kaivin/webpack4.x/blob/master/README/19：引入第三方插件库.md)中，已经说过一种对 JS 的引入方法，就是使用 `expose-loader`，而对非`npm` 包的引入也在那一章做过介绍，那么引入第三方插件并不是只有那一种办法，这里主要介绍一下其他的引入方法。

其实不用`expose-loader`也能引入，也能用，只是不够完美，这里说一说具体的引用方法：

### 方法一：直接引入

直接引入相当简单，直接下载插件，然后在要用的页面的`js`文件中 `import` 就行了，其他任何配置都不需要，`JQ`的全局变量有多个的，通常我们通过`import`方式是这样的：

```
import $ form 'jquery';
```
修改我们的配置：
1. 先注释掉`webpack.dev.conf.js`文件中关于`expose-loader`的配置；
2. 修改`src/index.js`文件中`jquery`的引入方法，先注释掉`require('jquery');` 添加`import $ from 'jquery';`;
3. 先注释掉`src/index.js`文件中引入的`require('./assets/js/jquery.SuperSlide.2.1.1.js');`以及使用的方法`jQuery(".slideTxtBox").slide();`;

运行`yarn start` 页面能正常打开，而且`jquery`的代码也能正常执行，说明没有问题;

那么现在我们放开上面第三条注释，再次运行`yarn start`;

坏了，`jquery`的代码也不能正常执行了，打开控制台可以看到`jQuery is not defind`，emmm，有人会说把`jQuery`改成`$`，放在`jquery`代码中就行了啊，可以试一试，我们修改`src/index.js`文件中`jquery`相关代码如下：
```
$(function(){
    $("#postcss").html(strHtml);
    $(".slideTxtBox").slide();
});
//jQuery(".slideTxtBox").slide();
```
再次执行`yarn start` 会发现依然提示`jQuery is not defind`，这是`SuperSlide`这个插件的代码内是有使用`jQuery`这个全局变量，修改我们自己用到的并没有什么卵用~

到了这里，这第一种方法就已经是行不通的了，项目中是不能这么用的，那么就有了下面这种方法：


####  方法二：ProvidePlugin

`webpack` 官方的说法是自动加载模块，而不用到处`import`或者`require`。

而且在官方文档下面说到使用`Angular`和`jquery`时，有写这么一句话：**`Angular` 会寻找 `window.jQuery` 来决定 `jQuery` 是否存在**，这也印证了第一种方法的不可取之处~，现在我们跟随官方文档的步伐来配置我们的`jquery`, [官方教程](https://www.webpackjs.com/plugins/provide-plugin/)

1. 首先就是不用到处`import`或者`require`，先注释掉`import $ from 'jquery';`;
2. 再注释掉`SuperSlide`的引用和使用，先确保`jquery`的配置正确及正常使用;
3. 修改`webpack.dev.conf.js`文件，在`plugin`中添加如下代码：
```
new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    'window.$': 'jquery',
})
```
执行`yarn start` 页面一切显示正常，都很好，然后我们放开引用`SuperSlide`的注释，注意修改回使用`jQuery`
```
$(function(){
    $("#postcss").html(strHtml);
});
jQuery(".slideTxtBox").slide();
```
再次运行`yarn start` 一切正常，官方的方法还是有可取之处的~

但是这个也不是完美的方法，本人未做过亲测，但是在网上确实看到一些文章说到，该方法对一些第三方库的插件的支持度不高，容易报错，比如`jquery-ui`，而且如果配置了`eslint`，这种没有显性声明全局变量的方法，在`eslint`规则中是不严谨的，难以通过`eslint` 的语法校验。


#### 方法三：externals

上面说到的两种方法，包括前文说到的`expose-loader`方法，都有一个问题，那就是在项目完成后打包生产环境时，这些项目依赖的包，都会被打包，当我们的项目很大，依赖了很多第三方库是，就会出现打包文件过大的问题

`webpack`官方提供了`externals`方法，来让一些我们不想被打包的文件过滤出来，并通过`CDN`的方式，直接在`html`文件中引用这些文件。

[官方教程](https://webpack.docschina.org/configuration/externals/)

在本项目中，需要做以下修改：

1. 注释掉方法二的插件配置，并在`plugin`同层级下添加如下代码：

```
plugins: [
    ...
    // new webpack.ProvidePlugin({
    //     $: 'jquery',
    //     jQuery: 'jquery',
    //     'window.jQuery': 'jquery',
    //     'window.$': 'jquery',
    // })
],
externals: {
    jquery: 'jQuery'
},
```
2. 修改 `src/index.js`文件，取消`import $ form 'jquery'`的注释；
3. 修改 `src/index.html` 文件，在`body`底部添加如下代码：

```
<script type="text/javascript" src="https://code.jquery.com/jquery-2.2.4.js"></script>
```
执行`yarn start` 其实可以发现这和方法一是没有太大区别的，只是在`src/index.html`文件中多了一个引用。那么区别就在于，在打包生产环境时，该方法打包时不会打包`externals`中配置的插件，这无疑加快了打包速度，也减少了打包后的文件体积。

这个可以修改`webpack.prod.conf.js`文件做测试，这里不再做介绍。

虽然它有这样的优点，但是它和方法一有同样的问题存在，所以不推荐使用这种方法，，提升打包速度和减少打包文件体积，我们可以通过其他方法来实现。

到这里就可以总结一下`webpack`对引入第三方库文件的方法了：

1. 直接引入——有缺点（不推荐）
2. ProvidePlugin引入——有缺点（不推荐）
3. externals——有缺点（不推荐）
4. expose-loader——暂时未发现问题（推荐使用）

