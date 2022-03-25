import { createApp } from "@mini-vue";
import router from "@/common/router/index";
import WebSdk from "@/common/request/websdk";
import "./login.css";

export default function () {
    createApp({
        user: "",
        pass: "",
        login() {
            const { user, pass } = this;
            WebSdk.login(user, pass, (oInfo) => {
                router.push("/config/deviceInfo");
            });
        },
    }).mount("#login");
}
