// import Vue from "vue";
// console.log(11111111);
// import ElementUI from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";
// import App from "./App.vue";

// Vue.use(ElementUI);

// new Vue({
//     el: "#app",
//     render: (h) => h(App),
// });

import { init, classModule, propsModule, styleModule, eventListenersModule, h } from "snabbdom";

const patch = init([
    // Init patch function with chosen modules
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    eventListenersModule, // attaches event listeners
]);

const container = document.getElementById("container");
const someFn = (()=>{
    console.log('div#container.two.classes');
})
const anotherEventHandler = (()=>{
    console.log("newVnode");
})
const vnode = h("div#container.two.classes", { on: { click: someFn } }, [
    h("span", { style: { fontWeight: "bold" } }, "This is bold"),
    " and this is just normal text",
    h("a", { props: { href: "/foo" } }, "I'll take you places!"),
]);
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(container, vnode);

const newVnode = h("div#container.two.classes", { on: { click: anotherEventHandler } }, [
    h("span", { style: { fontWeight: "normal", fontStyle: "italic" } }, "This is now italic type"),
    " and this is still just normal text",
    h("a", { props: { href: "/bar" } }, "I'll take you places!"),
]);
// Second `patch` invocation
patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state
