import './assets/styles/reset.css';
import './assets/styles/public.scss';
import './assets/styles/index.less';
import image from './assets/images/favicon.png';
// import $ from 'jquery';
require('jquery');
require('./assets/js/jquery.SuperSlide.2.1.1.js');
if (module.hot) {
    module.hot.accept();
}

var func = str => {
    document.getElementById('app').innerHTML = str;
};
func('我现在在使用 es6 新语法-箭头函数!');

var strHtml = "<h1>我自动添加了浏览器前缀更新代码</h1><img src='" + image + "'/><span class='icon iconfont icon-toPay'></span>";
$(function () {
    $("#postcss").html(strHtml);
    if ($(window).scrollTop() == 0) {
        $("#back-to-top").hide();
    }
    // $(".slideTxtBox").slide();
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0) {
            $("#back-to-top").fadeIn(1000);
        }
        else {
            $("#back-to-top").fadeOut(1000);
        }
    });
    //当点击跳转链接后，回到页面顶部位置
    $("#back-to-top").click(function () {
        $('body,html').animate({scrollTop: 0}, 1000);
        return false;
    });
});
jQuery(".slideTxtBox").slide();
// document.getElementById('postcss').innerHTML = "<h1>我自动添加了浏览器前缀</h1><img src='"+ image +"'/><span class='icon iconfont icon-toPay'></span>";
