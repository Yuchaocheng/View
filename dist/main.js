/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/snabbdom/build/h.js":
/*!******************************************!*\
  !*** ./node_modules/snabbdom/build/h.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"h\": () => (/* binding */ h)\n/* harmony export */ });\n/* harmony import */ var _vnode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./vnode */ \"./node_modules/snabbdom/build/vnode.js\");\n/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is */ \"./node_modules/snabbdom/build/is.js\");\n\n\n\nfunction addNS(data, children, sel) {\n  data.ns = \"http://www.w3.org/2000/svg\";\n\n  if (sel !== \"foreignObject\" && children !== undefined) {\n    for (let i = 0; i < children.length; ++i) {\n      const childData = children[i].data;\n\n      if (childData !== undefined) {\n        addNS(childData, children[i].children, children[i].sel);\n      }\n    }\n  }\n}\n\nfunction h(sel, b, c) {\n  let data = {};\n  let children;\n  let text;\n  let i;\n\n  if (c !== undefined) {\n    if (b !== null) {\n      data = b;\n    }\n\n    if (_is__WEBPACK_IMPORTED_MODULE_0__.array(c)) {\n      children = c;\n    } else if (_is__WEBPACK_IMPORTED_MODULE_0__.primitive(c)) {\n      text = c;\n    } else if (c && c.sel) {\n      children = [c];\n    }\n  } else if (b !== undefined && b !== null) {\n    if (_is__WEBPACK_IMPORTED_MODULE_0__.array(b)) {\n      children = b;\n    } else if (_is__WEBPACK_IMPORTED_MODULE_0__.primitive(b)) {\n      text = b;\n    } else if (b && b.sel) {\n      children = [b];\n    } else {\n      data = b;\n    }\n  }\n\n  if (children !== undefined) {\n    for (i = 0; i < children.length; ++i) {\n      if (_is__WEBPACK_IMPORTED_MODULE_0__.primitive(children[i])) children[i] = (0,_vnode__WEBPACK_IMPORTED_MODULE_1__.vnode)(undefined, undefined, undefined, children[i], undefined);\n    }\n  }\n\n  if (sel[0] === \"s\" && sel[1] === \"v\" && sel[2] === \"g\" && (sel.length === 3 || sel[3] === \".\" || sel[3] === \"#\")) {\n    addNS(data, children, sel);\n  }\n\n  return (0,_vnode__WEBPACK_IMPORTED_MODULE_1__.vnode)(sel, data, children, text, undefined);\n}\n\n//# sourceURL=webpack://vue-study/./node_modules/snabbdom/build/h.js?");

/***/ }),

/***/ "./node_modules/snabbdom/build/htmldomapi.js":
/*!***************************************************!*\
  !*** ./node_modules/snabbdom/build/htmldomapi.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"htmlDomApi\": () => (/* binding */ htmlDomApi)\n/* harmony export */ });\nfunction createElement(tagName, options) {\n  return document.createElement(tagName, options);\n}\n\nfunction createElementNS(namespaceURI, qualifiedName, options) {\n  return document.createElementNS(namespaceURI, qualifiedName, options);\n}\n\nfunction createTextNode(text) {\n  return document.createTextNode(text);\n}\n\nfunction createComment(text) {\n  return document.createComment(text);\n}\n\nfunction insertBefore(parentNode, newNode, referenceNode) {\n  parentNode.insertBefore(newNode, referenceNode);\n}\n\nfunction removeChild(node, child) {\n  node.removeChild(child);\n}\n\nfunction appendChild(node, child) {\n  node.appendChild(child);\n}\n\nfunction parentNode(node) {\n  return node.parentNode;\n}\n\nfunction nextSibling(node) {\n  return node.nextSibling;\n}\n\nfunction tagName(elm) {\n  return elm.tagName;\n}\n\nfunction setTextContent(node, text) {\n  node.textContent = text;\n}\n\nfunction getTextContent(node) {\n  return node.textContent;\n}\n\nfunction isElement(node) {\n  return node.nodeType === 1;\n}\n\nfunction isText(node) {\n  return node.nodeType === 3;\n}\n\nfunction isComment(node) {\n  return node.nodeType === 8;\n}\n\nconst htmlDomApi = {\n  createElement,\n  createElementNS,\n  createTextNode,\n  createComment,\n  insertBefore,\n  removeChild,\n  appendChild,\n  parentNode,\n  nextSibling,\n  tagName,\n  setTextContent,\n  getTextContent,\n  isElement,\n  isText,\n  isComment\n};\n\n//# sourceURL=webpack://vue-study/./node_modules/snabbdom/build/htmldomapi.js?");

