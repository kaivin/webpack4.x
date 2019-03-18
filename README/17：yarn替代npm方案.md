## yarn 比 npm 更优秀

过去的很长一段时间内，一直都在使用npm 安装各种插件包，但是，出错率实在是太大了~ 各种意想不到的问题层出不穷，只一个`node-sass` 就够让人受的了~ 更别说，用npm 安装插件包，还总是会出现漏装依赖插件的情况，在使用过`yarn`后就再也不想用`npm`了~

```
npm install yarn -g
```

首先当然是安装这个插件~ 然后依然和 `npm` 一样换源

```
yarn config set registry https://registry.npm.taobao.org --global
yarn config set disturl https://npm.taobao.org/dist --global
```

好了，之后`npm` 可以静静的躺着了~！当然还有我们的`node-sass`的镜像源

```
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
```

OK！~ 至此之后，一路畅通无阻的想下载什么就下载什么吧！至于具体的命令~ 那个就看官网吧~ 