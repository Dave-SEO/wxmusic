// components/blog-card/blog-card.js
import formateTime from '../../utils/formateTime.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    card: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    createTime: ''
  }, 
  observers: {
    'card.creatTime': function(val){
      this.setData({
        createTime: formateTime(new Date(val))
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    priveImg(event){
      console.log(event.currentTarget.dataset)
      wx.previewImage({
        urls: event.currentTarget.dataset.imgarr,
        current: event.currentTarget.dataset.img
      })
    }
  }
})
