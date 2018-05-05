# webpack4.x配置详解

> 这里只会涉及 `webpack4.x` 本身的一些配置，不会涉及 `react` `vue` `koa` 这些和 `webpack` 搭配的配置
> 只是为了能更好的了解 `webpack4.x` 的各项配置，目前已经初步完成了整个配置所有环节
> 可能存在一些使用场景缺失的配置，后续会陆续补全
> 也欢迎给我提出有待改进或缺失的地方~

实现内容

* 本地服务自动打开浏览器
* 开发环境：代码调试、热更新、
* 生产环境：代码压缩、分离 CSS 文件 
* 支持 scss less postcss、babel、CSS3自动添加前缀、base64、字体图标、视频文件、音频文件、代码调试、提取公共代码、路径优化别名配置
* 第三方库与业务代码拆分

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


[1]:https://github.com/kaivin/raw/master/README/01：项目准备工作.md "项目准备工作" 
[2]:https://github.com/kaivin/raw/master/README/02：配置基础的开发环境webpack.md "配置基础的开发环境webpack" 
[3]:https://github.com/kaivin/raw/master/README/03：HtmlWebpackPlugin.md "HtmlWebpackPlugin" 
[4]:https://github.com/kaivin/raw/master/README/04：配置开发服务.md "配置开发服务" 
[5]:https://github.com/kaivin/raw/master/README/05：获取ip并打开浏览器.md "获取ip并打开浏览器" 
[6]:https://github.com/kaivin/raw/master/README/06：配置样式-css、postcss、scss、less.md "配置样式-css、postcss、scss、less" 
[7]:https://github.com/kaivin/raw/master/README/07：配置图片、文件、图标文字.md "配置图片、文件、图标文字" 
[8]:https://github.com/kaivin/raw/master/README/08：初步优化开发环境.md "初步优化开发环境" 
[9]:https://github.com/kaivin/raw/master/README/09：配置babel.md "配置babel" 
[10]:https://github.com/kaivin/raw/master/README/10：配置生产环境webpack.md "配置生产环境webpack" 
[11]:https://github.com/kaivin/raw/master/README/11：分离css.md "分离css" 
[12]:https://github.com/kaivin/raw/master/README/12：CleanWebpackPlugin.md "CleanWebpackPlugin" 
[13]:https://github.com/kaivin/raw/master/README/13：生产环境代码压缩.md "生产环境代码压缩" 
[14]:https://github.com/kaivin/raw/master/README/14：开发、生产环境的拆分代码.md "开发、生产环境的拆分代码" 
[15]:https://github.com/kaivin/raw/master/README/15：模版解析配置项.md "模版解析配置项" 