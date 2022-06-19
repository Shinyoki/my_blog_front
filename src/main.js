import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import animated from "animate.css";
import VueAxios from "vue-axios";
import axios from "axios";
import Nprogress from "nprogress";
import {getRequest, postRequest, putRequest, deleteRequest} from "@/utils/axios-api";


Vue.config.productionTip = false;
Vue.prototype.blogConfig = require("./assets/js/config");
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.use(animated);
Vue.use(VueAxios, axios);


router.beforeEach((to, from, next) => {
    Nprogress.start();
    if (to.meta.title) {
        //网页标题
        document.title = to.meta.title;
    }
})

router.afterEach(() => {
    Nprogress.done();
    //滚动条无过渡跳转
    window.scrollTo({
        top: 0,
        behavior: "instant"
    })
})

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
