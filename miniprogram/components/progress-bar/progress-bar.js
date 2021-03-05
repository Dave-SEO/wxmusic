// components/progress/progress-bar.js
let movableAreaWidth = 0
let movableViewWidth = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
let chongfu = -1
let istouchMove = false
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    movableX: 0,
    progress: 0,
    durationTimes: {
      startTime: '00:00',
      endTime: '00:00'
    }
  },
lifetimes:{
  ready(){
    if(this.properties.isSame){
      this._setTime()
    }
    this._getMovableAreaWidth()
    this._getPlayEvent()
  }
},
  /**
   * 组件的方法列表
   */
  methods: {
    _getMovableAreaWidth(){
      const query = this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec((rect) => {
        movableAreaWidth = rect[0].width
        movableViewWidth = rect[1].width
      })
    },
    _getPlayEvent(){
      backgroundAudioManager.onCanplay(() => {
        this._setTime()
      })
      backgroundAudioManager.onTimeUpdate(() => {
        if(!istouchMove){
          let currentTime = backgroundAudioManager.currentTime
          let duration = backgroundAudioManager.duration
          let movableX = (movableAreaWidth - movableViewWidth) * currentTime / duration
          const sec = Math.floor(currentTime.toString())
          if(sec != chongfu){
            this.setData({
              "durationTimes.startTime": `${this.formateTimes(currentTime).min}:${this.formateTimes(currentTime).s}`,
              movableX,
              progress: currentTime /  duration * 100
            })
            chongfu = sec
            this.triggerEvent('updateTime', {
              currentTime
            })
          }
        }
      })
      backgroundAudioManager.onEnded(() => {
        this.triggerEvent('emitNextMusic')
      })
      backgroundAudioManager.onPlay(() => {
        istouchMove = false
        this.triggerEvent('onPlay')
      })
      backgroundAudioManager.onPause(() => {
        this.triggerEvent('onPause')
      })
    },
    _setTime(){
      let duration = {}
        if(backgroundAudioManager.duration){
          duration = this.formateTimes(backgroundAudioManager.duration)
          this.setData({
            ['durationTimes.endTime']: `${duration.min}:${duration.s}`
          })
        }else{
          setTimeout(() => {
            duration = this.formateTimes(backgroundAudioManager.duration)
            this.setData({
              ['durationTimes.endTime']: `${duration.min}:${duration.s}`
            })
          }, 100)
        }
    },
    formateTimes(time){
      // 传入 秒
      if(time < 60){
        return {
          min: '00',
          s: Math.floor(time).toString().padStart(2, '0')
        }
      }
      let min = time / 60
      let s = time % 60
      console.log('min', min)
      return {
        min: min.toString().padStart(2, '0'),
        s: min.toString().padStart(2, '0')
      }
    },
    data: {
      progress: '',
      currentTime: ''
    },
    movableChange(event){
      if(event.detail.source === 'touch'){
        console.log('event', event)
        istouchMove = true
        let duration = backgroundAudioManager.duration 
        this.data.progress = event.detail.x * 100 / (movableAreaWidth - movableViewWidth)
        this.data.currentTime =  duration * event.detail.x / (movableAreaWidth - movableViewWidth)
        backgroundAudioManager.seek(this.data.currentTime)
      }
    },
    progressTouchend(){
      istouchMove = false
      this.setData({
        progress: this.data.progress
      })
    }
  }
})
