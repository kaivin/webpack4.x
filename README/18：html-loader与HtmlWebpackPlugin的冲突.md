## html-loader与HtmlWebpackPlugin的冲突

在配置图片那篇文章中，用到了`html-loader`，当时只看到了`html`文件中引用的图片被加载出来了，但是却没发现`HtmlWebpackPlugin`插件在解析`html` 文件时，`ejs`语法却未正常解析出来，这里我设置了标题是通过`ejs`语法获取的`HtmlWebpackPlugin`设置的标题，在使用了`html-loader` 后，这里就已经无法正常显示了。

原因是因为`HtmlWebpackPlugin`支持`html`以及`ejs`模板语法，当在`webpack`中配置了`html-loader`后，就相当于全局设置以`html`模板语法进行解析，`HtmlWebpackPlugin`解析 `html` 模板是以`string`类型进行解析，而解析`ejs`模板是以函数类型进行解析，在全局设置了`html-loader`后，`HtmlWebpackPlugin`就不会认识`ejs`语法了，只会将它当成`string` 直接输出。

解决方案一：

注释掉前面添加的 `html-loader` 在`html`文件中图片资源的`src`地址通过`ejs`语法获取：

```
<img src="<%= require( '../images/test.jpg') %>" />
```

对图片资源引入进行测试：

修改`src/index.html` 文件：

```
<img src="<%= require('./assets/images/favicon.png')%>" />
```

保存后执行`yarn start` 可以看到图片能被正常解析出来，而且页面标题也能正常显示了

如果是`html`文件中引入的其他`html`文件，通过`ejs`语法引入因为是解析为`ejs`代码，所以还需要`html-loader`来解析成`html`代码，写法如下：

```
<%= require('html-loader!../components/header.html') %>
```

（`html-loader!`）表示引用`html-loader`这个加载器来解析。

对引入`html`文件进行测试：

新建`src/components/header.html` 文件，随便写点什么~

然后修改`src/index.html`文件，在该页面内引入`header.html`文件：

```
<%= require('html-loader!./components/header.html') %>
```

保存后执行`npm start` 可以看到引入的`header.html` 文件内容，可以正常显示。

解决方案二：

将模板文件全部替换成`ejs`文件，因为即使设置了全局`html-loader`，它只针对`html`文件，识别不了`ejs`文件。

这种情况下图片资源与方案一是一样的语法：

```
<img src="<%= require('../images/test.jpg')%>" />
```

对该方法的图片资源引入进行测试：

1. 取消对`html-loader`的注释

2. 创建`src/pages/ejsDemo/index.ejs` 文件，并将`src/index.html` 文件的内容复制进来，先删除引入`html`文件部分的代码：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><%= htmlWebpackPlugin.options.title%></title>
</head>
<body>
    <div id="app"></div>
    <div id="postcss"></div>
    <img src="<%= require('../../assets/images/favicon.png')%>" />
</body>
</html>
```

3. 修改`webpack.dev.conf.js`文件中`plugins`中`HtmlWebpackPlugin`的`template`的文件路径：

```
new HtmlWebpackPlugin({
    filename: 'index.html',//输出文件的名称
    template: path.resolve(__dirname, 'src/pages/ejsDemo/index.ejs'),//模板文件的路径
    title:'webpack4.x',//配置生成页面的标题
    minify:{
        removeRedundantAttributes:true, // 删除多余的属性
        collapseWhitespace:true, // 折叠空白区域
        removeAttributeQuotes: true, // 移除属性的引号
        removeComments: true, // 移除注释
        collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
    },
}),
```

然后执行`yarn start` 可以看到，页面可以正常输出并显示出页面内引用的图片资源

对于嵌入的文件，分两种情况：
1.嵌入的文件是`html` 文件：因为全局设置了`html-loader` 可以直接用`ejs`语法引用:

```
<%= require('../components/header.html') %> 
```

2.嵌入的文件是`ejs`文件：因为是`ejs`文件，所以不会被全局`html-loader`加载，需要告诉它用`html-loader`加载：
```
<%= require('html-loader!../components/footer.ejs') %>
```

接下来对方法二的文件嵌入进行测试：

首先新建`src/components/footer.ejs` 文件，依然随便写点什么~

然后修改`src/pages/ejsDemo/index.ejs` 文件，分别通过上面两种方法，引入`html`文件的头以及`ejs`文件的尾

```
<%= require('../../components/header.html') %>
<%= require('html-loader!../../components/footer.ejs') %>
```

执行`yarn start` 页面正常显示~

到此就彻底解决了在页面内引入资源的问题了，而这两种方法到底选择哪一种，就看个人习惯了~，我这里只是为了做测试，两种方法都有体现，通常更习惯于`html`格式，所以，这里我会再把测试方案二时对`webpack.dev.conf.js`文件的修改，再修正回来：

1. 注释掉全局`html-loader`的`rule`
2. 修改`webpack.dev.conf.js`文件中`plugins`中`HtmlWebpackPlugin`的`template`的文件路径：

```
new HtmlWebpackPlugin({
    filename: 'index.html',//输出文件的名称
    template: path.resolve(__dirname, 'src/index.html'),//模板文件的路径
    title:'webpack4.x',//配置生成页面的标题
    minify:{
        removeRedundantAttributes:true, // 删除多余的属性
        collapseWhitespace:true, // 折叠空白区域
        removeAttributeQuotes: true, // 移除属性的引号
        removeComments: true, // 移除注释
        collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
    },
}),
```