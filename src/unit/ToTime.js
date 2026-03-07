export default (time) => { 
  const date = new Date(time)

  // 自定义选项
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // 24小时制
    timeZone: 'Asia/Shanghai' // 可指定时区，默认本地
  };

  const formatted = date.toLocaleString('zh-CN', options);
  return formatted
}