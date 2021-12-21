import vnode from '../vnode';
import createEle from './createEle';

// 是否为同一个虚拟节点
const isSameVnode = (oldVnode, newVnode) => {
  const keyIsSame = oldVnode.key === newVnode.key;
  const selIsSame = oldVnode.sel === newVnode.sel;
  return keyIsSame && selIsSame;
};

// 子节点更新策略
const updateChildren = (parentNode, oldCh, newCh) => {
  console.log(oldCh);
  console.log(newCh);
  console.log('chchchchchchch');
  let testI = 0; // 开发时防止死循环，开发完后删除。
  let oldStartIdx = 0; // 旧前指针
  let newStartIdx = 0; // 新前指针
  let oldEndIdx = oldCh.length - 1; //旧后指针
  let newEndIdx = newCh.length - 1; //新后指针
  let oldStartVnode = oldCh[oldStartIdx]; //旧前虚拟DOM
  let oldEndVnode = oldCh[oldEndIdx]; //旧后虚拟DOM
  let newStartVnode = newCh[newStartIdx]; //新前虚拟ODM
  let newEndVnode = newCh[newEndIdx]; //新后虚拟DOM
  let keyMap = null; // 旧虚拟DOM缓存对象
  /* 该判断条件就说明，要么新虚拟节点已经遍历完了，不管是否匹配上；要么旧虚拟节点已经被匹配完了。这两种情况任意发生一种，循环终止 */
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx && testI < 1000) {
    /* 这两种情况说明oldStartVnode或者oldEndVnode已经被处理了 */
    if (oldStartVnode == null) {
      oldStartVnode = oldCh[++oldStartIdx];
      continue;
    } else if (oldEndVnode == null) {
      oldEndVnode = oldCh[--oldEndIdx];
      continue;
    }
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      /* 
      新前与旧前匹配，实际应用中，若v-for循环的数组长度未变化，只变化各项内容时。只用到该种判断即可完成。
      若是按顺序在在数组末尾添加项，除添加项外的其他项也只用该种匹配，添加项4种匹配都匹配不上，因为旧虚拟节点中没有。
      所以新前与旧前，就占了开发中最有可能出现的两种情况。
      */
      console.log('1命中');
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      console.log('2命中');
      /* 新后与旧后，该种匹配针对非行尾插入项。根据插入位置，插入位置之前的项通过新前与旧前匹配，插入位置之后的项就通过新后与旧后匹配 */
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) {
      console.log('3命中');
      // 新后与旧前
      patchVnode(oldStartVnode, newEndVnode);
      /* insertBefore插入一个已经在DOM树上的DOM节点，该DOM节点就会移动，这一点很关键。 */
      // 新前指向的节点，移动到旧后之后。因为现在是新后命中，所以最终的排序，插入节点一定是在已经匹配过的元素的最后。所以是旧后之后
      parentNode.insertBefore(newEndVnode.elm, oldEndVnode.elm.nextSibling);
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {
      console.log('4命中');
      // 新前与旧后
      patchVnode(oldEndVnode, newStartVnode);
      // 新后指向的节点，移动到旧前之前,因为当前匹配到的是新前，所以最终顺序，插入节点一定是在已经匹配过的元素的前面。所以是旧前之前。
      parentNode.insertBefore(newStartVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      // 四种情况都未匹配上时循环遍历旧虚拟DOM去匹配。
      /* 源码中这段的处理，重点就是提升了匹配效率。如果用传统的数组循环寻找，那么每次都要遍历新旧虚拟节点
         而使用了keyMap后，只需要第一次未匹配上时遍历还没有进行匹配的旧虚拟节点项。后续匹配相当于读取缓存了，非常高效。
      */
      if (!keyMap) {
        keyMap = {};
        // 寻找key的map,去旧虚拟节点中寻找key
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
          const key = oldCh[i].key;
          if (key != null) {
            keyMap[key] = i;
          }
        }
      }
      // 寻找当前这项(newStartIndex)，这项在keyMap中的映射的位置序号。
      const idxInOld = keyMap[newStartVnode.key];
      if (idxInOld == undefined) {
        // 判断，如果idxInOld是undefined表示它是全新的项，需要新增
        parentNode.insertBefore(createEle(newStartVnode), oldStartVnode.elm);
      } else {
        // 如果不是undefined，不是全新的项，旧虚拟节点中存在，但是四种匹配未匹配上

        // 这里其实还有一种情况，就是虽然key相同，但是sel不同，这种情况这个弱化版先不考虑了。
        const elmToMove = oldCh[idxInOld];
        patchVnode(elmToMove, newStartVnode);
        // 移动节点位置，移动到未开始匹配的旧虚拟节点前面，这样才和新虚拟节点的顺序一致。

        // 将处理过的项设置为undefined，下次循环时跳过
        oldCh[idxInOld] = undefined;
        parentNode.insertBefore(elmToMove.elm, oldStartVnode.elm);
      }
      newStartVnode = newCh[++newStartIdx];
    }

    testI++;
  }
  // 验证程序是否有问题，是因为testI跳出的循环就是存在问题的
  console.log(testI, 'testI');
  /* 循环结束了 */
  if (newStartIdx <= newEndIdx) {
    // 新虚拟dom有节点未被匹配，这些未被匹配的节点需要新增
    /* 这里有一个疑问，新虚拟节点有可能没有elm属性？未上过树咋办？
       解答上面的问题：因为newEndIdx只要不是最后一个，即从末尾元素有被匹配到过，匹配到过就会进行patchVnode函数，就会带上elm节点
       了。而如果是最后一个，从未被匹配到，before就是null，直接在最末尾新增
     */
    const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
    for (let index = newStartIdx; index <= newEndIdx; index++) {
      /* 以newEndIdx为标杆，在它之前插入，insertBefore如果第二个参数是null，就认为在父节点最后插入dom，
      效果等同于appendChild */
      parentNode.insertBefore(createEle(newCh[index]), before);
    }
  } else if (oldStartIdx <= oldEndIdx) {
    // 旧虚拟dom有节点未被匹配，这些未被匹配的节点需要删除
    for (let index = oldStartIdx; index <= oldEndIdx; index++) {
      parentNode.removeChild(oldCh[index].elm);
    }
  }
};
// 当新老虚拟节点是同一个时，进行精细化比较，因为需要递归，所以把函数单独提起出来。
// patchNode后，虚拟节点elm就不能是null了
const patchVnode = (oldVnode, newVnode) => {
  // 是同一个节点，进行精细化比较
  if (newVnode.text || newVnode.text === '') {
    if (newVnode.text === oldVnode.text) {
      // 新旧节点子节点都是文本节点，且text相同时，不需要做处理
      newVnode.elm = oldVnode.elm;
      return;
    } else {
      oldVnode.elm.innerText = newVnode.text;
      newVnode.elm = oldVnode.elm;
    }
  } else if (newVnode.children) {
    if (oldVnode.text) {
      // 1. 清空旧dom
      oldVnode.elm.innerHTML = '';
      // 2. 添加新虚拟节点的children属性
      newVnode.children.forEach(child => {
        oldVnode.elm.appendChild(createEle(child));
      });
      newVnode.elm = oldVnode.elm;
    } else if (oldVnode.children) {
      // 最复杂的情况，新老虚拟节点都有children，就需要对比每一个子节点
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
      // 个人思路编写updateChildren
      // updateChildren_self(oldVnode.elm, oldVnode.children, newVnode.children);
      newVnode.elm = oldVnode.elm;
    }
  }
  /* 对属性的更新，这里做简化处理，只对props属性进行更新，让例子双向绑定生效，并且没有比较新老属性是否相同 */
  if (newVnode.data) {
    const { props } = newVnode.data;
    if (props) {
      Object.keys(props).forEach(propName => (newVnode.elm[propName] = props[propName]));
    }
  }
};
export default (oldVnode, newVnode) => {
  /* 源码中就是这么判断的，实际上随意了一点，有可能在dom对象是新增了一个sel属性 */
  if (oldVnode.sel === undefined) {
    oldVnode = vnode(oldVnode.tagName, {}, [], '', oldVnode);
  }

  // 是否为同一个虚拟节点
  const keyIsSame = oldVnode.key === newVnode.key;
  const selIsSame = oldVnode.sel === newVnode.sel;
  if (keyIsSame && selIsSame) {
    patchVnode(oldVnode, newVnode);
  } else {
    // 不是同一个节点，插入新dom，删除旧dom
    const newDom = createEle(newVnode);
    if (!oldVnode.elm) {
      // 老节点要么是真实dom，要么是虚拟dom但是具有elm属性
      return;
    }
    oldVnode.elm.parentNode.insertBefore(newDom, oldVnode.elm);
    oldVnode.elm.parentNode.removeChild(oldVnode.elm);
  }
  return newVnode;
};

