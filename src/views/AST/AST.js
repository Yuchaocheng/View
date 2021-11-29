import './stackPractice';
import parse from './parse'; //parse函数，解析模板字符串核心函数

class AST {
  constructor() {}
  // 算法储备 - 指针思想，所谓指针就是下标位置，即index。也称为标记法。
  // 寻找连续重复次数最多的字符
  // 个人实现
  findSeriesRepChar(str) {
    if (!str.length) {
      return '';
    }
    let [maxNum, nowNum, maxChar] = [0, 0, str[0]];
    for (let index = 0; index < str.length - 1; index++) {
      //   debugger;
      if (str[index] === str[index + 1]) {
        nowNum++;
      } else {
        nowNum = 0;
      }
      if (nowNum > maxNum) {
        maxChar = str[index];
        maxNum = nowNum;
      }
    }
    return maxChar;
  }
  // 算法实现
  findSeriesRepChar2(str) {
    if (typeof str !== 'string' || !str.length) {
      return '';
    }
    let [preI, curI, maxRepNum, maxRepChar] = [0, 0, 0, str[0]];
    // preI走完，循环结束
    while (preI < str.length - 1) {
      if (str[preI] !== str[curI]) {
        if (curI - preI > maxRepNum) {
          maxRepNum = curI - preI;
          maxRepChar = str[preI];
        }
        // curI 最终会超过字符串长度，超过后undefined 不等于 str[preI]，得到最后一段重复长度
        preI = curI;
      }
      curI++;
    }
    return maxRepChar;
  }

  // 算法储备-递归深入
  // 斐波那契数列，后一项等于前两项的加和，该函数实现输入下标index，输出该下标的值，前两项的值要给出
  // 这样的实现进行了 很多重复计算
  fib(n, v0 = 0, v1 = 1) {
    if (n < 0) {
      return NaN;
    }
    if (n === 0) {
      return v0;
    }
    if (n == 1) {
      return v1;
    }
    return this.fib(n - 1, v0, v1) + this.fib(n - 2, v0, v1);
  }
  // 利用对象缓存数据，缓存思想，缓存n代码会简洁一点，但是重复计算会更多一些。
  fib2(v0 = 0, v1 = 1) {
    const cache = {};
    return function fib(n) {
      if (n < 0) {
        return NaN;
      }
      if (n === 0) {
        cache[0] = v0;
        return v0;
      }
      if (n == 1) {
        cache[1] = v1;
        return v1;
      }
      let [vPre1, vPre2] = [];
      if (n - 1 in cache) {
        vPre1 = cache[n - 1];
      } else {
        vPre1 = fib(n - 1);
      }
      if (n - 2 in cache) {
        vPre2 = cache[n - 2];
      } else {
        vPre2 = fib(n - 2);
      }
      return vPre1 + vPre2;
    };
  }

  // 递归思想2
  // 试将高维数组[1,2,[3,[4,5],6],7,[8],9]  => 变为树形的对象数组形式

  transArr(arr) {
    if (!Array.isArray(arr)) {
      return null;
    }
    if (!arr.length) {
      return {};
    }
    const reuslt = { children: [] };
    const lenth = arr.length;
    for (let i = 0; i < lenth; i++) {
      const value = arr[i];
      if (Array.isArray(value)) {
        reuslt.children.push(this.transArr(value));
      } else if (typeof value === 'number') {
        reuslt.children.push({ value });
      }
    }
    return reuslt;
  }
  // 虽然写法1的递归次数要大大小于写法2，因为写法2中，遇见数字和数组都会递归
  transArr2(value) {
    if (typeof value === 'number') {
      return { value };
    } else if (Array.isArray(value)) {
      return {
        children: value.map(subItem => this.transArr2(subItem))
      };
    }
  }

  // 栈算法
  // 只能重复，将  2[1[a]2[1[b]3[c]]] =>
}

export default new AST();
