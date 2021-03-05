// components/lyric/lyric.js
let lyricHeight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lyric: String,
    showLyric: {
      type: Boolean,
      value: false
    }
  },
  observers:{
    lyric: function(val){
      this._formateLyric(val)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    lrcIndex: -1,
    scrollTop: 0
  },
lifetimes:{
  ready(){
    wx.getSystemInfo({
      // 750rpx
      success(res){
        // 求出1rpx高度 
        lyricHeight = res.screenWidth / 750 * 50
        console.log('getSystemInfoSync', res.screenWidth)
      }
    })
  }
},
  /**
   * 组件的方法列表
   */
  methods: {
    _formateLyric(str){
      let line = str.split('\n')
      let lrcArr = []
      line.forEach(element => {
        let time = element.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if(time){
          let lrc = element.split(time[0])[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // 把时间转换为秒
          let seconds = parseInt(timeReg[1] * 60) + parseInt(timeReg[2]) + parseInt(timeReg[3] / 1000)
          lrcArr.push({
            time: seconds,
            lrc
          })
        }
      });
      this.setData({
        lrcList: lrcArr
      })
    },
    update(event){
      let currentTime = event.detail.currentTime
      let lrcList = this.data.lrcList
      if(lrcList.length === 0) return
      if(currentTime > lrcList[lrcList.length - 1].time){
        this.setData({
          lrcIndex: lrcList.length - 1,
          scrollTop: (lrcList.length - 1) * lyricHeight
        })
      }
      for(let i = 0; i < lrcList.length; i++){
        if(currentTime <= lrcList[i].time){
          this.setData({
            lrcIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    }
  }
})
