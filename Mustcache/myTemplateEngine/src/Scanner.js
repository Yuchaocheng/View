/* 
扫描器类
*/
export default class Scanner {
    constructor(templateStr) {
        this.templateStr = templateStr;
        // 尾巴字符串
        this.tail = templateStr
        this.length = 0
    }
    // 功能弱，就是走过指定内容，没有返回值，把 {{ 或 }} 符号删除，这样在下一次计算位置时，就不会一直是第一个{{}}了
    scan(tag) {
        if (this.eos()) {
            return
        }
        this.length += tag.length;
        this.tail = this.templateStr.slice(this.length)
    }
    // 让指针进行扫描，直到遇见指定内容结束，并且能够返回结束之前路过的内容
    scanUntil(endTags) {
        if (this.eos()) {
            return ""
        }
        const { templateStr } = this
        const start = this.length;

        // 本次的标志字符串，是{{ 还是}}
        let tag = ""
        // 将tags的数组转化为字符串，用在正则中
        const tagStr = endTags.join("|")
        /* 
        点（.）是一个特殊字符，代表任意的单个字符，但是有两个例外。一个是四个字节的 UTF-16 字符，这个可以用u修饰符解决；另一个是行终止符（line terminator character）
        s修饰符就是用来解决这个问题
        */
        const regex = new RegExp(`(.*?)(${tagStr})`,"s") //ES6新增的s修饰符，代表dotAll
        const match = this.tail.match(regex)
        if (match) {
            this.length += match[1].length
            tag = match[2]
        } else {
            this.length += this.tail.length;
        }
        const result = templateStr.slice(start, this.length);
        this.tail = templateStr.slice(this.length);
        // scan直接写在scanUntil里吧，因为一旦匹配到，两者应该都要执行
        this.scan(tag)
        return result
    }

    // 是否走到了字符串结束 end of string
    eos() {
        return this.length >= this.templateStr.length
    }
}

/*
 截取字符串的3种方法温习下
 slice         位置-位置 [0,1)
 substring     位置-位置 [0,1)
 substr        位置-长度

 三者都不会改变原字符串

 slice和substring方法很像，他们的区别主要在一些特殊情况。
 1. 参数是负数，slice  从结尾开始计算；substring置为0
 2. 第一个参数小于第二个， slice返回空，subString会调换位置返回

 基于这些特殊情况上的差别，推荐优先使用slice，更符合人们的惯性思维

 substr 第一个参数小于0，从尾部开始计算位置，第二个参数小于0，则被置为0。截取长度为0，返回原字符串。

*/