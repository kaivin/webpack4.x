## postcss.config.js 文件的数据格式问题

在我配置`vue`项目时，需要用`vue-loader`配合`postcss-loader`做配置时，发现了本项目存在的一个问题：

我在`postcss.config.js`中配置了`parser:'postcss-scss'`，这里在未配置`vue-loader`之前，只有`css`,`scss`,`less`的`rule`有引用该配置，而且是通过`options.config.path`的方式，找到该文件进行引用，在当时来说，样式能正常加载，页面能正常访问，一切都是正常的，哪怕后来的`viewport`适配也能正常编译及显示。但是它本质上还是有错误的

## 问题
1. `postcss.config.js`是公用的配置，`postcss-loader`官网示例，只要你配置了`postcss-loader`，它就会默认加载项目根目录下的`postcss.config.js`文件，所以如果`postcss.config.js`名字不变，路径位置不变，是可以不必再在配置中写入它的路径参数的，本项目目前为止，即使删除样式的`rule`中配置的`postcss-loader`的`options.config.path`，所有样式也依然可以正常被编译。
2. 在不删除配置的`options.config.path`的情况下，因为在`postcss.config.js`中配置了`parser:'postcss-scss'`但实际上，该配置在项目中并不是只有`scss`的`rule`有引用，`css`和`less`的`rule`也都有引用，这本身也是个错误的配置。
3. 在配置`vue-loader`时，它对`postcss-loader`的解析器`parser`的配置参数位置和`rule`的样式对`postcss-loader`的解析器`parser`的配置参数位置也有不同之处，如果将`parser`写在`postcss.config.js`文件中，这里就会有冲突。
4. `postcss.config.js`文件中`plugins`的数据书写格式问题，这个问题困扰我很久... 因为我曾修改过该文件，通过`require`的方式引入该文件，却因书写的数据格式错误而无法让插件起作用，一直未找到原因，在仔细阅读官网参数配置规则时，才恍然大悟~

## 答疑

1. 第一个问题，如果想简单点，那就按照官网的来，固定的名字，固定的位置即可，`vue-loader`配置`postcss-loader`同样能默认加载名为`postcss.config.js`的文件配置，而且还支持：`.postcssrc.js`这个名字，同时还支持在`package.json`中配置的`postcss`,当然样式配置的`postcss-loader`也支持这两种方式。如果想要改变位置，或者想更加方便控制自己的项目，还是更推荐引入的方式。

2. `postcss`对不同的预处理器有不同的解析器插件,`scss`的解析器插件是`postcss-scss`,`less`的解析器插件是`postcss-less`,`css`不需要解析器插件。这就存在着解析器的差异化，最好将该配置从`postcss.config.js`文件中删除，这里不仅是三种样式的解析器参数值的差异化，还包括后期添加`vue-loader`配置`postcss-loader`时`parser`的配置位置的差异化，所以`postcss.config.js`文件，最好只存在公用的插件配置。

3. 添加`vue-loader`配置`postcss-loader`时`parser`的配置位置与三种样式的`postcss-loader`配置`parser`位置也是存在差异化的

4. 在本项目中，我是以对象的数据格式写的`postcss.config.js`文件的配置，在我声明一个变量接收这些配置将其暴露出来，并在`webpack`配置文件中`require`引入，在`postcss-loader`的`options`中调用时，这些插件却都不再起作用，起初完全不知道哪里出了问题，在仔细阅读官方参数配置规则后，发现，在`postcss-loader`的`options`中配置`plugins`，只接收`array`以及`function`格式的数据，它并不能接收`object`格式的数据。


说了这么多长篇大论，下面是代码部分：

本项目目前的`postcss.config.js`文件配置：

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

样式的配置：

```
{
    test: /\.css$/,
    use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'postcss-loader',
            options: {
            sourceMap: true,
            config: {
                path: 'postcss.config.js'
            }
            }
        }
    ]
},
{
    test: /\.scss$/,
    use: [
        {
            loader: 'style-loader', 
        },
        {
            loader: 'css-loader', 
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
                config: {
                    path: 'postcss.config.js'
                }
            }
        },
        {
            loader: 'sass-loader', 
            options: { sourceMap: true }
        }
    ],
    exclude: /node_modules/
},{// 编译less
    test: /\.less$/,
    use: [
        {
            loader: 'style-loader', 
        },
        {
            loader: 'css-loader', 
            options: {
                importLoaders: 1,
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
                config: {
                    path: 'postcss.config.js'
                }
            }
        },
        {
            loader: 'less-loader', 
            options: { 
                sourceMap: true,
            }
        }
    ]
},
```
以及后期会加入的`vue-loader`的配置：

```
{
    test: /\.vue$/,
    use:[
        {
            loader: 'vue-loader',
            options:{
                // 去除模板中的空格
                preserveWhitespace: false,
                // postcss配置,把vue文件中的样式部分,做后续处理
                postcss:{
                    // plugins: [...], // 插件列表
                    options:{parser: 'postcss-scss'}
                },
                loaders:{
                    css: ['vue-style-loader', 'css-loader'],
                    scss: ['vue-style-loader', 'css-loader', 'scss-loader'],
                }
            }
        }
    ],
},
```

