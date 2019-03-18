## html-loader与HtmlWebpackPlugin的冲突

在配置图片那篇文章中，用到了`html-loader`，当时只看到了`html`文件中引用的图片被加载出来了，但是却没发现`HtmlWebpackPlugin`插件在解析`html` 文件时，`ejs`语法却未正常解析出来，这里我设置了标题是通过`ejs`语法获取的`HtmlWebpackPlugin`设置的标题，在使用了`html-loader` 后，这里就已经无法正常显示了。

原因是因为`HtmlWebpackPlugin`支持`html`以及`ejs`模板语法，当在`webpack`中配置了`html-loader`后，就相当于全局设置以`html`模板语法进行解析，`HtmlWebpackPlugin`解析 `html` 模板是以`string`类型进行解析，而解析`ejs`模板是以函数类型进行解析，在全局设置了`html-loader`后，`HtmlWebpackPlugin`就不会认识`ejs`语法了，只会将它当成`string` 直接输出。

解决方案一：

删除前面添加的 `html-loader` 在`html`文件中图片资源的`src`地址通过`ejs`语法获取：

```
<img src=<%= require( '../images/test.jpg') %> />
```

如果是`html`文件中引入的其他`html`文件，通过`ejs`语法引入因为是解析为`ejs`代码，所以还需要`html-loader`来解析成`html`代码，写法如下：

```
<%= require('html-loader!../components/header.html') %>
```

（`html-loader!`）表示引用`html-loader`这个加载器来解析

解决方案二：

将模板文件全部替换成`ejs`文件，因为即使设置了全局`html-loader`，它只针对`html`文件，识别不了`ejs`文件。

这种情况下图片资源与方案一是一样的语法：

```
<img src=<%= require( '../images/test.jpg') %> />
```
对于嵌入的文件，分两种情况：
1.嵌入文件是`html` 文件：因为全局设置了`html-loader` 可以直接用`ejs`语法引用:

```
<%= require('../components/header.html') %> 
```

2.嵌入文件是`ejs`文件：因为是`ejs`文件，所以不会被全局`html-loader`加载，需要告诉它用`html-loader`加载：
```
<%= require('html-loader!../components/header.ejs') %>
```