/***/ }),

/***/ "./node_modules/snabbdom/build/init.js":
/*!*********************************************!*\
  !*** ./node_modules/snabbdom/build/init.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"init\": () => (/* binding */ init)\n/* harmony export */ });\n/* harmony import */ var _vnode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vnode */ \"./node_modules/snabbdom/build/vnode.js\");\n/* harmony import */ var _is__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./is */ \"./node_modules/snabbdom/build/is.js\");\n/* harmony import */ var _htmldomapi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./htmldomapi */ \"./node_modules/snabbdom/build/htmldomapi.js\");\n\n\n\n\nfunction isUndef(s) {\n  return s === undefined;\n}\n\nfunction isDef(s) {\n  return s !== undefined;\n}\n\nconst emptyNode = (0,_vnode__WEBPACK_IMPORTED_MODULE_0__.vnode)(\"\", {}, [], undefined, undefined);\n\nfunction sameVnode(vnode1, vnode2) {\n  var _a, _b;\n\n  const isSameKey = vnode1.key === vnode2.key;\n  const isSameIs = ((_a = vnode1.data) === null || _a === void 0 ? void 0 : _a.is) === ((_b = vnode2.data) === null || _b === void 0 ? void 0 : _b.is);\n  const isSameSel = vnode1.sel === vnode2.sel;\n  return isSameSel && isSameKey && isSameIs;\n}\n\nfunction isVnode(vnode) {\n  return vnode.sel !== undefined;\n}\n\nfunction createKeyToOldIdx(children, beginIdx, endIdx) {\n  var _a;\n\n  const map = {};\n\n  for (let i = beginIdx; i <= endIdx; ++i) {\n    const key = (_a = children[i]) === null || _a === void 0 ? void 0 : _a.key;\n\n    if (key !== undefined) {\n      map[key] = i;\n    }\n  }\n\n  return map;\n}\n\nconst hooks = [\"create\", \"update\", \"remove\", \"destroy\", \"pre\", \"post\"];\nfunction init(modules, domApi) {\n  let i;\n  let j;\n  const cbs = {\n    create: [],\n    update: [],\n    remove: [],\n    destroy: [],\n    pre: [],\n    post: []\n  };\n  const api = domApi !== undefined ? domApi : _htmldomapi__WEBPACK_IMPORTED_MODULE_1__.htmlDomApi;\n\n  for (i = 0; i < hooks.length; ++i) {\n    cbs[hooks[i]] = [];\n\n    for (j = 0; j < modules.length; ++j) {\n      const hook = modules[j][hooks[i]];\n\n      if (hook !== undefined) {\n        cbs[hooks[i]].push(hook);\n      }\n    }\n  }\n\n  function emptyNodeAt(elm) {\n    const id = elm.id ? \"#\" + elm.id : \"\"; // elm.className doesn't return a string when elm is an SVG element inside a shadowRoot.\n    // https://stackoverflow.com/questions/29454340/detecting-classname-of-svganimatedstring\n\n    const classes = elm.getAttribute(\"class\");\n    const c = classes ? \".\" + classes.split(\" \").join(\".\") : \"\";\n    return (0,_vnode__WEBPACK_IMPORTED_MODULE_0__.vnode)(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);\n  }\n\n  function createRmCb(childElm, listeners) {\n    return function rmCb() {\n      if (--listeners === 0) {\n        const parent = api.parentNode(childElm);\n        api.removeChild(parent, childElm);\n      }\n    };\n  }\n\n  function createElm(vnode, insertedVnodeQueue) {\n    var _a, _b;\n\n    let i;\n    let data = vnode.data;\n\n    if (data !== undefined) {\n      const init = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init;\n\n      if (isDef(init)) {\n        init(vnode);\n        data = vnode.data;\n      }\n    }\n\n    const children = vnode.children;\n    const sel = vnode.sel;\n\n    if (sel === \"!\") {\n      if (isUndef(vnode.text)) {\n        vnode.text = \"\";\n      }\n\n      vnode.elm = api.createComment(vnode.text);\n    } else if (sel !== undefined) {\n      // Parse selector\n      const hashIdx = sel.indexOf(\"#\");\n      const dotIdx = sel.indexOf(\".\", hashIdx);\n      const hash = hashIdx > 0 ? hashIdx : sel.length;\n      const dot = dotIdx > 0 ? dotIdx : sel.length;\n      const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;\n      const elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag, data) : api.createElement(tag, data);\n      if (hash < dot) elm.setAttribute(\"id\", sel.slice(hash + 1, dot));\n      if (dotIdx > 0) elm.setAttribute(\"class\", sel.slice(dot + 1).replace(/\\./g, \" \"));\n\n      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);\n\n      if (_is__WEBPACK_IMPORTED_MODULE_2__.array(children)) {\n        for (i = 0; i < children.length; ++i) {\n          const ch = children[i];\n\n          if (ch != null) {\n            api.appendChild(elm, createElm(ch, insertedVnodeQueue));\n          }\n        }\n      } else if (_is__WEBPACK_IMPORTED_MODULE_2__.primitive(vnode.text)) {\n        api.appendChild(elm, api.createTextNode(vnode.text));\n      }\n\n      const hook = vnode.data.hook;\n\n      if (isDef(hook)) {\n        (_b = hook.create) === null || _b === void 0 ? void 0 : _b.call(hook, emptyNode, vnode);\n\n        if (hook.insert) {\n          insertedVnodeQueue.push(vnode);\n        }\n      }\n    } else {\n      vnode.elm = api.createTextNode(vnode.text);\n    }\n\n    return vnode.elm;\n  }\n\n  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {\n    for (; startIdx <= endIdx; ++startIdx) {\n      const ch = vnodes[startIdx];\n\n      if (ch != null) {\n        api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);\n      }\n    }\n  }\n\n  function invokeDestroyHook(vnode) {\n    var _a, _b;\n\n    const data = vnode.data;\n\n    if (data !== undefined) {\n      (_b = (_a = data === null || data === void 0 ? void 0 : data.hook) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a, vnode);\n\n      for (let i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);\n\n      if (vnode.children !== undefined) {\n        for (let j = 0; j < vnode.children.length; ++j) {\n          const child = vnode.children[j];\n\n          if (child != null && typeof child !== \"string\") {\n            invokeDestroyHook(child);\n          }\n        }\n      }\n    }\n  }\n\n  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {\n    var _a, _b;\n\n    for (; startIdx <= endIdx; ++startIdx) {\n      let listeners;\n      let rm;\n      const ch = vnodes[startIdx];\n\n      if (ch != null) {\n        if (isDef(ch.sel)) {\n          invokeDestroyHook(ch);\n          listeners = cbs.remove.length + 1;\n          rm = createRmCb(ch.elm, listeners);\n\n          for (let i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);\n\n          const removeHook = (_b = (_a = ch === null || ch === void 0 ? void 0 : ch.data) === null || _a === void 0 ? void 0 : _a.hook) === null || _b === void 0 ? void 0 : _b.remove;\n\n          if (isDef(removeHook)) {\n            removeHook(ch, rm);\n          } else {\n            rm();\n          }\n        } else {\n          // Text node\n          api.removeChild(parentElm, ch.elm);\n        }\n      }\n    }\n  }\n\n  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {\n    let oldStartIdx = 0;\n    let newStartIdx = 0;\n    let oldEndIdx = oldCh.length - 1;\n    let oldStartVnode = oldCh[0];\n    let oldEndVnode = oldCh[oldEndIdx];\n    let newEndIdx = newCh.length - 1;\n    let newStartVnode = newCh[0];\n    let newEndVnode = newCh[newEndIdx];\n    let oldKeyToIdx;\n    let idxInOld;\n    let elmToMove;\n    let before;\n\n    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {\n      if (oldStartVnode == null) {\n        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left\n      } else if (oldEndVnode == null) {\n        oldEndVnode = oldCh[--oldEndIdx];\n      } else if (newStartVnode == null) {\n        newStartVnode = newCh[++newStartIdx];\n      } else if (newEndVnode == null) {\n        newEndVnode = newCh[--newEndIdx];\n      } else if (sameVnode(oldStartVnode, newStartVnode)) {\n        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);\n        oldStartVnode = oldCh[++oldStartIdx];\n        newStartVnode = newCh[++newStartIdx];\n      } else if (sameVnode(oldEndVnode, newEndVnode)) {\n        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);\n        oldEndVnode = oldCh[--oldEndIdx];\n        newEndVnode = newCh[--newEndIdx];\n      } else if (sameVnode(oldStartVnode, newEndVnode)) {\n        // Vnode moved right\n        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);\n        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));\n        oldStartVnode = oldCh[++oldStartIdx];\n        newEndVnode = newCh[--newEndIdx];\n      } else if (sameVnode(oldEndVnode, newStartVnode)) {\n        // Vnode moved left\n        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);\n        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);\n        oldEndVnode = oldCh[--oldEndIdx];\n        newStartVnode = newCh[++newStartIdx];\n      } else {\n        if (oldKeyToIdx === undefined) {\n          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);\n        }\n\n        idxInOld = oldKeyToIdx[newStartVnode.key];\n\n        if (isUndef(idxInOld)) {\n          // New element\n          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);\n        } else {\n          elmToMove = oldCh[idxInOld];\n\n          if (elmToMove.sel !== newStartVnode.sel) {\n            api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);\n          } else {\n            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);\n            oldCh[idxInOld] = undefined;\n            api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);\n          }\n        }\n\n        newStartVnode = newCh[++newStartIdx];\n      }\n    }\n\n    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {\n      if (oldStartIdx > oldEndIdx) {\n        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;\n        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);\n      } else {\n        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);\n      }\n    }\n  }\n\n  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {\n    var _a, _b, _c, _d, _e;\n\n    const hook = (_a = vnode.data) === null || _a === void 0 ? void 0 : _a.hook;\n    (_b = hook === null || hook === void 0 ? void 0 : hook.prepatch) === null || _b === void 0 ? void 0 : _b.call(hook, oldVnode, vnode);\n    const elm = vnode.elm = oldVnode.elm;\n    const oldCh = oldVnode.children;\n    const ch = vnode.children;\n    if (oldVnode === vnode) return;\n\n    if (vnode.data !== undefined) {\n      for (let i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);\n\n      (_d = (_c = vnode.data.hook) === null || _c === void 0 ? void 0 : _c.update) === null || _d === void 0 ? void 0 : _d.call(_c, oldVnode, vnode);\n    }\n\n    if (isUndef(vnode.text)) {\n      if (isDef(oldCh) && isDef(ch)) {\n        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);\n      } else if (isDef(ch)) {\n        if (isDef(oldVnode.text)) api.setTextContent(elm, \"\");\n        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);\n      } else if (isDef(oldCh)) {\n        removeVnodes(elm, oldCh, 0, oldCh.length - 1);\n      } else if (isDef(oldVnode.text)) {\n        api.setTextContent(elm, \"\");\n      }\n    } else if (oldVnode.text !== vnode.text) {\n      if (isDef(oldCh)) {\n        removeVnodes(elm, oldCh, 0, oldCh.length - 1);\n      }\n\n      api.setTextContent(elm, vnode.text);\n    }\n\n    (_e = hook === null || hook === void 0 ? void 0 : hook.postpatch) === null || _e === void 0 ? void 0 : _e.call(hook, oldVnode, vnode);\n  }\n\n  return function patch(oldVnode, vnode) {\n    let i, elm, parent;\n    const insertedVnodeQueue = [];\n\n    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();\n\n    if (!isVnode(oldVnode)) {\n      oldVnode = emptyNodeAt(oldVnode);\n    }\n\n    if (sameVnode(oldVnode, vnode)) {\n      patchVnode(oldVnode, vnode, insertedVnodeQueue);\n    } else {\n      elm = oldVnode.elm;\n      parent = api.parentNode(elm);\n      createElm(vnode, insertedVnodeQueue);\n\n      if (parent !== null) {\n        api.insertBefore(parent, vnode.elm, api.nextSibling(elm));\n        removeVnodes(parent, [oldVnode], 0, 0);\n      }\n    }\n\n    for (i = 0; i < insertedVnodeQueue.length; ++i) {\n      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);\n    }\n\n    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();\n\n    return vnode;\n  };\n}\n\n//# sourceURL=webpack://vue-study/./node_modules/snabbdom/build/init.js?");

