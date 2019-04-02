import './assets/styles/reset.css';
import './assets/styles/public.scss';
import './assets/styles/index.less';
//import $ from 'jquery';
require('jquery');
require('./assets/js/jquery.SuperSlide.2.1.1.js');
import image from './assets/images/favicon.png';
if (module.hot) {
    module.hot.accept();
}

var func = str => {
    document.getElementById('app').innerHTML = str;
};
func('我现在在使用 es6 新语法-箭头函数!');

var strHtml = "<h1>我自动添加了浏览器前缀更新代码</h1><img src='"+ image +"'/><span class='icon iconfont icon-toPay'></span>";
$(function(){
    $("#postcss").html(strHtml);
    //$(".slideTxtBox").slide();
});
jQuery(".slideTxtBox").slide();
//document.getElementById('postcss').innerHTML = "<h1>我自动添加了浏览器前缀</h1><img src='"+ image +"'/><span class='icon iconfont icon-toPay'></span>";
