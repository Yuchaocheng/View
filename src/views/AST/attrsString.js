// const testStr = ' class="h 3" id="test_h3"';
export default function (str) {
  const result = [];
  let index = 0;
  let restStr = str;
  while (index < str.length) {
    // debugger;
    restStr = str.slice(index);
    if (/^(\s+(.+?)="(.+?)")/s.test(restStr)) {
      result.push({
        name: RegExp.$2,
        value: RegExp.$3
      });
      index += RegExp.$1.length;
    } else {
      index++;
    }
  }
  return result;
}
