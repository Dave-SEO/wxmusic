// pages/historyPlay/historyPlay.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this._getloaderHistroyMusic()
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
  _getloaderHistroyMusic(){
    let openid = app.globalData.openId
    console.log('openid--', openid)
    let musicList = wx.getStorageSync(openid)
    if(musicList.length > 0){
      this.setData({
        musicList
      })
      wx.setStorageSync('musicStore', musicList)
    }else{
      wx.showToast({
        title: '暂无最近播放',
      })
    }
  }
})