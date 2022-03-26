<template>
  <div>

  <router-view></router-view>
  </div>
</template>

<script>
import AST from './AST';
export default {
  created() {
    // console.log(AST.transArr([1, 2, [3, [4, 5], 6], 7, [8], 9]));
    console.log(AST.transArr2([1, 2, [3, [4, 5], 6], 7, [8], 9]));
    this.testFindSeries();
    this.testFib();

    AST.testParse()
  },
  methods: {
    // 斐波那契数列测试
    testFib() {
      // 输出斐波那契数列前十项
      // for (let i = 0; i < 10; i++) {
      //   console.log(AST.fib(i, 1, 1));
      // }

      // 启用缓存的斐波那契方法
      const fib2 = AST.fib2(1, 1);
      for (let i = 0; i < 10; i++) {
        console.log(fib2(i));
      }
    },
    // 指针思想测试
    testFindSeries() {
      /* 对比后发现，方法2确实比方法1效率更高 */
      const testStr = 'aabbabaabbbaaabababaabbbbccccccccdd';
      const result = AST.findSeriesRepChar(testStr);
      const result2 = AST.findSeriesRepChar2(testStr);
      console.log(result, 'result');
      console.log(result2, 'result');
      const test1 = this.fnRunTime(AST.findSeriesRepChar, 10000);
      const test2 = this.fnRunTime(AST.findSeriesRepChar2, 10000);
      const time1 = test1.call(AST, testStr);
      const time2 = test2.call(AST, testStr);
    },
    // 对比一下两种方法的效率
    fnRunTime(fn, loop = 1) {
      return function() {
        const now = new Date();
        for (let i = 0; i < loop; i++) {
          fn.call(this, arguments);
        }
        // debugger;
        const after = new Date();
        console.log(after - now);
        return Date.now() - now;
      };
    }
  }
};
</script>

<style lang="less" scoped></style>