/***/ }),

/***/ "./node_modules/snabbdom/build/is.js":
/*!*******************************************!*\
  !*** ./node_modules/snabbdom/build/is.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"array\": () => (/* binding */ array),\n/* harmony export */   \"primitive\": () => (/* binding */ primitive)\n/* harmony export */ });\nconst array = Array.isArray;\nfunction primitive(s) {\n  return typeof s === \"string\" || typeof s === \"number\";\n}\n\n//# sourceURL=webpack://vue-study/./node_modules/snabbdom/build/is.js?");

/***/ }),

/***/ "./node_modules/snabbdom/build/modules/class.js":
/*!******************************************************!*\
  !*** ./node_modules/snabbdom/build/modules/class.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"classModule\": () => (/* binding */ classModule)\n/* harmony export */ });\nfunction updateClass(oldVnode, vnode) {\n  let cur;\n  let name;\n  const elm = vnode.elm;\n  let oldClass = oldVnode.data.class;\n  let klass = vnode.data.class;\n  if (!oldClass && !klass) return;\n  if (oldClass === klass) return;\n  oldClass = oldClass || {};\n  klass = klass || {};\n\n  for (name in oldClass) {\n    if (oldClass[name] && !Object.prototype.hasOwnProperty.call(klass, name)) {\n      // was `true` and now not provided\n      elm.classList.remove(name);\n    }\n  }\n\n  for (name in klass) {\n    cur = klass[name];\n\n    if (cur !== oldClass[name]) {\n      elm.classList[cur ? \"add\" : \"remove\"](name);\n    }\n  }\n}\n\nconst classModule = {\n  create: updateClass,\n  update: updateClass\n};\n\n//# sourceURL=webpack://vue-study/./node_modules/snabbdom/build/modules/class.js?");

/***/ }),

/***/ "./node_modules/snabbdom/build/modules/eventlisteners.js":
/*!***************************************************************!*\
  !*** ./node_modules/snabbdom/build/modules/eventlisteners.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"eventListenersModule\": () => (/* binding */ eventListenersModule)\n/* harmony export */ });\nfunction invokeHandler(handler, vnode, event) {\n  if (typeof handler === \"function\") {\n    // call function handler\n    handler.call(vnode, event, vnode);\n  } else if (typeof handler === \"object\") {\n    // call multiple handlers\n    for (let i = 0; i < handler.length; i++) {\n      invokeHandler(handler[i], vnode, event);\n    }\n  }\n}\n\nfunction handleEvent(event, vnode) {\n  const name = event.type;\n  const on = vnode.data.on; // call event handler(s) if exists\n\n  if (on && on[name]) {\n    invokeHandler(on[name], vnode, event);\n  }\n}\n\nfunction createListener() {\n  return function handler(event) {\n    handleEvent(event, handler.vnode);\n  };\n}\n\nfunction updateEventListeners(oldVnode, vnode) {\n  const oldOn = oldVnode.data.on;\n  const oldListener = oldVnode.listener;\n  const oldElm = oldVnode.elm;\n  const on = vnode && vnode.data.on;\n  const elm = vnode && vnode.elm;\n  let name; // optimization for reused immutable handlers\n\n  if (oldOn === on) {\n    return;\n  } // remove existing listeners which no longer used\n\n\n  if (oldOn && oldListener) {\n    // if element changed or deleted we remove all existing listeners unconditionally\n    if (!on) {\n      for (name in oldOn) {\n        // remove listener if element was changed or existing listeners removed\n        oldElm.removeEventListener(name, oldListener, false);\n      }\n    } else {\n      for (name in oldOn) {\n        // remove listener if existing listener removed\n        if (!on[name]) {\n          oldElm.removeEventListener(name, oldListener, false);\n        }\n      }\n    }\n  } // add new listeners which has not already attached\n\n\n  if (on) {\n    // reuse existing listener or create new\n    const listener = vnode.listener = oldVnode.listener || createListener(); // update vnode for listener\n\n    listener.vnode = vnode; // if element changed or added we add all needed listeners unconditionally\n\n    if (!oldOn) {\n      for (name in on) {\n        // add listener if element was changed or new listeners added\n        elm.addEventListener(name, listener, false);\n      }\n    } else {\n      for (name in on) {\n        // add listener if new listener added\n        if (!oldOn[name]) {\n          elm.addEventListener(name, listener, false);\n        }\n      }\n    }\n  }\n}\n\nconst eventListenersModule = {\n  create: updateEventListeners,\n  update: updateEventListeners,\n  destroy: updateEventListeners\n};\n\n//# sourceURL=webpack://vue-study/./node_modules/snabbdom/build/modules/eventlisteners.js?");

/***/ }),

