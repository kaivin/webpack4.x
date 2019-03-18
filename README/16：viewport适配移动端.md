## 移动端适配配置

这里将之前的优化框架相关内容删除了，框架上的东西在看过我这之前的文章后，应该对`webpack` 已经有了了解，那么在这个基础上，去看`vue-cli`或者`create-react-app`，看它们的 `webpack` 配置，起码能知道该如何去修改了，在它们的基础上，去搭配出适合自己项目的脚手架。

本文将主要记录下我在使用 `viewport` 适配移动端时，学习的一些东西~

移动端首先最重要的是一个`meta`：

```
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no" />
```

在所有要做的移动端页面`head` 里，都需要加入该`meta`，然后是需要用到的插件：

```
npm install postcss-aspect-ratio-mini postcss-write-svg postcss-px-to-viewport -D
```

* `postcss-aspect-ratio-mini`：主要用来处理固定宽高比；
* `postcss-write-svg`：主要用来处理1像素边框问题（该方法对圆角处理还未实现）；
* `postcss-px-to-viewport`：将`px`单位自动转换成`viewport`单位；

这是主要会用到的一些插件，当然还有其他的可能用到的，那些可以去看看前端大神**大漠**的文章。

插件下载完成后，修改`postcss.config.js` 文件：

```
module.exports = {
  parser: 'postcss-scss',
  plugins: {
    'autoprefixer':{},
    "postcss-aspect-ratio-mini": {}, // 主要用来处理元素容器宽高比
    "postcss-write-svg": { utf8: false }, // 用来画1像素线
    'postcss-px-to-viewport': {
      viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750 
      viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置 
      unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除） 
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw 
      selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名 
      minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值 
      mediaQuery: false // 允许在媒体查询中转换`px`
    }
  }
}
```

这里做移动端是以`750`效果图来做，在写页面样式时，我们就可以直接写`px`单位去做了，不用去做什么复杂的运算，都交给插件处理了。`750`效果图显示多少像素，我们在写样式时就写多少像素即可。

如果不是用来做移动端页面，把这三个插件的配置注释掉即可。