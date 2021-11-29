// 2[1[a]2[b]3[c]]  =>   abbcccabbccc

/*
template:
[
    {
        loop: 2,
        children: [
            {
                loop: 1,
                char: 'a'
            },
            {
                loop: 2,
                char: 'b'
            },
            {
                loop: 3,
                char: 'c'
            },
        ]
    }
]

*/

function compile(template) {
    let result = '';
    if (!Array.isArray(template)) {
        return result
    }
    result = template.reduce((pre, cur) => {
        if (cur.char) {
            return pre + cur.char.repeat(cur.loop)
        } else if (cur.children) {
            return pre + compile(cur.children).repeat(cur.loop)
        } else {
            return pre
        }
    }, '')
    return result
}
console.log(compile([
    {
        loop: 2,
        children: [
            {
                loop: 1,
                char: 'a'
            },
            {
                loop: 2,
                char: 'b'
            },
            {
                loop: 3,
                char: 'c'
            },
        ]
    }
]
));

// 2[1[a]2[b]3[c]]  =>   abbcccabbccc
function createTempalte(str) {
    const template = [];
    const stack = [];
    let currentObj = {}
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (char === '[') {
            stack.push({
                index: i,
                loop: +str[i - 1]
            })
        } else if (char === ']') {
            const oPop = stack.pop()
            if (!stack.length) {
                currentObj = {};
                currentObj.loop = oPop.loop;
                const content = str.slice(oPop.index + 1, i);
                if (/[\[\]]/.test(content)) {
                    currentObj.children = createTempalte(content);
                } else {
                    currentObj.char = content
                }
                template.push(currentObj)
            }
        }
    }
    return template
};

function smartRepeat(str) {
    const template = createTempalte(str);
    return compile(template)
}
console.log(smartRepeat('1[abc]2[de]3[1[f]2[g]4[1[h]3[i]]]'));
console.log(smartRepeat('3[2[a]2[b]]'));
console.log(1111111);

// 使用栈优雅解决
function smartRepeat2(str) {
    let result = '';
    const loopStack = [];
    const contentStack = []
    /* 使用while循环也可以，for循环每次增加的步长固定为1，while相对更灵活 */
    for (let i = 0; i < str.length; i++) {
        let char = str[i];
        if (/\d/.test(char)) {
            // 数字代表循环次数，也是loop的开始，入栈
            // 这里有一种特殊情况，就是次数是两位数甚至更高位数时。一开始未考虑
            if (/\d/.test(str[i - 1])) {
                // 如果它的上一位也是数字，则字符串叠加
                loopStack.push(char)
                loopStack[loopStack - 1] += char
            } else {
                loopStack.push(char)
            }
        } else if (char === '[') {
            // [代表一个loop的开始，入栈
            contentStack.push('')
        } else if (char === ']') {
            // debugger
            // ]代表一个loop的结束，出栈
            const iLoop = +loopStack.pop();
            const szContent = contentStack.pop();
            /********  关键步骤，外层的内容是依赖内层生成内容的 ************/
            if (contentStack.length) {
                // contentStack还有内容，证明当前是子内容，需要叠加为父字符串的值，主要不能直接赋值，因为父亲可能有多个字串
                contentStack[contentStack.length - 1] += szContent.repeat(iLoop)
            } else {
                // contentStack没有内容，说明是最外层的，则赋值给最后结果
                result += szContent.repeat(iLoop)
            }
        } else {
            // 其他字符串代表loop的内容，存到栈里
            contentStack[contentStack.length - 1] += char
        }
    }
    return result
}

console.log(smartRepeat2('1[abc]2[de]3[1[f]2[g]4[1[h]3[i]]]'));
console.log(smartRepeat2('3[2[a]2[b]]'));
console.log(22222222);

// 工作中常用的正则方法
/*
1. replace
2. match > search
3. test
*/

/* 使用while循环实现，个人代码习惯较少使用while(主要原因是容易写成死循环)，这个在以后可以多尝试 */
function smartRepeat3(str) {
    let result = '';
    const loopStack = []; // 循环次数栈
    const contentStack = []; // 循环内容栈 
    let index = 0;
    let reset = str; // 字符串剩余内容
    while (index < str.length) {
        reset = str.slice(index)
        // 以 数字[ 开头
        if ((/^(\d+)\[/).test(reset)) {
            // 入栈
            contentStack.push('');
            loopStack.push(RegExp.$1);
            /* 这边+1是因为除了数字，把[这一位也直接跳过去 */
            index += RegExp.$1.length + 1;
        } else if ((/^([^\[\]]+)\]/).test(reset)) {
            // 以 内容] 开头
            contentStack[contentStack.length - 1] = RegExp.$1;
            index += RegExp.$1.length
        } else if (reset.startsWith(']')) {
            // 出栈
            const iLoop = loopStack.pop();
            const content = contentStack.pop();
            if (contentStack.length) {
                contentStack[contentStack.length - 1] += content.repeat(iLoop)
            } else {
                result += content.repeat(iLoop)
            }
            index++
        } else {
            // 进入该判断说明格式错误]个数小于[
            throw new Error('参数格式错误')
        }
    }
    return result
}
console.log(smartRepeat3('1[abc]2[de]3[1[f]2[g]4[1[h]3[i]]]'));
console.log(smartRepeat3('3[2[a]2[b]]'));
console.log(3333333333);