/* 
个人思路实现子节点对比更新，函数接收3个参数，旧虚拟节点的DOM节点，新旧虚拟节点的子节点数组
*/
const updateChildren_self = (parentNode, oldCh, newCh) => {
  // 遍历新节点，去老节点中进行匹配
  newCh.forEach(newChild => {
    const matchOldChild = oldCh.find(oldChild => isSameVnode(oldChild, newChild));
    if (matchOldChild) {
      // 字节点中增加一个属性，标志该节点成功匹配上了
      matchOldChild.isMatched = true;
      newChild.isMatched = true;
      // 更新子节点
      patchVnode(matchOldChild, newChild);
    }
  });
  // 遍历结束后，统计未被匹配的新虚拟子节点和旧虚拟子节点
  const noMatchNewCh = newCh.filter(newChild => !newChild.isMatched);
  const noMatchOldCh = oldCh.filter(oldChild => !oldChild.isMatched);

  // 未被匹配的新虚子节点需要插入
  if (noMatchNewCh.length) {
    noMatchNewCh.forEach(noMatchNew => {
      parentNode.appendChild(createEle(noMatchNew));
    });
  }
  // 未被匹配的旧虚拟自己点需要删除
  if (noMatchOldCh.length) {
    noMatchOldCh.forEach(noMatchOld => {
      parentNode.removeChild(noMatchOld.elm);
    });
  }
};
