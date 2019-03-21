
//post function-----------------------------
function _post(url, data ,method , token = true) {
  console.log(token,method)
  return fetch(url, {
    method: method,
    type: 'json',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      "token_id":token?localStorage.getItem("tokenId"):undefined
    },
  })
}

export default {
//do_post-----------------------------------
  do_post(url,data,token){
    return Promise.race([
      _post(url,data,"POST",token),
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

  do_get( url,token){
    return Promise.race([
      _post(url, undefined ,"GET", token),
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

