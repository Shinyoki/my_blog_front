import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import animated from "animate.css";     // css class动态组件
import VueAxios from "vue-axios";
import axios from "@/assets/js/axios-config";
import Nprogress from "nprogress";      // 加载进度条组件
import {getRequest, postRequest, putRequest, deleteRequest} from "@/utils/axios-api";
import vuetify from "@/plugins/vuetify";    // vuetify
import "./assets/css/index.css";            // 自定义全局样式
import "./assets/css/iconfont/iconfont.css";    // 阿里巴巴iconfont
import Toast from "@/components/toast/index";   // 自定义消息提示 $toast组件
import dayjs from "dayjs";                      // 日期处理工具
import config from "./assets/js/config";        // 自定义全局配置
import InfiniteLoading from "vue-infinite-loading";     // vue的 自动无限加载组件
import "@/assets/css/markdown.css"          // markdown css
import "highlight.js/styles/atom-one-dark.css";

Vue.config.productionTip = false;
Vue.prototype.blogConfig = config;
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.use(animated);
Vue.use(VueAxios, axios);
Vue.use(Toast)
Vue.use(InfiniteLoading);

router.beforeEach((to, from, next) => {
    Nprogress.start();
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});

router.afterEach(() => {
    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
    Nprogress.done();
});

//Date Format
Vue.filter("date", function (dateStr) {
    return dayjs(dateStr).format("YYYY-MM-DD");
});

//Time Format
Vue.filter("time", function (dateStr) {
    return dayjs(dateStr).format("HH:mm:ss");
});

//Date Time Format
Vue.filter("datetime", function (dateStr) {
    return dayjs(dateStr).format("YYYY-MM-DD HH:mm:ss");
});

//Year Only
Vue.filter("year", function (dateStr) {
    return dayjs(dateStr).format("YYYY");
});

// 字数统计
Vue.filter("num", (number) => {
    if (number >= 1000) {
        return (number / 1000).toFixed(1) + "K";
    }
    return number;
})

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount('#app')