在列一下官方`postcss-loader`的配置格式：

```
{
  test: /\.style.js$/,
  use: [
    'style-loader',
    { loader: 'css-loader', options: { importLoaders: 1 } },
    { loader: 'postcss-loader', 
        options: { 
            parser: 'sugarss', 
            config:{
                path:''
            },
            plugins:[],// 类型只能为array或者function 默认是array
            sourceMap:true
        } 
    }
  ]
}
```
从官方配置看，本项目用的是`options.config.path`，但是因为解析器的差异化原因，这里用这个方式就不太合适了，而且结合后期要添加的`vue-loader`的配置来说，最合适的配置方式如下：

```
{
  test: /\.style.js$/,
  use: [
    'style-loader',
    { loader: 'css-loader', options: { importLoaders: 1 } },
    { loader: 'postcss-loader', 
        options: { 
            parser: 'sugarss', 
            plugins:[],// 类型只能为array或者function 默认是array
            sourceMap:true
        } 
    }
  ]
}
```
使用`options.parser`以及`options.plugins`的结合，能实现配置差异化的`parser`也能实现调用公共的`plugins`，而且也实现了后期`vue-loader`的配置需求。

那么接下来就是要修改`postcss.config.js`文件了，我出错的修改方式如下：

```
const postcssPlugins = {
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
module.exports = postcssPlugins;
```
在`webpack.dev.conf.js`文件中是这样配置的：
```
// 头部引用
const postcss = require('./postcss.config');

// rules中调用
{
    test: /\.css$/,
    use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'postcss-loader',
            options: {
            postcss,
            sourceMap: true,
            }
        }
    ]
},
{
    test: /\.scss$/,
    use: [
        {
            loader: 'style-loader', 
        },
        {
            loader: 'css-loader', 
        },
        {
            loader: 'postcss-loader',
            options: {
                postcss,
                parser: 'postcss-scss',
                sourceMap: true,
            }
        },
        {
            loader: 'sass-loader', 
            options: { sourceMap: true }
        }
    ],
    exclude: /node_modules/
},{// 编译less
    test: /\.less$/,
    use: [
        {
            loader: 'style-loader', 
        },
        {
            loader: 'css-loader', 
            options: {
                importLoaders: 1,
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                postcss,
                parser: 'postcss-less',
                sourceMap: true,
            }
        },
        {
            loader: 'less-loader', 
            options: { 
                sourceMap: true,
            }
        }
    ]
},
```

这样的配置在运行后，终端提示未设置任何`parser,plugins, or stringifier. Right now, PostCSS does nothing`，`postcss`未做任何事情~，这里`postcss.config.js`以及`webpack.dev.conf.js`都配置错误了。首先`options.plugins`接收的数据类型我配置错误，其次也不能直接就把`postcss`这个变量就扔在那就行了~

正确配置如下：

```
// postcss.config.js
const postcssPlugins = {
    plugins: [
        require('autoprefixer')(),
        require('postcss-aspect-ratio-mini')(),
        require('postcss-write-svg')({ utf8: false }),
        require('postcss-px-to-viewport')({
            viewportWidth: 750, // 视窗的宽度，对应的是我们设计稿的宽度，一般是750 
            viewportHeight: 1334, // 视窗的高度，根据750设备的宽度来指定，一般指定1334，也可以不配置 
            unitPrecision: 3, // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除） 
            viewportUnit: 'vw', // 指定需要转换成的视窗单位，建议使用vw 
            selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名 
            minPixelValue: 1, // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值 
            mediaQuery: false // 允许在媒体查询中转换`px`
        }),
    ]
}
module.exports = postcssPlugins;

// webpack.dev.conf.js
// 头部引用
const postcss = require('./postcss.config');

// rules中调用
{
    test: /\.css$/,
    use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
        { loader: 'postcss-loader',
            options: {
            plugins:postcss.plugins,
            sourceMap: true,
            }
        }
    ]
},
{
    test: /\.scss$/,
    use: [
        {
            loader: 'style-loader', 
        },
        {
            loader: 'css-loader', 
        },
        {
            loader: 'postcss-loader',
            options: {
                plugins:postcss.plugins,
                parser: 'postcss-scss',
                sourceMap: true,
            }
        },
        {
            loader: 'sass-loader', 
            options: { sourceMap: true }
        }
    ],
    exclude: /node_modules/
},{// 编译less
    test: /\.less$/,
    use: [
        {
            loader: 'style-loader', 
        },
        {
            loader: 'css-loader', 
            options: {
                importLoaders: 1,
            }
        },
        {
            loader: 'postcss-loader',
            options: {
                plugins:postcss.plugins,
                parser: 'postcss-less',
                sourceMap: true,
            }
        },
        {
            loader: 'less-loader', 
            options: { 
                sourceMap: true,
            }
        }
    ]
},
```

这里又加入了一个插件`postcss-less`，所以先下载该插件：
```
yarn add postcss-less -D
```
然后执行`yarn start` 页面能正常显示，而且`postcss`插件也都起作用了。

最后同步修改`webpack.test.conf.js`以及`webpack.prod.conf.js`文件。