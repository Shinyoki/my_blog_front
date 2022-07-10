import axios from "axios";
import Nprogress from "nprogress";
import Vue from "vue";

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
            case "500":
                Vue.prototype.$toast({
                    type: "error",
                    message: "系统异常"
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