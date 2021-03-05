// components/musicList/musicList.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musicData: {
      type: Array
    }
  },
pageLifetimes:{
  show(){
    this.setData({
      MusicSelectId: app.getMusicId()
    })
  }
},
  /**
   * 组件的初始数据
   */
  data: {
    MusicSelectId: -1
  },

  /**
   * 组件的方法列表
   */
  methods: {
    selectMusic(event){
      const currentTarget = event.currentTarget.dataset
      const MusicSelectId = currentTarget.music
      const index = currentTarget.index
      this.setData({
        MusicSelectId
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicid=${MusicSelectId}&index=${index}`,
      })
    }
  }
})
