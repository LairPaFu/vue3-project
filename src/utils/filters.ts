export default {
  // 时间戳过滤
  formatTime: (time: number): string => {
    let d = new Date(time)
    let str = ''
    try {
      str = d.toLocaleDateString()
    } catch (err) {
      str = ''
    }
    let new_d = new Date()
    let now_year = new_d.getFullYear() == d.getFullYear()
    let now_month = new_d.getMonth() == d.getMonth()
    let now_day = new_d.getDate() == d.getDate()
    let differ = new_d.getTime() - time
    let differ_days = Math.floor(differ / (24 * 3600 * 1000))
    let hour_level = differ % (24 * 3600 * 1000)
    let differ_hours = Math.floor(hour_level / (3600 * 1000))
    let minutes_level = hour_level % (3600 * 1000)
    let differ_minutes = Math.floor(minutes_level / (60 * 1000))
    let seconds_level = minutes_level % (60 * 1000)
    let differ_seconds = Math.floor(seconds_level / 1000)
    if (now_year && now_month && now_day) {
      let dh = d.getHours().toString().toString().length > 1 ? d.getHours() : ('0' + d.getHours())
      let dm = d.getMinutes().toString().toString().length > 1 ? d.getMinutes() : ('0' + d.getMinutes())
      let dd = d.getSeconds().toString().toString().length > 1 ? d.getSeconds() : ('0' + d.getSeconds())
      str = dh + ':' + dm + ":" + dd
      // console.log(differ_seconds);
      if (differ_hours > 0 && differ_hours < 12) {
        str = differ_hours + '小时前'
      } else if ((differ_minutes > 0 && differ_minutes < 60) || differ_seconds >= 0) {
        str = differ_minutes > 0 ? differ_minutes + '分钟前' : '1分钟前'
      }
    } else {
      if (differ_days == 1) {
        str = '昨天'
      } else if (now_year) {
        str = d.getMonth() + '/' + d.getDate()
      }
    }

    return str
  },
  // textarea内容过滤
  // textareaUpdate: (content: string): string => {
  //   // 过滤空格
  //   content = content.replaceAll(" ", "&nbsp;&nbsp;")
  //   console.log("过滤空格", content);
  //   // 过滤换行
  //   content = content.replaceAll("\n", "<br/>");
  //   console.log("过滤换行", content);
  //   content = content.replaceAll("\r", "<br/>");
  //   console.log("过滤换行", content);
  //   return content;
  // }
}