/***/ "./node_modules/snabbdom/build/modules/props.js":
/*!******************************************************!*\
  !*** ./node_modules/snabbdom/build/modules/props.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"propsModule\": () => (/* binding */ propsModule)\n/* harmony export */ });\nfunction updateProps(oldVnode, vnode) {\n  let key;\n  let cur;\n  let old;\n  const elm = vnode.elm;\n  let oldProps = oldVnode.data.props;\n  let props = vnode.data.props;\n  if (!oldProps && !props) return;\n  if (oldProps === props) return;\n  oldProps = oldProps || {};\n  props = props || {};\n\n  for (key in props) {\n    cur = props[key];\n    old = oldProps[key];\n\n    if (old !== cur && (key !== \"value\" || elm[key] !== cur)) {\n      elm[key] = cur;\n    }\n  }\n}\n\nconst propsModule = {\n  create: updateProps,\n  update: updateProps\n};\n\n//# sourceURL=webpack://vue-study/./node_modules/snabbdom/build/modules/props.js?");

/***/ }),

/***/ "./node_modules/snabbdom/build/modules/style.js":
/*!******************************************************!*\
  !*** ./node_modules/snabbdom/build/modules/style.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"styleModule\": () => (/* binding */ styleModule)\n/* harmony export */ });\n// Bindig `requestAnimationFrame` like this fixes a bug in IE/Edge. See #360 and #409.\nconst raf = typeof window !== \"undefined\" && window.requestAnimationFrame.bind(window) || setTimeout;\n\nconst nextFrame = function (fn) {\n  raf(function () {\n    raf(fn);\n  });\n};\n\nlet reflowForced = false;\n\nfunction setNextFrame(obj, prop, val) {\n  nextFrame(function () {\n    obj[prop] = val;\n  });\n}\n\nfunction updateStyle(oldVnode, vnode) {\n  let cur;\n  let name;\n  const elm = vnode.elm;\n  let oldStyle = oldVnode.data.style;\n  let style = vnode.data.style;\n  if (!oldStyle && !style) return;\n  if (oldStyle === style) return;\n  oldStyle = oldStyle || {};\n  style = style || {};\n  const oldHasDel = (\"delayed\" in oldStyle);\n\n  for (name in oldStyle) {\n    if (!style[name]) {\n      if (name[0] === \"-\" && name[1] === \"-\") {\n        elm.style.removeProperty(name);\n      } else {\n        elm.style[name] = \"\";\n      }\n    }\n  }\n\n  for (name in style) {\n    cur = style[name];\n\n    if (name === \"delayed\" && style.delayed) {\n      for (const name2 in style.delayed) {\n        cur = style.delayed[name2];\n\n        if (!oldHasDel || cur !== oldStyle.delayed[name2]) {\n          setNextFrame(elm.style, name2, cur);\n        }\n      }\n    } else if (name !== \"remove\" && cur !== oldStyle[name]) {\n      if (name[0] === \"-\" && name[1] === \"-\") {\n        elm.style.setProperty(name, cur);\n      } else {\n        elm.style[name] = cur;\n      }\n    }\n  }\n}\n\nfunction applyDestroyStyle(vnode) {\n  let style;\n  let name;\n  const elm = vnode.elm;\n  const s = vnode.data.style;\n  if (!s || !(style = s.destroy)) return;\n\n  for (name in style) {\n    elm.style[name] = style[name];\n  }\n}\n\nfunction applyRemoveStyle(vnode, rm) {\n  const s = vnode.data.style;\n\n  if (!s || !s.remove) {\n    rm();\n    return;\n  }\n\n  if (!reflowForced) {\n    // eslint-disable-next-line @typescript-eslint/no-unused-expressions\n    vnode.elm.offsetLeft;\n    reflowForced = true;\n  }\n\n  let name;\n  const elm = vnode.elm;\n  let i = 0;\n  const style = s.remove;\n  let amount = 0;\n  const applied = [];\n\n  for (name in style) {\n    applied.push(name);\n    elm.style[name] = style[name];\n  }\n\n  const compStyle = getComputedStyle(elm);\n  const props = compStyle[\"transition-property\"].split(\", \");\n\n  for (; i < props.length; ++i) {\n    if (applied.indexOf(props[i]) !== -1) amount++;\n  }\n\n  elm.addEventListener(\"transitionend\", function (ev) {\n    if (ev.target === elm) --amount;\n    if (amount === 0) rm();\n  });\n}\n\nfunction forceReflow() {\n  reflowForced = false;\n}\n\nconst styleModule = {\n  pre: forceReflow,\n  create: updateStyle,\n  update: updateStyle,\n  destroy: applyDestroyStyle,\n  remove: applyRemoveStyle\n};\n\n//# sourceURL=webpack://vue-study/./node_modules/snabbdom/build/modules/style.js?");

