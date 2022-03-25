import  template from './hButton.html'

class MyElement extends HTMLElement {
    // 只有在observedAttributes数组中列巨的属性值，浏览器才会检测改变，调用attributeChangedCallback
    static get observedAttributes() {
        return ["disabled"];
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = template
        // this.container = this.shadowRoot("#container");
    }

    // 元素插入DOM树回调
    connectedCallback() {
        // here the element has been inserted into the DOM
    }
    // 元素从DOM中移除的时候调用（关闭浏览器或者浏览器tab的时候，不会调用）
    disconnectCallback() {}
    // 将属性添加到observedAttributes数组时触发
    attributeChangedCallback() {}

    set disabled(isDisabled) {
        if (isDisabled) {
            this.setAttribute("disabled", "");
        } else {
            this.removeAttribute("disabled");
        }
    }

    // 可自定义方法
    doSome() {}
}

window.customElements.define("h-button", MyElement);
