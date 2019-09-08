const app=getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist:Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId:-1
  },

  // 组件页面的生命周期，如果显示，则去获取全局的musicId属性，并设置其高亮
  pageLifetimes:{
    show(){
      this.setData({
        playingId: parseInt(app.getPlayingMusicId())
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    select(e){
      // console.log(e.currentTarget.dataset.musicid)
      const musicid = e.currentTarget.dataset.musicid
      const index = e.currentTarget.dataset.index
      this.setData({
        playingId: musicid
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${musicid}&index=${index}`,
      })
    }
  }
})
