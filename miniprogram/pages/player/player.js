// 因为musiclist、nowPlayingIndex数据都不需要在页面上显示，因此不需要放到data中维护
let musiclist=[]
let nowPlayingIndex=0 //正在播放歌曲的index
const musicManager=wx.getBackgroundAudioManager()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    isPlaying: false, //false不播放。true播放
    isLyricsShow:false,
    lyric:''
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
    // 先停止音乐，再加载，可以提升用户体验
    musicManager.stop()

    let music = musiclist[nowPlayingIndex]
    console.log(music)
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl
    })

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
      // console.log(JSON.parse(res.result))
      let result=JSON.parse(res.result)
      musicManager.src = result.data[0].url
      musicManager.title = music.name
      musicManager.coverImgUrl = music.al.picUrl
      musicManager.singer = music.ar[0].name
      musicManager.epname = music.al.name //专辑名称

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
  }

})