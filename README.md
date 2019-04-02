# webpack4.x配置详解

> 这里只会涉及 `webpack4.x` 本身的一些配置，不会涉及 `react` `vue` `koa` 这些和 `webpack` 搭配的配置 
> 只是为了能更好的了解 `webpack4.x` 的各项配置，目前已经初步完成了整个配置所有环节 
> 可能存在一些使用场景缺失的配置，后续会陆续补全 
> 也欢迎给我提出有待改进或缺失的地方~

**这里只是单独的 webpack 配置，后续会出配合 `koa` `react` `vue` 的配置**

## 更新
#### 2019.04.02
* 修正部分表述错误的地方
* 新增引入第三方插件的几种方法对比及具体配置
* 新增测试、生产环境对代码打包及拆分`optimization`配置的使用技巧
* 对配置文件进行了微调
#### 2019.03.27
* 新增生产环境打包静态资源
* 新增辅助插件：`cross-env`,`friendly-errors-webpack-plugin`,`node-notifier`,`webpack-bundle-analyzer` 的配置
#### 2019.03.20
* 新增测试环境配置文件及命令
* 新增发布、预览测试及生产环境
#### 2019.03.18
* 删除框架结构整合相关内容，该内容不再进行框架结构整合
* 新增`viewport`适配移动端配置
* 新增`yarn`下载插件方案
* 文档内容进行微调，文件名进行微调
* 修正`html-loader`与`HtmlWebpackPlugin`的冲突问题
* 新增引入第三方库（`jquery`,`SuperSlide`等）的便捷方法
#### 2019.03.12
* 配置 `scss` 的笔记有所修改，将避免一些无法预知的错误
* 配置 `babel` 的笔记有所修改，`babel`版本升级到7以上，避免版本不一致报错

> 由于修改的两篇笔记涉及到部分配置文件的修改，未修改的笔记部分的配置文件依然是老内容，具体更新相关配置修改内容,以更新后的笔记页面内容为准

## 实现内容

* 本地服务自动打开浏览器
* 开发环境：代码调试、热更新、
* 生产环境：代码压缩、分离 CSS 文件 
* 支持 scss less postcss、babel、CSS3自动添加前缀、base64、字体图标、视频文件、音频文件、代码调试、提取公共代码、路径优化别名配置
* 第三方库与业务代码拆分
* 支持 viewport 适配移动端

## 配置步骤

1. [项目准备工作][1] 
2. [配置基础的开发环境webpack][2] 
3. [HtmlWebpackPlugin][3] 
4. [配置开发服务][4] 
5. [获取ip并打开浏览器][5] 
6. [配置样式-css、postcss、scss、less][6] 
7. [配置图片、文件、图标文字][7] 
8. [初步优化开发环境][8] 
9. [配置babel][9]  
10. [配置生产环境webpack][10] 
11. [分离css][11] 
12. [CleanWebpackPlugin][12] 
13. [生产环境代码压缩][13] 
14. [开发、生产环境的拆分代码][14] 
15. [模版解析配置项][15] 
16. [viewport适配移动端][16] 
17. [yarn替代npm方案][17] 
18. [html-loader与HtmlWebpackPlugin的冲突][18] 
19. [引入第三方插件库][19] 
20. [发布并预览测试及生产环境][20] 
21. [生产环境打包静态资源][21] 
22. [借助辅助插件让开发更优雅][22] 
23. [细说webpack4引入第三方库][23] 
24. [细说webpack4打包及拆分代码][24] 

## 命令

1. 安装

```
yarn / yarn install
```

2. 运行开发环境

```
yarn start
```

3. 输出测试环境

```
yarn test
```

4. 输出生产环境

```
yarn build
```


[1]:https://github.com/kaivin/webpack4.x/blob/master/README/01：项目准备工作.md "项目准备工作" 
[2]:https://github.com/kaivin/webpack4.x/blob/master/README/02：配置基础的开发环境webpack.md "配置基础的开发环境webpack" 
[3]:https://github.com/kaivin/webpack4.x/blob/master/README/03：HtmlWebpackPlugin.md "HtmlWebpackPlugin" 
[4]:https://github.com/kaivin/raw/master/README/04：配置开发服务.md "配置开发服务" 
[5]:https://github.com/kaivin/webpack4.x/blob/master/README/05：获取ip并打开浏览器.md "获取ip并打开浏览器" 
[6]:https://github.com/kaivin/webpack4.x/blob/master/README/06：配置样式-css、postcss、scss、less.md "配置样式-css、postcss、scss、less" 
[7]:https://github.com/kaivin/webpack4.x/blob/master/README/07：配置图片、文件、图标文字.md "配置图片、文件、图标文字" 
[8]:https://github.com/kaivin/webpack4.x/blob/master/README/08：初步优化开发环境.md "初步优化开发环境" 
[9]:https://github.com/kaivin/webpack4.x/blob/master/README/09：配置babel.md "配置babel" 
[10]:https://github.com/kaivin/webpack4.x/blob/master/README/10：配置生产环境webpack.md "配置生产环境webpack" 
[11]:https://github.com/kaivin/webpack4.x/blob/master/README/11：分离css.md "分离css" 
[12]:https://github.com/kaivin/webpack4.x/blob/master/README/12：CleanWebpackPlugin.md "CleanWebpackPlugin" 
[13]:https://github.com/kaivin/webpack4.x/blob/master/README/13：生产环境代码压缩.md "生产环境代码压缩" 
[14]:https://github.com/kaivin/webpack4.x/blob/master/README/14：开发、生产环境的拆分代码.md "开发、生产环境的拆分代码" 
[15]:https://github.com/kaivin/webpack4.x/blob/master/README/15：模版解析配置项.md "模版解析配置项" 
[16]:https://github.com/kaivin/webpack4.x/blob/master/README/16：viewport适配移动端.md "viewport适配移动端" 
[17]:https://github.com/kaivin/webpack4.x/blob/master/README/17：yarn替代npm方案.md "yarn替代npm方案" 
[18]:https://github.com/kaivin/webpack4.x/blob/master/README/18：html-loader与HtmlWebpackPlugin的冲突.md "html-loader与HtmlWebpackPlugin的冲突" 
[19]:https://github.com/kaivin/webpack4.x/blob/master/README/19：引入第三方插件库.md "引入第三方插件库" 
[20]:https://github.com/kaivin/webpack4.x/blob/master/README/20：发布并预览测试及生产环境.md "发布并预览测试及生产环境" 
[21]:https://github.com/kaivin/webpack4.x/blob/master/README/21：生产环境打包静态资源.md "生产环境打包静态资源" 
[22]:https://github.com/kaivin/webpack4.x/blob/master/README/22：借助辅助插件让开发更优雅.md "借助辅助插件让开发更优雅" 
[23]:https://github.com/kaivin/webpack4.x/blob/master/README/23：细说webpack4引入第三方库.md "细说webpack4引入第三方库" 
[24]:https://github.com/kaivin/webpack4.x/blob/master/README/24：细说webpack4打包及拆分代码.md "细说webpack4打包及拆分代码" 