import { createApp, reactive } from "@mini-vue";
import WebSdk from "@/common/request/websdk";
import { nodeValue } from "@util/utils";
import "./deviceInfo.css";

/* 无法暴露自定义Vue事件，只能暴露自定义DOM事件，petite-vue的使用混杂DOM操作 */
export default function () {
    let xmlDom = null;
    const oDeviceInfo = reactive({});
    WebSdk.axios({
        cmd: "deviceInfo",
        data: {},
        oParams: {},
    }).then((res) => {
        xmlDom = res.data;
        if (res.data) {
            oDeviceInfo.deviceName = nodeValue(xmlDom, "deviceName");
            oDeviceInfo.deviceID = nodeValue(xmlDom, "deviceID");
            oDeviceInfo.model = nodeValue(xmlDom, "model");
            oDeviceInfo.serialNumber = nodeValue(xmlDom, "serialNumber");
            oDeviceInfo.firmwareReleasedDate = nodeValue(xmlDom, "firmwareReleasedDate");
            oDeviceInfo.encoderVersion = nodeValue(xmlDom, "encoderVersion");
        }
        // if (res.data) {
        //     const deviceInfoNode = document.getElementById("deviceInfo");
        //     const inputNodes = deviceInfoNode.querySelectorAll("h-input");
        //     inputNodes[0].value = nodeValue(xmlDom, "deviceName");
        //     inputNodes[1].value = nodeValue(xmlDom, "deviceID");
        //     const contentNodes = deviceInfoNode.querySelectorAll(".content");
        //     contentNodes[2].textContent = nodeValue(xmlDom, "model");
        //     contentNodes[3].textContent = nodeValue(xmlDom, "serialNumber");
        //     contentNodes[4].textContent = nodeValue(xmlDom, "firmwareReleasedDate");
        //     contentNodes[5].textContent = nodeValue(xmlDom, "encoderVersion");
        //     inputNodes[0].addEventListener("input", (ev) => {
        //         inputNodes[0].value = ev.target.value;
        //     });
        //     inputNodes[1].addEventListener("input", (ev) => {
        //         inputNodes[1].value = ev.target.value;
        //     });
        // }
    });
    createApp({
        oDeviceInfo,
        save() {
            const { oDeviceInfo } = this;
            /* 设置的时候有点问题 */
            nodeValue(xmlDom, "deviceName", "", oDeviceInfo.deviceName);
            nodeValue(xmlDom, "deviceID", "", oDeviceInfo.deviceID);
            WebSdk.axios({
                cmd: "deviceInfo",
                type: "PUT",
                data: xmlDom,
            });
        },
    }).mount("#deviceInfo");
}
