// pages/found/found.js
let keword = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal: false,
    blogCard: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getLoderCard()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  _getLoderCard(start = 0){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        start,
        num: 10,
        keword,
        $url: 'blog-card',
      },
      success: (res) => {
        let {result} = res
        this.setData({
          blogCard: this.data.blogCard.concat(result)
        })
      },
      complete: () => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
      },
      fail: (e) => {
        console.log(e)
      }
    })
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
    this.setData({
      blogCard: []
    })
    this._getLoderCard()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getLoderCard(this.data.blogCard.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (data) {
    let  result = data.target.dataset.item
    return {
      title: result.desc,
      path: `pages/blogDetail/blogDetail?id=${result._id}`
    }
  },
  openmodal(){
    wx.getSetting({
      success: res =>{
        let {authSetting} = res
        if(authSetting['scope.userInfo']){
          wx.getUserInfo({
            success: data => {
              this.onAuthSuccess({
                detail: data.userInfo
              })
            }
          })
        }else{
          this.setData({
            modal: true
          })
        }
      }
    })
   
  },
  onAuthSuccess(event){
    let {detail:{avatarUrl, nickName}} = event
    wx.navigateTo({
      url: `../foundEdit/foundEdit?avatarUrl=${avatarUrl}&nickName=${nickName}`,
    })
  },
  detail(event){
    wx.navigateTo({
      url: `../blogDetail/blogDetail?id=${event.currentTarget.dataset.id}`
    })
  },
  onSearch(event){
    console.log(event)
    keword = event.detail.value
    this.setData({
      blogCard: []
    })
    this._getLoderCard()
  },
  onAuthError(){
    wx.showModal({
      title: '授权后才可使用发布功能',
      cancelColor: 'cancelColor',
    })
  },
  closeModal(){
    this.setData({
      modal: false
    })
  }
})