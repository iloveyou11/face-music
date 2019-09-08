Page({
  onTapQrCode(){
    wx.showLoading({
      title: '生成中',
    })
    wx.cloud.callFunction({
      name:'wxcode'
    }).then(res=>{
      const img=res.result
      wx.previewImage({
        urls: [img],
        current: img
      })
      wx.hideLoading()
    })
  }
})