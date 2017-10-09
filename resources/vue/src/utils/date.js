import is from './type_is';
// 时间格式化
export const DateFormat = (timestamp, fmt) => {
  let fmtTemp = fmt;
  const o = {
    'M+': timestamp.getMonth() + 1, // 月份
    'd+': timestamp.getDate(), // 日
    'h+': timestamp.getHours() % 12 === 0 ? 12 : timestamp.getHours() % 12, // 小时
    'H+': timestamp.getHours(), // 小时
    'm+': timestamp.getMinutes(), // 分
    's+': timestamp.getSeconds(), // 秒
    'q+': Math.floor((timestamp.getMonth() + 3) / 3), // 季度
    S: timestamp.getMilliseconds(), // 毫秒
  };
  const week = {
    0: '/u65e5',
    1: '/u4e00',
    2: '/u4e8c',
    3: '/u4e09',
    4: '/u56db',
    5: '/u4e94',
    6: '/u516d',
  };
  if (/(y+)/.test(fmtTemp)) {
    fmtTemp = fmtTemp.replace(RegExp.$1, (`${timestamp.getFullYear()}`).substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmtTemp)) {
    const targetStr = (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468');
    fmtTemp = fmtTemp.replace(RegExp.$1, ((RegExp.$1.length > 1) ? targetStr : '') + week[`${timestamp.getDay()}`]);
  }
  Object.keys(o).forEach((k) => {
    if (new RegExp(`(${k})`).test(fmtTemp)) {
      fmtTemp = fmtTemp.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
    }
  });
  return fmtTemp;
};

// dateTime full string fromat
export const dateToString = (date, formatRule, timeZoneOffset) => {
  let tempDate = date;
  let dateStr = '';
  if (!is(date, 'date')) {
    tempDate = new Date(date);
  }

  if (is(tempDate, 'date') && tempDate.getTime()) {
    if (is(timeZoneOffset, 'number')) {
      tempDate = new Date(tempDate.getTime() - (timeZoneOffset * 60 * 1000));
    }
    dateStr = DateFormat(tempDate, formatRule);
  }

  return dateStr;
};
