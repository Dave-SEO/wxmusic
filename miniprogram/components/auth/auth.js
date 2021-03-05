// components/auth/auth.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    modal: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeModal(){
      this.triggerEvent('closeModal')
    },
    getuserinfo(event){
      let {detail:{userInfo}} = event
      if(userInfo){
        // 用户授权成功
       this.triggerEvent('onAuthSuccess', userInfo)
       this.closeModal()
      }else{
        // 用户未授权
        this.triggerEvent('onAuthError')
      }
    }
  }
})
