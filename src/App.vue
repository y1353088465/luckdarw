<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import api from "./api/api.js"
  import wx from "weixin-js-sdk"
  import $ from "jquery"
  export default {
  name: 'App',
  mounted(){
    if(!localStorage.getItem("tokenId")){
      this.$router.push("/");
    }

    let url = location.href.split('#')[0];
    $.ajax({
      type: "GET",
      url: "/wechat_access/api/v1/wechatCommon/noauth/getWechatShareData?url="+url,
      dataType: "json",
      success: function(data){
        console.log(data)
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.wxData.appid, // 必填，公众号的唯一标识
          timestamp: data.wxData.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.wxData.nonceStr, // 必填，生成签名的随机串
          signature: data.wxData.signature,// 必填，签名
          jsApiList: ['checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'onMenuShareWeibo',
            'hideMenuItems',
            'showMenuItems',
            'hideAllNonBaseMenuItem',
            'showAllNonBaseMenuItem',
            'translateVoice',
            'startRecord',
            'stopRecord',
            'onRecordEnd',
            'playVoice',
            'pauseVoice',
            'stopVoice',
            'uploadVoice',
            'downloadVoice',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage',
            'getNetworkType',
            'openLocation',
            'getLocation',
            'hideOptionMenu',
            'showOptionMenu',
            'closeWindow',
            'scanQRCode',
            'chooseWXPay',
            'openProductSpecificView',
            'addCard',
            'chooseCard',
            'openCard']  // 必填，需要使用的JS接口列表
        });
        wx.ready(function () {   //需在用户可能点击分享按钮前就先调用

          let fxTitle = '争当交安卡锦鲤，10万大奖送给你';
          let fxDesc = '交通安全信息卡555位锦鲤，快来看你是其中一位吗？一元购百元或千元油券福利送送送';
          let link = 'https://mobile.sxwinstar.net/ccb/ccb-php/index.php?type=callback&menu=luckDraw';
          let fxImgUrl = 'http://wechat.sxeccellentdriving.com/thursday/assets/images/shareIco.png';

          wx.updateAppMessageShareData({
            title:fxTitle, // 分享标题
            desc:fxDesc, // 分享描述
            link:link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl:fxImgUrl, // 分享图标
            success: function () {
              // 设置成功
            }
          })
          // 2. 分享接口
          // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口

          wx.onMenuShareAppMessage({
            title: fxTitle,
            desc: fxDesc,
            link: link,
            imgUrl: fxImgUrl,
            trigger: function (res) {
            },
            success: function (res) {
            },
            cancel: function (res) {
            },
            fail: function (res) {
            }
          });
          // alert('已注册获取“发送给朋友”状态事件');

          // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口

          wx.onMenuShareTimeline({
            title: fxTitle,
            link: link,
            imgUrl: fxImgUrl,
            trigger: function (res) {
            },
            success: function (res) {
            },
            cancel: function (res) {
            },
            fail: function (res) {
            }
          });


          // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口

          wx.onMenuShareQQ({
            title: fxTitle,
            desc: fxDesc,
            link: link,
            imgUrl: fxImgUrl,
            trigger: function (res) {
            },
            complete: function (res) {
            },
            success: function (res) {
            },
            cancel: function (res) {

            },
            fail: function (res) {

            }
          });


          // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口
          wx.onMenuShareWeibo({
            title: fxTitle,
            desc: fxDesc,
            link: link,
            imgUrl: fxImgUrl,
            trigger: function (res) {
              alert('用户点击分享到微博');
            },
            complete: function (res) {
              alert(JSON.stringify(res));
            },
            success: function (res) {
              alert('已分享');

            },
            cancel: function (res) {
              alert('已取消');
            },
            fail: function (res) {
              alert(JSON.stringify(res));
            }
          });
        });
      }
    });

  }
}
</script>

<style>
  html,body{
    font-size: 16px;
  }
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  background: url("../static/img/fill_bg_img.png") repeat-y;
  background-size: 100% 1px;
}
html,body,div,form,p,ul,li,h1,h2,h3,h4,h5,h6,img, input, textarea, table, tr, td, ol ,dl ,dd ,dt{
  margin:0;
  padding:0;
}
ul,ol,dl{
  list-style: none;
}
a{
  text-decoration: none;
  border:none;
}
input,textarea,button{
  outline: none;
}
</style>
