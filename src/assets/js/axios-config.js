import axios from "axios";
import Nprogress from "nprogress";
import Vue from "vue";
import router from "@/router";
import store from "@/store";

axios.interceptors.request.use(
    config => {
        Nprogress.start();
        return config;
    },
    error => {
        Nprogress.done();
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    response => {
        switch (response.data.code) {
            case 500:
                Vue.prototype.$toast({
                    type: "error",
                    message: "系统异常"
                });
                break;
            case 401:
                Vue.prototype.$toast({
                    type: "error",
                    message: "登录状态失效"
                });

                router.push("/");

                axios("/api/logout").then(res => {
                    if (res.data.flag) {
                        store.commit("logout");
                    } else {
                        Vue.prototype.$toast({
                            type: "error",
                            message: res.data.message
                        });
                    }
                })
        }

        Nprogress.done();
        return response;
    },
    error => {
        Nprogress.done();
        return Promise.reject(error);
    }
);

export default axios;