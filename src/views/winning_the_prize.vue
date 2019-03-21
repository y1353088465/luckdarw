<template>
  <div class="winning_the_prize">
    <img class="pic" v-if="!is_yiqin" src="../../static/img/is_100.png" alt="">
    <img class="pic" v-if="is_yiqin" src="../../static/img/is_1000.png" alt="">
    <img class="pic go_buy" @click="go_buy()" src="../../static/img/buy_now.png" alt="">

    <div v-if="active_status" class="did_draw">
      <!--结束图-->
      <img src="../../static/img/activity_end.png" alt="">
      <!--操作按钮-->
      <img @click="did_draw_fog()" src="../../static/img/fail_ok.png" alt="">
      <img @click="did_draw_fog()" src="../../static/img/fail_xxx.png" alt="">
    </div>
  </div>
</template>

<script>
  import $ from "jquery"
  import api from "../api/api.js"
    export default {
        name: "winning_the_prize",
      data(){
          return{
            is_yiqin:true,
            money_code:"",
            isEnd:false,
            active_status:false,
            jquery_status:false,
          }
      },
      mounted(){
        // 判断sessionstorage是否有验证状态，没有就跳转离开
        if(sessionStorage.getItem("authenticationStatus")){
          this.card_code = localStorage.getItem("user_info");
        }else{
          this.$router.push("/")
        }
          //判断是1000是100
          let money_code = localStorage.getItem("how_much");
          if(money_code === "activity_has_prize_99"){
              this.is_yiqin = false;
              this.money_code = 2041
          }else{
              this.is_yiqin = true;
              this.money_code = 2042
          }
        //判断活动是否结束
        // if(sessionStorage.getItem("isEnd")){
        //     this.isEnd = sessionStorage.getItem("isEnd");
        //   }
        //监听返回键点击关闭页面
        let that = this;
        if (window.history && window.history.pushState){
            window.addEventListener("popstate", function(e) {
              WeixinJSBridge.call('closeWindow');
            }, false);
        }
        $(".go_buy").click(function(){
          if(that.jquery_status){
            location.href = `https://mobile.sxwinstar.net/ccb/thursday/#/seckill/activity?activityId=204&itemId=${that.money_code}`;
          }
        })

      },
      beforeDestroy(){
        sessionStorage.removeItem("authenticationStatus");
      },
      methods:{
        go_buy(){
          api.do_post("/ccb-api/api/v1/cbc/drawActivity/judge").then(res=>{
            if(!res){
              return
            }
            //success已验证未抽奖
            if(res.code === "success"){
            }else{
              //活动结束
              if(res.errorCode === "activity_end"){
                this.active_status = true;
              }else{
                this.jquery_status = true;
                location.href = `https://mobile.sxwinstar.net/ccb/thursday/#/seckill/activity?activityId=204&itemId=${this.money_code}`;
              }
            }
          }).catch(err=>{
            console.log(err)
          })



        },
        did_draw_fog(){
          this.active_status = false;
        }
      }
    }
</script>

<style lang="scss" scoped>
  .did_draw{
    width:100%;
    height:100vh;
    position: fixed;
    left:0;
    top:0;
    background: rgba(0,0,0,.4);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img:nth-child(1){
      width:330px;
    }
    img:nth-child(2){
      width:80px;
      margin-top:-105px;
    }
    img:nth-child(3){
      width:35px;
      margin-top:80px;
    }
  }
.winning_the_prize{
  width:100%;
  height:100vh;
  min-height: 600px;
  position: relative;
  .pic{
    position: absolute;
  }
  .pic:nth-child(1){
    width:100%;
    height:100%;
    left:0;
    top:0;
  }
  .pic:nth-child(2){
    width:130px;
    left:50%;
    transform: translateX(-50%);
    top:400px;
  }
}
</style>
