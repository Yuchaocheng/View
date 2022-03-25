var daySecond = 86400;

// 阻止事件冒泡
const stopPropagation = (e) => {
  e = e || window.event;
  if (e.stopPropagation) { //W3C阻止冒泡方法
    e.stopPropagation();
  } else {
    e.cancelBubble = true; //IE阻止冒泡方法
  }
};

/**
 * px 转时间（s）
 * @param {*} value 当前left值(px)
 * @param {*} totalPixel scale总长度(px)
 * @returns 当前时间(s)
 */
const pixelToSecond = (value, totalPixel) => {
  return value * daySecond / totalPixel;
};

/**
 * 时间转 px
 * @param {*} value
 * @param {*} totalPixel
 * @returns
 */
const secondToPixel = (value, totalPixel) => {
  return value * totalPixel / daySecond;
};

/**
 * 根据classname判断当前鼠标所在元素是否进入目标元素
 * @param {string} current 当前鼠标所在元素的 classname
 * @param {string | arr[string]} target 目标classname
 * @returns {boolean}
 */
const isEnterDomByClass = (current, target) => {
  if (typeof target === 'string') {
    return current.indexOf(target) >= 0;
  }
  let l = target.length;
  while (l--) {
    if (current.indexOf(target[l]) >= 0) {
      return true;
    }
  }
  return false;
};

/**
 * 根据起点和已存在滑块获取滑块的取值范围
 * @param {number} _from 鼠标按下的起点对应的值
 * @param {arr[object]} rangeArr 已存在的range数组
 * @returns [最小取值， 最大取值]
 */
const getRangeValueRange = (_from, rangeArr) => {
  let minValue = 0;
  let maxValue = daySecond;
  rangeArr.forEach((item) => {
    let _min = Math.min(item.from, item.to);
    let _max = Math.max(item.from, item.to);
    if (_from > _max && _max > minValue) {
      minValue = _max;
    } else if (_from < _min && _min < maxValue) {
      maxValue = _min;
    }
  });

  return [minValue, maxValue];
};

const numToDouble = value => (value < 10 ? `0${ value}` : value);

/**
 * 时间格式化
 * @param {number} value 时间(s)
 * @returns 时间格式化字符串
 */
const timeFormat = (value) => {
  const hour = numToDouble(parseInt(value / 3600, 10));
  const min = numToDouble(parseInt((value % 3600) / 60, 10));
  return `${hour }:${ min }:00`;
};

/**
 * 秒数转为时间格式
 * @param {number} value 时间 (s)
 * @returns 日期格式时间字符串
 */
const secondToDate = (value) => {
  value = value === 86400 ? 86340 : value;
  const hour = numToDouble(parseInt(value / 3600, 10));
  const min = numToDouble(parseInt((value % 3600) / 60, 10));
  return new Date(2018, 1, 1, hour, min);
};

/**
 * 节流
 * @param {function} func 节流回调
 * @param {number} wait 节流时间
 * @returns void
 */
const throttle = function (func, wait = 50) {
  let lastTime = 0;
  return function (...args) {
    let now = new Date();
    if (now - lastTime > wait) {
      lastTime = now;
      func.apply(this, args);
    }
  };
};

/**
 * 根据计划类型获取时间列表数组
 * @param {string} type 计划类型名称 "day" || "week" || "holiday" || "year"
 * @param {string} timeStr 名称集合
 * @returns {Array} 时间列表
 */
const getDateListByPlanType = (type, timeStr) => {
  let _date = '';
  switch (type) {
    case "day":
      _date = timeStr ? timeStr : '';
      return [_date];
    case "week":
      return timeStr.slice(0, 8);
    case "holiday":
      return timeStr.slice(0, 9);
    case "year":
      return timeStr.slice(0, 13);
    case "custom":
      return timeStr;
    default:
      return [];
  }
};


/**
 * 获取该段计划最右块cell的index
 * @param {object} cell
 * @param {object} row
 * @returns 最右块cell的index
 */
const getTimeRange = (cell, row) => {
  let _plan = cell.currentPlan; // 当前 cell 的 plan
  let _row = row; // 当前 cell 所在行
  let _col = cell.colIndex; // 当前 cell 列 index
  let max = _col;
  // 只要考虑右边界
  for (max; max <= 47; ++max) {
    if (_row[max].currentPlan !== _plan) {
      break;
    }
  }
  // 返回右边界的endTime
  return max - 1;
};

/**
 * 判断当前块是否已经在 timeSpan数组中
 * @param {Array} timeSpan 存放当前行时间计划的数组
 * @param {Number} cellIndex 当前块的index
 * @returns {Boolean}
 */
const isCellInTimeSpan = (timeSpan, cellIndex) => {
  for (let i = 0; i < timeSpan.length; i++) {
    if (cellIndex >= timeSpan[i].BeginTime && cellIndex <= timeSpan[i].EndTime) {
      return true;
    }
  }
  return false;
};

/**
 * 整理输出格式
 * @param {Array} cols 组件内管理状态的数组
 * @returns {Array} 需要的输出格式
 */
