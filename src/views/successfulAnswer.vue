<template>
  <div>
    <div class="about">
      <img @click="isUser()" src="../../static/img/as_btn_one.png" alt="">
      <a href="https://mobile.sxwinstar.net/wechat/index.php?type=callback&menu=motorVehicle">
        <img @click="not_isUser()" src="../../static/img/as_btn_two.png" alt="">
      </a>
    </div>
    <div v-if="is_show" class="fog">
      <div class="authentication">
        <!--<img class="ccb_bg" src="../../static/img/ccb_one.png" alt="">-->
        <img @click="submit_btn()" class="authentication_btn" src="../../static/img/ccb_two.png" alt="">
        <img @click="close_authentication()" class="close_btn" src="../../static/img/fail_xxx.png" alt="">
        <div class="all_inp_box">
          <div class="inp_box">
            <input v-model="inp_one" placeholder="请输入交通信息安全卡卡号" type="number" oninput="if( this.value.length > 16 )  this.value = this.value.slice(0,16)" maxlength="16" pattern="[0-9]{20}">
          </div>
          <div class="inp_box">
            <input v-model="inp_two" placeholder="请输入认证的手机号后四位" type="number" oninput="if( this.value.length > 4 ) this.value = this.value.slice(0,4)" maxlength="4" pattern="[0-9]{4}" >
          </div>
          <div class="inp_box">
            <input v-model="inp_three" placeholder="请输入验证码" type="number" oninput="if( this.value.length > 6 )  this.value = this.value.slice(0,6)"  maxlength="6"  pattern="[0-9]{6}">
            <p @click="send_status&&send_vrf_code()">{{vrf_code}}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="active_status" class="did_draw">
      <!--重复图-->
      <img v-show="is_repeat" src="../../static/img/repeat.png" alt="">
      <!--结束图-->
      <img v-show="is_end" src="../../static/img/activity_end.png" alt="">
      <!--操作按钮-->
      <img @click="did_draw_fog()" src="../../static/img/fail_ok.png" alt="">
      <img @click="did_draw_fog()" src="../../static/img/fail_xxx.png" alt="">
    </div>
    <div v-if="active_status||is_show" class="safe_fog"></div>
  </div>
</template>
<script>
  import api from"../api/api.js"
  import commons from"../api/common.js"
  import $ from "jquery"
  export default {
      name: "successfulAnswer",
    data(){
        return{
          /*交安卡验证弹窗*/
          is_show:false,
          send_status:true,
          vrf_code:"获取验证码",
          inp_one:"",
          inp_two:"",
          inp_three:"",
          /*重复参与/活动结束活动弹窗*/
          active_status:false,//活动弹窗
          is_repeat:false,//重复参与?
          is_end:false,//活动结束?
          /*用户参加活动状态*/
          user_status:'',
          user_card_number:'',
          user_phone_number:'',
          user_vrf_number:'',
          xh:'',
        }
    },
    mounted(){
        if(!sessionStorage.getItem("anwser_status")){
          this.$router.push("/")
        }

      api.do_post("/ccb-api/api/v1/cbc/drawActivity/judge").then(res=>{
        if(!res){
          return
        }
        sessionStorage.setItem("authenticationStatus",true);
        this.user_status = res.code;
        //success已验证未抽奖
        if(res.code === "success"){
          //已认证未抽奖跳转抽奖
          localStorage.setItem("user_info",res.data.authInfoCard);
          this.$router.push("/luck_draw");
        }else{
            //活动结束
          if(res.errorCode === "activity_end"){
            this.is_end = true;
            this.active_status = true;
            sessionStorage.setItem("isEnd",true)

            //重复参与
          }else if(res.errorCode === "activity_partake"){
            this.is_repeat = true;
            this.active_status = true;

            // 已中奖未购买
          }else if(res.errorCode === "activity_has_prize_99"||res.errorCode === "activity_has_prize_999"){
            localStorage.setItem("how_much",res.errorCode);
            this.$router.push("/winning_the_prize");

            //正常验证弹框出现
          } else if(res.errorCode === "activity_user_did_not_bind"){
          }
          this.user_status = res.errorCode;
        }
      }).catch(err=>{
        console.log(err)
      })

    },
    methods:{
      /*关闭重复参与弹窗*/
      did_draw_fog(){
        this.active_status = false;
        window.close();
      },
      /*提交验证数据*/
      submit_btn(){
        if(this.inp_one.length === 16){

          if (this.inp_two.length === 4){
            if(this.inp_three.length === 6) {
              api.do_post("/ccb-api/api/v1/cbc/auth/authMsg", {
                "kh": this.inp_one,
                "xh": this.xh,
                "sjh": this.inp_two,
                "yzm": this.inp_three,
              }).then(res => {
                console.log(res)
                if(res.authInfoCard){
                  localStorage.setItem("user_info",res.authInfoCard);
                  this.$router.push("/luck_draw")
                }else if(res.code === "infoCardIsBind.NotRule"){
                  alert("您的交安卡已认证过，请勿重复认证")
                }else{
                  alert("认证信息有误，无法领取福利哦")
                }
              }).catch(err => {
                console.log(err)
              })
            }else if(this.inp_three.length === 0){
              alert("请输入验证码")
            }else{
              alert("验证码输入不正确，请重新填写")
            }
          }else if(this.inp_two.length === 0){
            alert("请输入手机尾号")
          }else{
            alert("手机尾号输入不正确，请重新填写")
          }
        }else if(this.inp_one.length === 0){
          alert("请输入交安卡号")
        }else{
          alert("交安卡号输入不正确，请重新填写")
        }
      },

      /*关闭用户验证弹窗*/
      close_authentication(){
        this.is_show = false
      },
      /*短信验证发送*/
      send_vrf_code(){
        if(this.inp_one.length === 16 ){
          if( this.inp_two.length === 4) {
            api.do_post(`/ccb-api/api/v1/cbc/auth/sendAuthMsg?infoCard=${this.inp_one}&phone=${this.inp_two}`,{}).then(res => {
              if (res) {
                this.xh = res.xh;
              }
            }).catch(err => {
              console.log(err);
            });
            this.send_status = false;
            let second = 60;
            this.vrf_code = second + "S再次获取";
            let timer = setInterval(() => {
              second--;
              if (second < 0) {
                clearInterval(timer);
                this.send_status = true;
                this.vrf_code = "再次获取"
              } else {
                this.vrf_code = second + "S再次获取";
              }
            }, 1000);
          }else if(this.inp_two.length === 0){
            alert("请输入手机尾号")
          }else{
            alert("手机尾号输入不正确，请重新填写")
          }
        }else if(this.inp_one.length === 0){
          alert("请输入交安卡号")
        }else{
          alert("交安卡号输入不正确，请重新填写")
        }
      },

      /*是为交安卡用户的btn点击*/
      isUser(){
        //认证弹窗
        if(this.user_status === "activity_user_did_not_bind"){
          this.is_show = true
          //活动结束弹窗
        }else if(this.user_status === "activity_end"){
          this.is_end = true;
          this.active_status = true;
          //重复参与弹窗
        }else if(this.user_status === "activity_partake"){
          this.is_repeat = true;
          this.active_status = true;
          //this.user_status未赋值，接口数据未到；
        }else{
         alert("当前访问人数过多，请稍后再试")
        }
      },
      /*不是为交安卡用户的btn点击*/
      not_isUser(){
        location.href="https://mobile.sxwinstar.net/wechat/index.php?type=callback&menu=motorVehicle";
      },
    }
  }
