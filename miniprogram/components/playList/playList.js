// components/playList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playList:{
      type: Object
    }
  },
  
  /**
   * 组件的初始数据
   */
  data: {
    _count: 0
  },
  observers: {
    'playList.playCount'(num) {
      this.setData({
        _count: this.formatCount(num, 2)
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    formatCount(num, point){
      let numstr = num.toString().split('.')[0]
      if(numstr.length < 5){
        return numstr
      }else if(numstr.length >= 5 && numstr.length <= 8){
         let decimal = numstr.substring(numstr.length - 4, numstr.length - 4 + point)
         return `${parseInt(numstr / 10000)}.${decimal}万`
      }else if(numstr.length > 8){
        let decimal = numstr.substring(numstr.length - 8, numstr.length - 8 + point)
        return `${parseInt(numstr / 100000000)}.${decimal}亿`
      }
    },
    touchMusicList(){
      wx.navigateTo({
        url: `../../pages/playlist/playlist?playlistid=${this.properties.playList.id}`,
      })
    }
  }
})
