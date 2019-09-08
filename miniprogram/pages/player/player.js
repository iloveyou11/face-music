// 因为musiclist、nowPlayingIndex数据都不需要在页面上显示，因此不需要放到data中维护
let musiclist=[]
let nowPlayingIndex=0 //正在播放歌曲的index
const musicManager=wx.getBackgroundAudioManager()
const app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    isPlaying: false, //false不播放。true播放
    isLyricsShow:false,
    lyric:'',
    isSameMusic:false //是否为同一首歌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    nowPlayingIndex = options.index
    musiclist=wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },

  changeView(){
    this.setData({
      isLyricsShow: !this.data.isLyricsShow
    })
  },

  _loadMusicDetail(musicId){
    // 判断是否为同一首歌曲
    if (musicId === app.getPlayingMusicId()){
      this.setData({
        isSameMusic:true
      })
    }else{
      this.setData({
        isSameMusic: false
      })
    }
    // 先停止音乐，再加载，可以提升用户体验
    if(!this.data.isSameMusic){
      musicManager.stop()
    }

    let music = musiclist[nowPlayingIndex]
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl
    })
    // 设置全局属性
    app.setPlayingMusicId(musicId)

    wx.showLoading({
      title: '歌曲正在加载……',
    })

    wx.cloud.callFunction({
      name:'music',
      data:{
        $url:'musicUrl',
        musicId: musicId
      }
    }).then(res=>{
      let result=JSON.parse(res.result)

      // 判断是否能获取歌曲的url值，因为有些歌单是VIP歌单，用户未登录，无权限
      if(result.data[0].url==null){
        wx.showToast({
          title: '无权限博凡',
        })
        return
      }

      if (!this.data.isSameMusic) {
        musicManager.src = result.data[0].url
        musicManager.title = music.name
        musicManager.coverImgUrl = music.al.picUrl
        musicManager.singer = music.ar[0].name
        musicManager.epname = music.al.name //专辑名称
      }

      // 保存播放历史
      this.savePlayHistory()

      this.setData({
        isPlaying:true
      })
      wx.hideLoading()

     // 加载歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          $url: 'lyric',
          musicId: musicId
        }
      }).then(res=>{
        console.log(res)
        let lyric='暂无歌词'
        const lrc=JSON.parse(res.result).lrc
        if(lrc){
          lyric = lrc.lyric
        }
        this.setData({
          lyric: lyric
        })
      })
    })
  },

  timeUpdate(e){
    this.selectComponent('.lyrics').update(e.detail.curTime)
  },

  musicPlay(){
    this.setData({
      isPlaying:true
    })
  },

  musicPause(){
    this.setData({
      isPlaying: false
    })
  },

  toggleMusic(){
    this.data.isPlaying ? musicManager.pause() : musicManager.play()
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  // 下一首
  onPrev(){
    if(nowPlayingIndex===0){
      nowPlayingIndex=musiclist.length
    }
    nowPlayingIndex--
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },
  // 上一首
  onNext(){
    if (nowPlayingIndex === musiclist.length-1) {
      nowPlayingIndex = -1
    }
    nowPlayingIndex++
    this._loadMusicDetail(musiclist[nowPlayingIndex].id)
  },

  // 保存播放历史
  savePlayHistory(){
    // 当前正在播放的歌曲
    const music=musiclist[nowPlayingIndex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    let isHave=false
    let id=-1
    // 判断歌曲是否已经存在本地存储中
    for (let i = 0, len = history.length; i < len; i++) {
      if (history[i].id === music.id) {
        isHave = true
        id=i
        break
      }
    }

    if (isHave) { 
      history.splice(id, 1)
    }
    history.unshift(music)
    console.log(history)
    wx.setStorage({
      key: openid,
      data: history
    })
  },

})