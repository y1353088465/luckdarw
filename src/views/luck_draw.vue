<template>
    <div class="luck_draw">
      <ul>
        <li>
          <p>
            <span v-if="prize[0].status"></span>
          </p>
          <p>
            <span v-if="prize[1].status"></span>
          </p>
          <p>
            <span v-if="prize[2].status"></span>
          </p>
        </li>
        <li>
          <p>
            <span v-if="prize[3].status"></span>
          </p>
          <p @click="result&&start_draw()">
            <!--<span></span>-->
          </p>
          <p>
            <span v-if="prize[4].status"></span>
          </p>
        </li>
        <li>
          <p>
            <span v-if="prize[5].status"></span>
          </p>
          <p>
            <span v-if="prize[6].status"></span>
          </p>
          <p>
            <span v-if="prize[7].status"></span>
          </p>
        </li>
      </ul>
    </div>
</template>

<script>
  import api from "../api/api.js"
  import commons from "../api/common.js"
    export default {
        name: "luck_draw",
      data(){
          return{
            prize:[{status:true},{status:true},{status:true},{status:true},{status:true},{status:true},{status:true},{status:true},],//
            result:true,//动画状态false为未关闭
            card_code:'',//发送的卡号
            prize_code:'',//返回的中奖码
          }
      },
      mounted(){
        if(sessionStorage.getItem("authenticationStatus")){
          }else{
            this.$router.push("/")
          }

        this.card_code = localStorage.getItem("user_info");
      },
      methods:{
        start_draw(){
          this.result = false;
          // 动画
          let times = 100;
          let timer = setInterval(()=>{
            times--;
            let item_index = Math.round(Math.random()*7);

            this.prize.forEach((v)=>{
              v.status = true;
            });
            this.prize[item_index].status = false;

            //接口数据改变result值，结束抽奖动画，抽出奖项
            if(this.result){
              clearInterval(timer);
              this.prize.forEach((v)=>{
                v.status = true;
              });

              //未中奖
              if(this.prize_code == 0){
                this.prize[1].status = false;
                setTimeout(()=>{
                  this.$router.push("/no_prize");
                },1000)

                //中奖99券
              }else if(this.prize_code == 1){
                this.prize[7].status = false;
                setTimeout(()=>{
                  localStorage.setItem("how_much","activity_has_prize_99");
                  this.$router.push("/winning_the_prize");
                },1000)

                //中奖999券
              }else if(this.prize_code == 2){
                this.prize[2].status = false;
                setTimeout(()=>{
                  localStorage.setItem("how_much","activity_has_prize_999");
                  this.$router.push("/winning_the_prize");
                },1000)
              }
            }else{
              times++
            }
          },80);

          api.do_post("/ccb-api/api/v1/cbc/draw",{
            cardNumber:Number(this.card_code)
          }).then(res=>{
            console.log(res);
            if(res.data){
              setTimeout(()=>{
                this.prize_code = res.data.prizedId;
                this.result = true;
              },3000);
            }else{
              alert(res.message)
            }
          }).catch(err=>{
            alert("服务器繁忙")
          })

        }
      }
    }
</script>

<style scoped lang="scss">
.luck_draw{
  width:100%;
  height:100vh;
  min-height: 660px;
  background: url("../../static/img/luck_draw_bg.png") top center no-repeat #ffdfb6;
  background-size: 100% 680px;
  display: flex;
  /*flex-direction: column;*/
  ul{
    flex: 1;
    width:286px;
    height:275px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding:270px 44px 0;
    li:nth-child(1){
      p:nth-child(1){
        background-image: url("../../static/img/100yuan.png");
      }
      p:nth-child(2){
        background-image: url("../../static/img/tanks_participation.png");
      }
      p:nth-child(3){
        background-image: url("../../static/img/1000yuan.png");
      }
    }
    li:nth-child(2){
      p:nth-child(1){
        background-image: url("../../static/img/tanks_participation.png");
      }
      p:nth-child(2){
        background-image: url("../../static/img/go_btn.png");
        background-size: 110% 110%;
      }
      p:nth-child(3){
        background-image: url("../../static/img/tanks_participation.png");
      }
    }
    li:nth-child(3){
      p:nth-child(1){
        background-image: url("../../static/img/tanks_participation.png");
      }
      p:nth-child(2){
        background-image: url("../../static/img/100yuan.png");
      }
      p:nth-child(3){
        background-image: url("../../static/img/100yuan.png");
      }
    }

    li{
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width:100%;
      p{
        flex:1;
        height:83px;
        max-height:90%;
        background: #ffcdba;
        background-position: center;
        background-size: 80px;
        background-repeat: no-repeat;
        margin:0 3px;
        border-radius: 5px;
        position: relative;
        span{
          display: block;
          width:100%;
          height:100%;
          background: #000;
          opacity: .2;
          border-radius: 5px;
          position: absolute;
          left:0;
          top:0;
        }
      }
    }
  }
}
</style>
