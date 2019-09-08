// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext=cloud.getWXContext()
  const result=await cloud.openapi.wxacode.getUnlimited({
    scene: wxContext.OPENID
  })
  // console.log(result) 二进制文件
  // 如何将其转化为图片？
  // 上传至云存储
  const upload=await cloud.uploadFile({
    cloudPath:'qrcode/'+Date.now()+'-'+Math.random()+'.png',
    fileContent:result.buffer
  })
  return upload.fileID
}