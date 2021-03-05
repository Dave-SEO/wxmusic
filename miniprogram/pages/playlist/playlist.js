// pages/playlist/playlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicList: [],
    muiscInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'PlayListRouter',
        playlistid: options.playlistid
      },
      success: res => {
        const {result:{code, playlist:{coverImgUrl, name, tracks}}} = res
        if(code === 200 ){
          this.setData({
            musicList: tracks,
            muiscInfo: {
              coverImgUrl,
              name
            }
          })
          wx.setStorageSync('musicStore', tracks)
        }
      },
      complete: () => {
        wx.hideLoading()
      }
    })
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

  }
})