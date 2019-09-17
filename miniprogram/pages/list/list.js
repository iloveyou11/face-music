const MAX_LENGTH=15
const db=wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swipers:[],
    // swipers: [{
    //   url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
    // },
    //   {
    //     url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
    //   },
    //   {
    //     url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
    //   }],
      playlist:[]
  },

  _getSwiper(){
    db.collection('swiper').get().then(res=>{
      this.setData({
        swipers:res.data
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getPlaylist()
    this._getSwiper()
  },

  
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      playlist:[]
    })
    this._getPlaylist()
    this._getSwiper()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist()
  },

  _getPlaylist(){
    wx.showLoading({
      title: '正在加载……',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LENGTH,
        $url:'playlist'
      }
    }).then(res => {
      if (res.result.data.length===0){
        wx.hideLoading()
        wx.showToast({
          title: '已经到底啦',
        })
        return
      }
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })
      // 当数据请求回来时，停止下拉刷新的操作
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  }
})