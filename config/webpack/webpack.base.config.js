/**
 * webpack基础配置
 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const appConfig = require('./../../app.config');


// 加载应用工程的webpack配置,例如entry等
const webpackAppConfig = appConfig.webpack

// 版本号
const appVersion = new Date().getTime()

// 获取当前目录的绝对路经 process.cwd() node.js的方法，相当于__dirname
function resolve(dir) {
  return path.resolve(process.cwd(), dir)
}

// 网站图标
const favicon = path.resolve(process.cwd(), 'favicon.ico')

module.exports = function (env) {
  const config = {
    // 入口模块配置
    entry: appConfig.webpack.entry,
    // 输出模块配置
    output: {
      // 输出到这个目录下
      path: env === "prod" ? path.resolve(__dirname,"../../bin") : path.resolve(__dirname,"../../dist"),
      // 生成的文件名, [name] 即为entry配置中的key
      filename: env === "prod" ? 'js/[name].[chunkhash].js' : 'js/[name].[hash].js',
      // 异步模块文件名
      chunkFilename: 'js/[name].[chunkhash].js',
      // 全局公共路径
      publicPath: '/'
    },
    // 开发工具
    devtool: env === "prod" ? false : 'cheap-module-source-map',
    // webpack4.x 环境配置项
    mode: env === "prod" ? "production" : "development",
    // 加载器 loader 配置项
    module:{
        rules:[
            {// babel配置
                test: /\.(js|jsx)$/,
                use: ['babel-loader?cacheDirectory=true'],
                include: path.resolve(__dirname, '../../src')
            },
            {// 图片依赖配置
              test: /\.(png|jp?g|gif|svg)$/,
              use: [
                  {
                      loader: 'url-loader',
                      options: {
                          limit: 8192,        // 小于8192字节的图片打包成base 64图片
                          name:'assets/images/[name].[hash:8].[ext]',
                          publicPath:''
                      }
                  }
              ]
            },{// 文件依赖配置项——字体图标
                test: /\.(woff|woff2|svg|eot|ttf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192, 
                        name: 'assets/fonts/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, {// 文件依赖配置项——音频
                test: /\.(wav|mp3|ogg)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192, 
                        name: 'assets/audios/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, {// 文件依赖配置项——视频
                test: /\.(ogg|mpeg4|webm)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8192, 
                        name: 'assets/videos/[name].[ext]?[hash:8]',
                        publicPath:''
                    },
                }],
            }, 
        ].concat(webpackAppConfig.rules || []),
    },
    // 插件配置项
    plugins: [
      new CleanWebpackPlugin(
        env === "prod" ? ['bin'] : ['dist'],
        {
            root: path.resolve(__dirname, '../../'),  // 根目录
            verbose: true,        　　　　　　　　　　 // 开启在控制台输出信息
            dry: false        　　　　　　　　　　     // 启用删除文件
        }
      ),// 删除 dist/bin 文件夹
      new HtmlWebpackPlugin({
          filename: 'index.html',// 输出文件的名称
          template: appConfig.htmlTemplate,// 模板文件的路径
          title: appConfig.htmlTitle,// 配置生成页面的标题
          minify:{
              removeRedundantAttributes:true, // 删除多余的属性
              collapseWhitespace:true, // 折叠空白区域
              removeAttributeQuotes: true, // 移除属性的引号
              removeComments: true, // 移除注释
              collapseBooleanAttributes: true // 省略只有 boolean 值的属性值 例如：readonly checked
          },
          favicon,
          appVersion
      }),
    ],
    // 寻找模块时的一些缺省设置
    resolve: {
        // 设置可省略文件后缀名
        extensions: [' ','.js','.json','.jsx'],
        // 查找 module 的话从这里开始查找;
        modules: [path.resolve(__dirname, "../../src"), path.resolve(__dirname, "../../node_modules")], // 绝对路径;
        // 别名，可以直接使用别名来代表设定的路径以及其他
        alias: {
            'react': 'react/umd/react.production.min.js',
            'react-dom': 'react-dom/umd/react-dom.production.min.js',
            '@config': resolve('../config'),
            'views': path.resolve(__dirname, '../../src/views'),
            'components': path.resolve(__dirname, '../../src/components')
        }
    },
  }
  return config
}