const formatOutput = (cols) => {
  const res = cols.map((dayRow) => {
    let _res = {};
    _res["name"] = dayRow[0].rowName;
    _res["key"] = dayRow[0].key;
    // 存放各个计划段Index的数组
    let timeSpan = [];
    // 存放各个计划段时间的数组
    let _timeSpan = [];

    dayRow.forEach((cell, cellIndex, row) => {
      // cell 有状态且未在 timespan 中
      if (cell.status && !isCellInTimeSpan(timeSpan, cellIndex)) {
        let min = cell.colIndex;
        let max = getTimeRange(cell, row);
        timeSpan.push({
          "BeginTime": min,
          "EndTime": max
        });
        _timeSpan.push({
          "plan": cell.currentPlan,
          "RecordType": cell.currentPlanType,
          "BeginTime": timeFormat(row[min].beginTime),
          "EndTime": timeFormat(row[max].endTime)
        });
      }
    });
    _res["TimeSpan"] = _timeSpan;
    return _res;
  });
  return res;
};

// 通过 planType 获取 plan
const getPlanByPlanType = (type, btnLabels) => {
  for (let i = 0; i < btnLabels.length; i++) {
    if (btnLabels[i].type === type) {
      return btnLabels[i].name;
    }
  }
  return false;
};

// 将格式化后的时间(HH:mm:ss)转为秒数(s)
const timeToSecond = (timeStr) => {
  let _timeArr = timeStr.split(":");
  // 忽略秒
  return _timeArr[0] * 3600 + _timeArr[1] * 60;
};

/**
 * 获取参数类型
 * @param {*} val 待判断参数
 * @returns {string} 参数类型
 */
const getType = (val) => {
  const _type = Object.prototype.toString.call(val);
  switch (_type) {
    case "[object String]":
      return "string";
    case "[object Number]":
      return "number";
    case "[object Boolean]":
      return "boolean";
    case "[object Undefined]":
      return "undefined";
    case "[object Null]":
      return "null";
    case "[object Array]":
      return "array";
    case "[object Function]":
      return "function";
    case "[object Object]":
      return "object";
    case "[object RegExp]":
      return "regexp";
    case "[object Date]":
      return "date";
    default:
      return "undefined";
  }
};

/**
 * 修整传入数据格式
 * @param {array} arr 传入数据数组
 * @param {number} length 目标长度
 */
const editLength = (arr, length, btnLabel) => {
  // TODO: 从假日计划切换至长度较短的自定义计划时可能会出现空行,因为这里直接修改了arr的长度,需要返回一个新arr,不修改老arr
  // 数组长度过长，则直接截取
  if (arr.length >= length) {
    arr.length = length;
  }
  let i = arr.length;
  // 数组长度过短，则补充元素
  while (i < length) {
    arr.push({
      name: btnLabel[i],
      TimeSpan: []
    });
    i++;
  }
};

/**
 * 打印类型错误
 * @param {string} propName 变量名称
 * @param {string} expected 期望类型
 * @param {string} got 实际获得类型
 */
const logTypeError = (propName, expected, got) => {
  const _expected = expected.charAt(0).toUpperCase() + expected.slice(1);
  const _got = got.charAt(0).toUpperCase() + got.slice(1);
  console.error(
    `[ERROR-1] type check failed for prop "${propName}": expected ${_expected}, got ${_got}.`
  );
};

/**
 * 打印取值错误
 * @param {string} propName 变量名称
 * @param {array} expected 可选值集合
 * @param {*} got 实际得到值
 */
const logValueError = (propName, expected, got) => {
  console.error(
    `[ERROR-2] value check failed for prop "${propName}": expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}.`
  );
};

/**
 * 打印颜色格式错误
 * @param {string} propName 颜色集合变量名称
 * @param {array} index 出问题的index
 */
const logColorFormatError = (propName, index) => {
  console.error(
    `[ERROR-3] Color only supports hexadecimal and RGB formats，please check the index ${index} of the prop "${propName}"`
  );
};

/**
 * 打印集合中元素类型错误
 * @param {string} objName 集合名称
 * @param {string} expected 期望类型
 * @param {string} got 实际获得类型
 * @param {array} index 出问题的index
 */
const logTypeErrorInObject = (objName, expected, got, index) => {
  const _expected = expected.charAt(0).toUpperCase() + expected.slice(1);
  const _got = got.charAt(0).toUpperCase() + got.slice(1);
  console.error(
    `[ERROR-4] type check failed for the index ${index} of the prop "${objName}": expected ${_expected}, got ${_got}.`
  );
};

export {
  stopPropagation,
  pixelToSecond,
  secondToPixel,
  isEnterDomByClass,
  getRangeValueRange,
  timeFormat,
  secondToDate,
  throttle,
  getDateListByPlanType,
  formatOutput,
  timeToSecond,
  getType,
  logTypeError,
  logValueError,
  logColorFormatError,
  logTypeErrorInObject,
  editLength,
  getPlanByPlanType
};
