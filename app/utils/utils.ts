import debounce from 'lodash/debounce';
import { message } from 'antd';
import moment from 'moment';
import { cloneDeep, isEmpty } from 'lodash';

declare global {
  interface Window {
    g_app: any;
  }
}

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = (path: string): boolean => reg.test(path);

const showSuccessMessageDebounce = (
  messageStr: string,
  showSuccessMessageGapTime?: any,
  callback?: any,
) => {
  showSuccessMessageGapTime = showSuccessMessageGapTime || 1 * 1000;
  return debounce(() => {
    if (callback) callback();
    message.success(messageStr);
  }, showSuccessMessageGapTime)();
};

const delay = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

export function getDayOfWeekByNumber(num: number): string {
  let weekText = '';
  switch (num) {
    case 0:
      weekText = '星期天';
      break;
    case 1:
      weekText = '星期一';
      break;
    case 2:
      weekText = '星期二';
      break;
    case 3:
      weekText = '星期三';
      break;
    case 4:
      weekText = '星期四';
      break;
    case 5:
      weekText = '星期五';
      break;
    case 6:
      weekText = '星期六';
      break;
    default:
      break;
  }
  return weekText;
}

/**
 * 转换为2维数组
 * @param data
 * @param column
 */
export function convertArrayByColumn<T>(data: T[], column: number): T[][] {
  const len: number = data.length;
  const lineNum = len % column === 0 ? len / column : Math.floor(len / column + 1);
  const res: T[][] = [];
  for (let i = 0; i < lineNum; i++) {
    const temp: T[] = data.slice(i * column, i * column + column);
    res.push(temp);
  }
  return res;
}

/**
 * 截取数字，3位
 * @param x
 * @param separator
 */
export function numberWithSeparator(x: number, separator: string = ','): string {
  if (x === 0) {
    return '0';
  }
  if (!x) {
    return '';
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

export function globalDispatch(func: any): any {
  // eslint-disable-next-line no-underscore-dangle
  return window.g_app._store.dispatch(func);
}

/**
 *
 *
 * @export
 * @param {*} [data={}] 简直组合
 * @param {*} [mapper={}] 映射表
 * @param {*} [force=false] 强制映射
 * @returns
 */
export function changeDataKey(data = {}, mapper = {}, force = false) {
  const obj = {};

  Object.keys(mapper).forEach(k => {
    Object.keys(data).forEach(i => {
      if (i === k) {
        obj[mapper[k]] = data[i];
      }
    });
  });
  return obj;
}

/**
 * 重组数组
 *
 * @param {*} data
 * @param {*} flag 是否使用原来格式; true为是，false为转换时间
 */
export function flatData(data: any, flag?: boolean, format: string = 'MM-DD HH:mm') {
  const obj = {};
  const yDataKeys: any[] = [];

  Object.keys(data).forEach(item => {
    const arr = data[item];
    yDataKeys.push(item);

    if (arr) {
      arr.forEach((arrItem: number[]) => {
        const x = flag ? arrItem[0] : moment(arrItem[0] * 1000).format(format);
        if (!obj[x]) {
          obj[x] = {
            x,
            [item]: arrItem[1],
          };
        } else {
          obj[x] = {
            ...obj[x],
            [item]: arrItem[1],
          };
        }
      });
    }
  });

  const result = Object.keys(obj).map(i => obj[i]);
  return { data: result, yDataKeys };
}

/**
 * 根据开始和结束时间获取相应统计间隔
 * @param params
 */
export function getIntervalByTime(params: { end: number; begin: number }): number {
  let interval = 0;
  const range = params.end - params.begin;
  if (range <= 4 * 3600) {
    interval = 60;
  } else {
    // 24 * 60 / 5  每分钟最大288 -> 每秒钟 1 / 48
    interval = Math.ceil(range / (24 * 3600)) * 5 * 60;
  }

  interval /= 60;
  return interval;
}

/**
 * 下载流文件
 * @param {Blob} result
 * @param {String} fileName
 * @param {String} type
 */
export function downloadBlobFile(result, fileName, type = 'xlsx') {
  const blob = new Blob([result]);
  const downloadElement = document.createElement('a');
  const href = window.URL.createObjectURL(blob); // 创建下载的链接
  downloadElement.href = href;
  downloadElement.download = `${fileName}.${type}`; // 下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); // 点击下载
  document.body.removeChild(downloadElement); // 下载完成移除元素
  window.URL.revokeObjectURL(href); // 释放掉blob对象
}

/**
 * 转换时间戳为固定格式
 * @param s 总秒数
 */
export function secondsFormat(s) {
  const day = Math.floor(s / (24 * 3600)); // Math.floor()向下取整
  const hour = Math.floor((s - day * 24 * 3600) / 3600);
  const minute = Math.floor((s - day * 24 * 3600 - hour * 3600) / 60);
  const second = s - day * 24 * 3600 - hour * 3600 - minute * 60;
  return `${day}天${hour}小时${minute}分${second}秒`;
}

export function formatTimeToString(time: number, str = 'YYYY-MM-DD HH:mm:ss') {
  return time ? moment(time * 1000).format(str) : '-';
}

/**
 * 中英文字符长度，中文算两个长度
 * @param {*} str
 */
export function strlen(str) {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    // 单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
      len += 1;
    } else {
      len += 2;
    }
  }
  return len;
}

