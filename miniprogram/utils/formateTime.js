module.exports = (date) => {
  let fmt = 'yyyy-MM-dd hh:mm:ss'
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  if(/(y+)/.test(fmt)){
    fmt = fmt.replace(RegExp.$1, date.getFullYear())
  }
  for(let k in o){
    if(new RegExp('('+ k +')').test(fmt)){
      fmt = fmt.replace(RegExp.$1, o[k].toString().padStart(2, 0))
    }
  }
  return fmt
}