import template from "./hInput.html";

class MyElement extends HTMLElement {
    static get observedAttributes() {
        return ["value"];
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = template;

        //设置自定义属性
        this._input = null; //组件内真正的input Dom
    }

    /* 静态方法，使用这种方式定义的方法会成为实例对象自身的方法，并且使用箭头函数保证其在别处执行时，this也等于实例对象 */
    handleInput = (ev) => {
        this.value = ev.target.value;
        this.dispatchEvent(
            new CustomEvent("input", {
                detail: {
                    value: this.value,
                },
            })
        );
    };
    connectedCallback() {
        this._input = this.shadowRoot.getElementById("input");
        this._input.addEventListener("input", this.handleInput);
    }
    disconnectCallback() {
        this._input.removeEventListener("input", this.handleInput);
    }
    attributeChangedCallback(attr, oldVal, newVal) {
        const oArrMap = {
            value: () => {
                this._input.value = newVal;
            },
        };

        if (oArrMap.hasOwnProperty(attr)) {
            oArrMap[attr]();
        }
    }

    set disabled(isDisabled) {
        if (isDisabled) {
            this.setAttribute("disabled", "");
        } else {
            this.removeAttribute("disabled");
        }
    }
    get value() {
        return this._input.value;
    }
    set value(newVal) {
        this._input.value = newVal;
    }
}

window.customElements.define("h-input", MyElement);
