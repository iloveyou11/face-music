// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {OPENID}=cloud.getWXContext()
  const result=await cloud.openapi.templateMessage.send({
    touser: OPENID,
    page: `pages/comment/comment?blogId=${event.blogId}`,
    data:{
      keyword1:{
        value: '评价人'
      },
      keyword2: {
        value: '评价完成'
      },
      keyword3: {
        value: event.content
      },
      keyword4: {
        value: '评价时间'
      },
      keyword5: {
        value: '您的评论是博主写作的动力，希望您可以多多支持哦'
      }
    },
    templateId:'7r_BMpwTytpEej9MVxjntMFXykTLIFMc1Ne800CQW0U',
    formId:event.formId
  })
  return result
}