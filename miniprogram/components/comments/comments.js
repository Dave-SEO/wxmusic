// components/comments/comments.js
import app from '../../utils/auth.js'
const db = wx.cloud.database()
let userInfo = {}
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogid: {
      type: String
    },
    blogitem: {
      type: Object
    }
  },
  options:{
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的初始数据
   */
  data: {
    modal: false,
    isComment: false,
    content: '',
    bottom: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closeModal(){
      console.log('closeModal')
      this.setData({
        modal: false,
        isComment: false
      })
    },
    onAuthSuccess(event){
      userInfo = event.detail
      this.setData({
        modal: false
      }, () => {
        this.setData({
          isComment: true
        })
      })
    },
    onAuthError(){
     wx.showModal({
       title: '用户授权后才可以评论',
       cancelColor: 'cancelColor',
     })
    },
    async comment(){
      let result = await app.getUserInfo()
      console.log('resu', result)
      if(result.auth){
        this.setData({
          isComment: true
        })
        userInfo = result.userInfo
      }else{
        console.log('authfalse')
        this.setData({
          modal: true
        })
      }
    },
    fenxiang(){
      this.triggerEvent('onFenxiang')
    },
    textareaFocus(event){
      console.log('event.detail.height', event.detail.height)
      this.setData({
        bottom: event.detail.height - 80
      })
    },
    textareaBlur(){
      this.setData({
        bottom: 0
      })
    },
   async sendComment(event){
      // wx.getSetting({
      //   withSubscriptions: true,
      //   success: res => {
      //     console.log('getSetting', res)
      //   }
      // })
     await wx.requestSubscribeMessage({
        tmplIds: ['_RzZsTXQhulADai9uPdG_EMUY59ziZsk4tZH2uo8_js'],
        success (res) { 
          console.log('requestSubscribeMessage', res)
        },
        fail (e) {
          console.log('requestSubscribeMessage-e', e)
        }
      })
      // return
      let val = event.detail.value.content
      let formId = event.detail.formId
      if(val.trim() === ''){
        return false
      }
      wx.showLoading({
        title: '评论中...',
        mask: true
      })
      console.log('userInfo', userInfo)
      db.collection('blog-comments').add({
        data: {
          ...userInfo,
          blogId: this.properties.blogid,
          content: val,
          createTime: db.serverDate()
        }
      }).then(res => {
        wx.cloud.callFunction({
          name: 'blogcomment',
          data: {
            formId,
            content: val
          }
        })
        wx.hideLoading()
        this.triggerEvent('onCommentSuccess')
        this.setData({
          content: '',
          modal: false,
          isComment: false
        })
      })
    }
  }
})
