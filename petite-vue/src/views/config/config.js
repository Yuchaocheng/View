import { createApp } from "@mini-vue";
import "./config.css";
import router from "@/common/router/index";


export default function () {
    createApp({
        test: "config",
        toDevice(){
            router.push('/config/deviceInfo')
        },
        toNetwork(){
            router.push('/config/network')
        }
    }).mount("#config");
}
