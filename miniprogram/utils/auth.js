module.exports = {
  getUserInfo(){
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          console.log('res', res)
          if(res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success: data => {
                resolve({
                  auth: true,
                  userInfo: data.userInfo
                })
              }
            })
          } else {
            resolve({
              auth: false
            })
          }
        }
      })
    })
  }
}