/***/ }),

/***/ "./node_modules/snabbdom/build/vnode.js":
/*!**********************************************!*\
  !*** ./node_modules/snabbdom/build/vnode.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"vnode\": () => (/* binding */ vnode)\n/* harmony export */ });\nfunction vnode(sel, data, children, text, elm) {\n  const key = data === undefined ? undefined : data.key;\n  return {\n    sel,\n    data,\n    children,\n    text,\n    elm,\n    key\n  };\n}\n\n//# sourceURL=webpack://vue-study/./node_modules/snabbdom/build/vnode.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var snabbdom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! snabbdom */ \"./node_modules/snabbdom/build/init.js\");\n/* harmony import */ var snabbdom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! snabbdom */ \"./node_modules/snabbdom/build/modules/class.js\");\n/* harmony import */ var snabbdom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! snabbdom */ \"./node_modules/snabbdom/build/modules/props.js\");\n/* harmony import */ var snabbdom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! snabbdom */ \"./node_modules/snabbdom/build/modules/style.js\");\n/* harmony import */ var snabbdom__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! snabbdom */ \"./node_modules/snabbdom/build/modules/eventlisteners.js\");\n/* harmony import */ var snabbdom__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! snabbdom */ \"./node_modules/snabbdom/build/h.js\");\n// import Vue from \"vue\";\n// console.log(11111111);\n// import ElementUI from \"element-ui\";\n// import \"element-ui/lib/theme-chalk/index.css\";\n// import App from \"./App.vue\";\n// Vue.use(ElementUI);\n// new Vue({\n//     el: \"#app\",\n//     render: (h) => h(App),\n// });\n\nconst patch = (0,snabbdom__WEBPACK_IMPORTED_MODULE_0__.init)([// Init patch function with chosen modules\nsnabbdom__WEBPACK_IMPORTED_MODULE_1__.classModule, // makes it easy to toggle classes\nsnabbdom__WEBPACK_IMPORTED_MODULE_2__.propsModule, // for setting properties on DOM elements\nsnabbdom__WEBPACK_IMPORTED_MODULE_3__.styleModule, // handles styling on elements with support for animations\nsnabbdom__WEBPACK_IMPORTED_MODULE_4__.eventListenersModule // attaches event listeners\n]);\nconst container = document.getElementById(\"container\");\nconst vnode = (0,snabbdom__WEBPACK_IMPORTED_MODULE_5__.h)(\"div#container.two.classes\", {\n  on: {\n    click: someFn\n  }\n}, [(0,snabbdom__WEBPACK_IMPORTED_MODULE_5__.h)(\"span\", {\n  style: {\n    fontWeight: \"bold\"\n  }\n}, \"This is bold\"), \" and this is just normal text\", (0,snabbdom__WEBPACK_IMPORTED_MODULE_5__.h)(\"a\", {\n  props: {\n    href: \"/foo\"\n  }\n}, \"I'll take you places!\")]); // Patch into empty DOM element – this modifies the DOM as a side effect\n\npatch(container, vnode);\nconst newVnode = (0,snabbdom__WEBPACK_IMPORTED_MODULE_5__.h)(\"div#container.two.classes\", {\n  on: {\n    click: anotherEventHandler\n  }\n}, [(0,snabbdom__WEBPACK_IMPORTED_MODULE_5__.h)(\"span\", {\n  style: {\n    fontWeight: \"normal\",\n    fontStyle: \"italic\"\n  }\n}, \"This is now italic type\"), \" and this is still just normal text\", (0,snabbdom__WEBPACK_IMPORTED_MODULE_5__.h)(\"a\", {\n  props: {\n    href: \"/bar\"\n  }\n}, \"I'll take you places!\")]); // Second `patch` invocation\n\npatch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state\n\n//# sourceURL=webpack://vue-study/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;