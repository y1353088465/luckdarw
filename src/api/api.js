import message from "./common.js";

//token-------------------------------------

//post function-----------------------------
function _post(url, data ,method) {
  return fetch(url, {
    method: method,
    type: 'json',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      "token_id":localStorage.getItem("tokenId")
    },
  })
}

export default {
//do_post-----------------------------------
  do_post(url,data,method = "POST"){
    return Promise.race([
      _post(url,data,method),
      new Promise(function(resolve,reject){
        setTimeout(()=> reject(new Error('request timeout')),10000)
      })])
      .then((res) => {
        if(res){
          return res.json()
        }
        if(res.status === 200){

        }else{
          alert(res.description);
        }
      }).catch((err)=>{
        if(err.message === "request timeout"){
          alert("请求超时，请刷新重试");
        }
    })
  },

  do_get(url,data,method = "GET"){
    return Promise.race([
      _post(url,data,method),
      new Promise(function(resolve,reject){
        setTimeout(()=> reject(new Error('request timeout')),10000)
      })])
      .then((res) => {
        if(res){
          return res.json()
        }
        if(res.status === 200){

        }else{
          alert(res.description);
        }
      }).catch((err)=>{
        if(err.message === "request timeout"){
          alert("请求超时，请刷新重试");
        }
      })
  }
}

