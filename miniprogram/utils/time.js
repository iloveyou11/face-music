module.exports=(date)=>{
  let formatedDate=''
  let o={
    year: date.getFullYear(),
    month: (date.getMonth() + 1).toString().length === 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1,
    day: (date.getDay() + 1).toString().length === 1 ? `0${date.getDay() + 1}` : date.getDay() + 1,
    hour: date.getHours(),
    minute: (date.getMinutes() + 1).toString().length === 1 ? `0${date.getMinutes() + 1}` : date.getMinutes() + 1,
    second: (date.getSeconds() + 1).toString().length === 1 ? `0${date.getSeconds() + 1}` : date.getSeconds() + 1,
  }
  formatedDate=`${o.year}-${o.month}-${o.day} ${o.hour}:${o.minute}:${o.second}`
  return formatedDate
}

// module.exports = (date) => {
//   let fmt = 'yyyy-MM-dd hh:mm:ss'
//   const o = {
//     'M+': date.getMonth() + 1, // 月份
//     'd+': date.getDate(), // 日
//     'h+': date.getHourss(), // 小时
//     'm+': date.getMinutess(), // 分钟
//     's+': date.getSecondss(), // 秒
//   }
//   if (/(y+)/.test(fmt)) {
//     fmt = fmt.replace(RegExp.$1, date.getFullYear())
//   }
//   for (let k in o) {
//     if (new RegExp('(' + k + ')').test(fmt)) {
//       fmt = fmt.replace(RegExp.$1, o[k].toString().length == 1 ? '0' + o[k] : o[k])
//     }
//   }
//   return fmt
// }