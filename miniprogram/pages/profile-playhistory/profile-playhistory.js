const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    playHistory:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const playHistory = wx.getStorageSync(app.globalData.openid)
    console.log(playHistory)
    if (playHistory.length===0){
      wx.showModal({
        title: '当前播放历史为空！',
        content: '',
      })
    }else{
      // 将storage里面存储的musiclist替换成播放历史的歌单
      wx.setStorage({
        key: 'musiclist',
        data: playHistory,
      })
      this.setData({
        playHistory
      })
    }
  },

})