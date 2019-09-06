let moveAreaWidth, moveViewWidth
const musicManager=wx.getBackgroundAudioManager()
// 定义变量记录当前正在播放的秒数
let curSec=-1
// 记录当前音乐地总时长
let duration=0
// 记录当前进度条是否在拖动，这样可以避免update相关setData操作
// 解决当前进度条拖拽和timeUpdate事件产生冲突的问题
let isMoving=false

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    musicTime:{
      curTime: '00:00',
      totalTime:'00:00'
    },
    distance:0,
    percent:0
  },

  lifetimes:{
    ready(){
      this._getMovableWidth()
      this._bindMusicEvent()
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e){
      // source为touch时代表是拖动，可详见小程序开发文档
      if(e.detail.source==='touch'){
        // 不要在这里进行setData，这样会频繁更新页面数据，严重影响性能，应该统一在onTouchEnd中setData
        this.data.percent=e.detail.x/(moveAreaWidth-moveViewWidth)*100
        this.data.distance=e.detail.x
        isMoving=true
      }
    },
    // 停止拖动进度条时，做一下操作：
    // 1）当前播放时间
    // 2）当前进度条位置
    // 3）当前音乐播放进度
    onTouchEnd(){
      let curTimeFormat = this._timeFormat(musicManager.currentTime)
      this.setData({
        percent:this.data.percent,
        distance: this.data.distance,
        ['musicTime.curTime']: `${curTimeFormat.min}:${curTimeFormat.sec}`
      })
      musicManager.seek(duration * this.data.percent / 100)
      isMoving = false
    },

    // 获取进度条的宽度、滑块的宽度（因为在不同型号终端上宽度是不同的）
    _getMovableWidth(){
      const query=this.createSelectorQuery()
      query.select('.movable-area').boundingClientRect()
      query.select('.movable-view').boundingClientRect()
      query.exec(q=>{
        moveAreaWidth = q[0].width
        moveViewWidth=q[1].width
      })
    },

    // 绑定事件
    _bindMusicEvent(){
      musicManager.onPlay(()=>{
        isMoving=false;
      })
      musicManager.onStop(() => {
      })
      musicManager.onPause(() => {
      })
      musicManager.onWaiting(() => {
      })
      musicManager.onCanplay(() => {
        // 设置总时长
        // console.log(musicManager.duration)
        if (musicManager.duration!==undefined){
          this._setTime()
        }else{
          setTimeout(()=>{
            this._setTime()
          },1000)
        }
      })
      // 在这里更新进度条
      musicManager.onTimeUpdate(() => {
        if(!isMoving){
          let curTime = musicManager.currentTime
          let duration = musicManager.duration
          let curTimeFormat = this._timeFormat(curTime)
          // 频繁地setData会减少代码效率，减少setData的次数
          let sec = curTime.toString().split('')[0]
          if (sec !== curSec) {
            this.setData({
              distance: (moveAreaWidth - moveViewWidth) * curTime / duration,
              percent: curTime / duration * 100,
              ['musicTime.curTime']: `${curTimeFormat.min}:${curTimeFormat.sec}`
            })
            curSec = sec

            this.triggerEvent('timeUpdate',{
              curTime
            })
          }
        }
      })
      musicManager.onEnded(() => {
        this.triggerEvent('musicEnd')
      })
      musicManager.onError((err) => {
        console.log(err.errMsg)
        console.log(err.errCode)
        wx.showToast({
          title: '错误',
        })
      })
    },

    _setTime(){
      duration = musicManager.duration
      let formatedTime = this._timeFormat(duration)
      this.setData({
        ['musicTime.totalTime']: `${formatedTime.min}:${formatedTime.sec}`
      })
    },

    _timeFormat(time){
      let min = Math.floor(time / 60)
      let sec=Math.floor(time%60)
      return {
        'min': this._padTime(min),
        'sec': this._padTime(sec)
      }
    },

    _padTime(sec){
      return sec<10?'0'+sec:sec
    },


  }
})
