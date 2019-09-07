// 输入文字最大的个数
const MAX_WORDS_NUM = 140
// 最大上传图片数量
const MAX_IMG_NUM = 9

const db = wx.cloud.database()
// 输入的文字内容
let content = ''
let userInfo = {}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 输入的文字个数
    wordsNum: 0,
    footerBottom: 0,
    images: [],
    selectPhoto: true, // 添加图片元素是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options
  },

  onInput(event) {
    let wordsNum = event.detail.value.length
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = event.detail.value
  },

  onFocus(event) {
    // 模拟器获取的键盘高度为0
    // console.log(event)
    this.setData({
      footerBottom: event.detail.height,
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0,
    })
  },

  onChooseImage() {
    // 还能再选几张图片
    let max = MAX_IMG_NUM - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        // 还能再选几张图片
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      },
    })
  },
  onDelImage(event) {
    this.data.images.splice(event.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    if (this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true,
      })
    }
  },

  onPreviewImage(event) {
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc,
    })
  },

  // 点击发布
  send(){
    // 数据存储在云数据库中
    // 字段——内容、图片、openid（小程序用户的唯一标识）、昵称、头像、时间
    // 图片上传到云存储 fileID 云文件唯一标识

    // 首先判断内容是否为空
    if(content.trim()===''){
      wx.showModal({
        title: '当前内容不能为空!',
        content: '',
      })
      return
    }

    // mask: true表示采用蒙版，loading状态时用户无法点击操作
    wx.showLoading({
      title: '发布中……',
      mask:true
    })

    let promiseArr=[]
    let fileIDs=[]

    // 云存储只支持单文件上传，因此需要循环遍历，依次上传图片
    for(let i=0;i<this.data.images.length;i++){
      let p=new Promise((resolve,reject)=>{
        let item = this.data.images[i]
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          // 保证文件名不重复
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,
          success: res => {
            fileIDs.push(res.fileID)
            resolve()
          },
          fail: err => {
            console.log(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }

    // 将数据插入数据库
    // 内容、图片、openid（小程序用户的唯一标识）、昵称、头像、时间
    Promise.all(promiseArr).then(res => {
      db.collection('blog').add({
        data: {
          content,
          img: fileIDs,
          ...userInfo,
          createTime:db.serverDate() 
        }
      }).then(res=>{
        wx.hideLoading()
        wx.showToast({
          title: '发布成功！',
        })
        // 返回博客页面，刷新博客列表
        // 可以直接调用上一个页面（就是博客页面）的onPullDownRefresh方法完成刷新
        wx.navigateBack()
        const pages=getCurrentPages()
        const prevPage = pages[pages.length-2]
        prevPage.onPullDownRefresh()
      })
    }).catch(err=>{
      wx.hideLoading()
      wx.showToast({
        title: '发布失败！',
      })
    })
   

  },
})