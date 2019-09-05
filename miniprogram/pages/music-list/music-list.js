Page({

  /**
   * 页面的初始数据
   */
  data: {
    musiclist: [],
    listInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        playlistId: options.playlistId,
        $url: 'musiclist'
      }
    }).then((res) => {
      // console.log(res)

      // 增加其他可展示的信息，使歌单详情更为详细
      // coverImgUrl 歌单封面

      // name 歌单名称
      // description 歌单描述

      // commentCount 评论总数
      // playCount 播放数量
      // shareCount 分享数量
      // subscribedCount 订阅数

      // tags：Araay 标签

      // subscribed 是否订阅

      const pl = res.result.playlist
      this.setData({
        musiclist: pl.tracks,
        listInfo: {
          coverImgUrl: pl.coverImgUrl,
          name: pl.name,
          description: pl.description,
          commentCount: pl.commentCount,
          playCount: pl.playCount,
          shareCount: pl.shareCount,
          subscribedCount: pl.subscribedCount,
          tags: pl.tags.join(' / '),
          subscribed: pl.subscribed
        }
      })
      wx.hideLoading()
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