export function formatValueWithoutDecimal(val: any) {
  if (/[^0-9]+/.test(val)) {
    val = val.replace(/[^0-9]*/g, '');
  }
  return val;
}

export function toNonExponential(num) {
  const m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/);
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]));
}

/** 存储周期 */
export function formatVideoStorage(cycle: number) {
  let result = '无';
  if (cycle === 0) {
    result = '无';
  } else if (cycle > 0 && cycle < 99999) {
    result = `${cycle}天存储`;
  } else if (cycle === 99999) {
    result = '永久存储';
  }
  return result;
}

/**
 * 时间戳转换
 * @param param0
 */
export function caculateTimestampWithTime(day: number = 0, hour: number = 0, minute: number = 0) {
  let val = 0;
  val += day * 24 * 60 * 60;
  val += hour * 60 * 60;
  val += minute * 60;

  return val;
}

/**
 *
 * @param compareValue
 * @param keys
 */
export function compareValueWithKeys(compareValue: any, keys: string[]): any {
  const newCompareValue: any = cloneDeep(compareValue);
  const newValues = {};
  keys.forEach(i => {
    newValues[i] = newCompareValue[i];
    if (!newCompareValue[i]) {
      newValues[i] = null;
    }
  });
  return newValues;
}

/**
 * 格式化相应数据
 *
 * @param {*} response
 * @returns
 */
export function formatResponseData(response: any) {
  if (response.status === 200 && response.data.data) {
    return response.data.data;
  }
  return null;
}

/**
 * 判断接口是否成功，并返回相关数据
 * @param response
 * @param returnDataKey
 */
export function isRequestSuccess(response: any, returnDataKey?: string) {
  if (response && response.status === 200 && response.data.data) {
    if (returnDataKey && response.data.data[returnDataKey]) {
      return response.data.data[returnDataKey];
    }
    return response.data;
  }
  return false;
}

/**
 * 序列化url
 * @param obj
 */
export function serializeObjToUrl(obj: any = {}) {
  let str = '';
  // for (let key in obj) {
  //   if (str != '') {
  //     str += '&';
  //   }
  //   str += key + '=' + encodeURIComponent(obj[key]);
  // }

  if (isEmpty(obj)) {
    return str;
  }

  Object.keys(obj).forEach(i => {
    if (str !== '') {
      str += '&';
    }
    str += `${i}=${encodeURIComponent(obj[i])}`;
  });
  return str;
}

export { isUrl, showSuccessMessageDebounce, delay };
