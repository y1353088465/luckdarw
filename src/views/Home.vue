<template>
  <div class="home">
      <div class="section">

        <img class="banner_img" src="../../static/img/index_banner.png" alt="">
        <h3 class="question_title">{{question.title}}</h3>
        <ul>
          <li @click="checked_ele(j)" v-for="(i,j) in question.answer">
            <img class="solid_circular" v-if="i.check_status === true" src="../../static/img/ckecked.png" alt="">
            <img class="hollow_circular" src="../../static/img/check.png"  v-else alt="">
            <span>{{i.choose_text}}</span>
          </li>
        </ul>
        <img  @click="sub_answer()" class="submit_answer" src="../../static/img/submit_answer.png" alt="">
      </div>
      <div v-if="fail_status" class="fog">
        <div class="fog_img_box">
          <img class="show_text_img" src="../../static/img/fail_answer.png" alt="">
          <img @click="fail_model_hide()" class="btn_click_img" src="../../static/img/fail_ok.png" alt="">
          <img @click="fail_model_hide()" class="cancel_btn_xxx" src="../../static/img/fail_xxx.png" alt="">
        </div>
      </div>
  </div>
</template>

<script>
  import api from "../api/api.js"
  import commons from "../api/common.js"
  import $ from "jquery"
export default {
  name: 'home',
    data(){
      return{
        fail_status:false,
        question:{
              title:"由陕西省公安厅交警总队、陕西省交通运输厅、建行陕西省分行共同研发的交通安全信息卡满5周岁啦，请问交安卡的作用和权益有哪些？（多选）：",
              answer:[
                  {
                      check_status:false,
                      choose_text:'A：机动车交通违法记录在线处理，包含裁决与缴纳罚款；',
                  },
                  {
                      check_status:false,
                      choose_text:'B：全国高速ETC通行省内95折优惠；',
                  },
                  {
                      check_status:false,
                      choose_text:'C：具有信用卡的刷卡消费功能，终身免收年费；',
                  },
                  {
                      check_status:false,
                      choose_text:'D：在优驾行【车主权益】-【交安卡专享】享受车主福利；',
                  },
                  {
                      check_status:false,
                      choose_text:'E：可作为绑定微信和支付宝的首选卡。',
                  },
              ],
              finally_answer:''
          }
      }
    },
    created(){
    //判断是否有oppenId，
      if(localStorage.getItem("openid")){
        // oppenId有则获取设置为空的空值
        if (!localStorage.getItem('headimgurl')) {
          localStorage.setItem('headimgurl', '用户无头像');
        }
        if (!localStorage.getItem('nickname')) {
          localStorage.setItem('nickname', '用户无名氏');
        }

          //tokenId获取
          api.do_post("/ccb-api/api/v1/cbc/account/getToken",{
            'headImgUrl': localStorage.getItem("headimgurl"),
            'nickName': localStorage.getItem("nickname"),
            'openid': localStorage.getItem("openid"),
          }).then(res=>{
              localStorage.setItem("tokenId",res.tokenId)
          })

      }else{
        // oppenId无则获取
        location.href = "https://mobile.sxwinstar.net/ccb/ccb-php/index.php?type=callback&menu=luckDraw";
      }
    },
    mounted(){
      // localStorage.setItem("tokenId","f981e5761bb947a19e701588733bf4ed")

      //监听返回键点击关闭页面
      let that = this;
      if (window.history && window.history.pushState){
          window.addEventListener("popstate", function(e) {
            WeixinJSBridge.call('closeWindow');
          }, false);
      }
    },
  destroyed(){
    // localStorage.removeItem("openid")
  },
    methods:{
    // 失败弹窗隐藏
      fail_model_hide(){
        this.fail_status = false
      },
      // 选答案
        checked_ele(j){
            this.question.answer[j].check_status = !this.question.answer[j].check_status
        },
      //提交
        sub_answer(){
        sessionStorage.setItem("anwser_status",true);
            //提交时循环判断答案
            let record_status;
            let str = '';
            this.question.answer.forEach((v,k)=>{
                if(v.check_status === false){
                    record_status = false;
                }else{
                  str+= v.choose_text.slice(0,1);
                }
            });

          this.finally_answer = str;

          if(record_status === false){
            this.fail_status = true;
          }else{
            this.$router.push("/successfulAnswer")
          }
          //提交后端做统计 并获取acct...id
          api.do_post(`/ccb-api/api/v1/cbc/answerRecord/submitAnswer?answer=${this.finally_answer}`).then(res=>{
              this.finally_answer = '';
          })
        }
    }
}
</script>
<style lang="scss">
  .home{
    width:100%;
    height:100vh;
    overflow-x: hidden;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    .section{
      flex: 1;
      background: #ffdfb6;
      .sec_title{
        line-height: 100px;
        text-align: center;
        font-size: 15px;
        font-weight: 600;
        color:#777;
      }
      .banner_img{
        width:100%;
      }
      .question_title{
        margin:0 25px;
        font-size: 14px;
        font-weight: 400;
        color:#492900;
      }
      ul{
        padding:0 50px;
        li{
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 50px;
          margin-top:10px;
          span{
            margin-left:5px;
            font-size: 13px;
            color:#5d4205;
          }
          .solid_circular{
            width:15px;
            height:15px;
            flex-shrink: 0;
          }
          .hollow_circular{
            width:15px;
            height:15px;
            flex-shrink: 0;
          }
        }
      }
      .submit_answer{
        width:90px;
        display: block;
        margin:50px auto 20px;
        border-radius:10px;
      }
    }

    .fog{
      width:100%;
      height:100vh;
      background:rgba(0,0,0,.6);
      position: fixed;
      left:0;
      top:0;
      .fog_img_box{
        position: relative;
        left:50%;
        top:50%;
        transform: translate(-50%,-50%);
        .show_text_img{
          width:80%;
          position: fixed;
          left:50%;
          top:50%;
          transform: translate(-50%,-50%);
        }
      }
      }
  }
@media screen and (min-height:300px ){
  .btn_click_img{
    position: absolute;
    z-index: 1;
    left:50%;
    transform: translateX(-50%);
    top:55px;
    width:75px;
  }
  .cancel_btn_xxx{
    position: absolute;
    z-index: 1;
    left:50%;
    transform: translateX(-50%);
    top:160px;
    width:37px;
  }
}
  @media screen and (min-height:600px ){
    .btn_click_img{
      position: absolute;
      z-index: 1;
      left:50%;
      transform: translateX(-50%);
      top:65px;
      width:75px;
    }
    .cancel_btn_xxx{
      position: absolute;
      z-index: 1;
      left:50%;
      transform: translateX(-50%);
      top:190px;
      width:37px;
    }
  }
</style>