</script>
<style scoped lang="scss">
  .safe_fog{
    width:100%;
    height:100vh;
    position: fixed;
    left:0;
    top:0;
    background: rgba(0,0,0,.4);
  }
  .did_draw{
    width:100%;
    height:100vh;
    position: fixed;
    left:0;
    top:0;
    background: rgba(0,0,0,0);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9;
    img:nth-child(1){
      width:350px;
    }
    img:nth-child(2){
      width:350px;
    }
    img:nth-child(3){
      width:80px;
      margin-top:-105px;
    }
    img:nth-child(4){
      width:35px;
      margin-top:80px;
    }
  }


  input::-webkit-input-placeholder{
    font-size: 13px;
    color:#ccc;
  }
  .authentication{
    width:350px;
    height:420px;
    position: relative;
    left:50%;
    top:50%;
    background: url("../../static/img/ccb_one.png") top center no-repeat;
    background-size: 100% auto;
    transform: translate(-50%,-50%);
    .all_inp_box{
      padding-top:142px;
      .inp_box:first-child{
        margin:0 auto;
      }
      .inp_box:last-child{
        position: relative;
        p{
          background: #bfbfbf;
          position: absolute;
          right:0;
          top:0;
          line-height: 28px;
          font-size: 12px;
          color:#555;
          padding:0 5px;
        }
      }
    }
    .inp_box{
      width:200px;
      height:26px;
      background: #fff;
      margin:12px auto 0;
      overflow: hidden;
      border-radius: 5px;
      input{
        border:none;
        padding:3px 8px;
        font-size: 13px;
        width:100%;
        line-height: 20px;
      }
    }
    .authentication_btn{
      position: absolute;
      left:50%;
      transform: translateX(-50%);
      bottom:88px;
      width:75px;
    }
    .close_btn{
      position: absolute;
      bottom:-40px;
      left:50%;
      transform: translateX(-50%);
      width:36px;
    }
  }
  .ccb_bg{
    width:264px;
  }
  .fog{
    width:100%;
    height:100vh;
    position: absolute;
    left:0;
    top:0;
    background: rgba(0,0,0,0);
    z-index: 9;
  }
  .about{
    width:100%;
    height:100vh;
    min-height:650px;
    background: url("../../static/img/as_bg.png") top center no-repeat;
    background-size:100% 675px;
    position: relative;
    img{
      position: absolute;
      left:50%;
      transform: translateX(-50%);
    }
    img:first-child{
      width:170px;
      top:370px;
    }
    img:last-child{
      width:130px;
      top:470px;
    }
  }
  /*@media screen and(min-height: 300px){*/
    /*.about img:first-child{*/
      /*top:260px;*/
    /*}*/
    /*.about img:last-child{*/
      /*top:330px;*/
    /*}*/
  /*}*/
  /*@media screen and(min-height: 480px){*/
    /*.about img:first-child{*/
      /*top:310px;*/
    /*}*/
    /*.about img:last-child{*/
      /*top:390px;*/
    /*}*/
  /*}*/
  /*@media screen and(min-height: 580px){*/
    /*.about img:first-child{*/
      /*top:370px;*/
    /*}*/
    /*.about img:last-child{*/
      /*top:470px;*/
    /*}*/
  /*}*/
  /*@media screen and(min-height: 680px){*/
    /*.about img:first-child{*/
      /*top:400px;*/
    /*}*/
    /*.about img:last-child{*/
      /*top:510px;*/
    /*}*/
  /*}*/
  /*@media screen and(min-height: 780px){*/
    /*.about img:first-child{*/
      /*top:450px;*/
    /*}*/
    /*.about img:last-child{*/
      /*top:560px;*/
    /*}*/
  /*}*/
</style>
