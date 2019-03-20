<template>
  <div class="no_prize"></div>
</template>

<script>
    export default {
        name: "no_prize",
      mounted(){
        if(sessionStorage.getItem("authenticationStatus")){
          this.card_code = localStorage.getItem("user_info");
        }else{
          this.$router.push("/")
        }
      },
      beforeDestroy(){
        sessionStorage.removeItem("authenticationStatus");
        WeixinJSBridge.call('closeWindow');
      }
    }
</script>

<style scoped>
  .no_prize{
    width:100%;
    height:100vh;
    background: url("../../static/img/no_proze.png") center no-repeat;
    background-size: 100% 100%;
  }

</style>
