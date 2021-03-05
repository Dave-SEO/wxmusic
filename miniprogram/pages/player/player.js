// pages/player/player.js
const backgroundAudioManager = wx.getBackgroundAudioManager()
let musicStore = {}
let playIndex = 0
const app = getApp()
let same = -1
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentMusicInfo: {},
    playing: false,
    lyricStr: '',
    isLyric: false,
    isSame: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    playIndex = options.index
    this._getLoaderMusic()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  _getLoaderMusic(){
    musicStore = wx.getStorageSync('musicStore')
    let {id, name, al:{picUrl, name: alName}, ar} = musicStore[playIndex]
    const singerName = ar[0].name
    app.setMusicId(id)
    this.setData({
      currentMusicInfo: {
        id,
        singerName,
        alName,
        musicName: name,
        picUrl
      }
    })
    
    if(same !== this.data.currentMusicInfo.id){
      this._setMusicPlayer()
      same = this.data.currentMusicInfo.id
      this.setData({
        isSame: false
      })
      return
    }else{
      this.setData({
        isSame: true,
        playing: true
      })
      this.loaderLyric()
    }
  },
  _setMusicPlayer(){
    this.setData({
      playing: false
    })
    if(same !== this.data.currentMusicInfo.id){
      backgroundAudioManager.stop()
    }
    wx.setNavigationBarTitle({
      title: this.data.currentMusicInfo.musicName
    })
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        id: this.data.currentMusicInfo.id,
        $url: 'musicUrl'
      },
      success: res => {
        const {result:{code, data}} = res
        if(!data[0].url){
          wx.showToast({
            title: '当前歌曲无权限播放',
            icon: 'none'
          })
          return
        }
        let openid = app.globalData.openId
        let historyMusic = wx.getStorageSync(openid)
        let historyFlag = false
        if(historyMusic){
          for(let i = 0; i < historyMusic.length; i++){
            if(historyMusic[i].id === musicStore[playIndex].id){
              historyFlag = true
              break
            }
          }
          if(!historyFlag){
            historyMusic.push(musicStore[playIndex])
          }
        }else{
          historyMusic.push(musicStore[playIndex])
        }
        wx.setStorageSync(openid, historyMusic)
        backgroundAudioManager.src = data[0].url
        backgroundAudioManager.title = this.data.currentMusicInfo.musicName
        backgroundAudioManager.epname = this.data.currentMusicInfo.alName
        backgroundAudioManager.singer = this.data.currentMusicInfo.singerName
        backgroundAudioManager.coverImgUrl = this.data.currentMusicInfo.picUrl
        this.setData({
          playing: true
        })
        this.loaderLyric()
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },
  loaderLyric(){
    wx.cloud.callFunction({
      name: 'music',
      data:{
        $url: 'lyric',
        id: this.data.currentMusicInfo.id
      },
      success: res => {
        const {result:{code, lrc:{lyric}}} = res
        if(code === 200 ){
          this.setData({
            lyricStr: lyric
          })
        }
      },
      complete: () => {

      }
    })
  },
  playtoggle(){
    if(this.data.playing){
      backgroundAudioManager.pause()
    }else{
      backgroundAudioManager.play()
    }
    this.setData({
      playing: !this.data.playing
    })
  },
  prev(){
    playIndex --
    if(playIndex < 0){
      playIndex = musicStore.length - 1
    }
    this._getLoaderMusic()
  },
  next(){
    playIndex ++
    if(playIndex >= musicStore.length){
      playIndex = 0
    }
    console.log(playIndex)
    this._getLoaderMusic()
  },
  toggleLyric(){
    this.setData({
      isLyric: !this.data.isLyric
    })
  },
  updateTime(event){
    this.selectComponent('.lyricBox').update(event)
  },
  onPlay(){
    this.setData({
      playing: true
    })
  },
  onPause(){
    this.setData({
      playing: false
    })
  }
})