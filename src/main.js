import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import animated from "animate.css";
import VueAxios from "vue-axios";
import axios from "axios";
import Nprogress from "nprogress";
import {getRequest, postRequest, putRequest, deleteRequest} from "@/utils/axios-api";
import vuetify from "@/plugins/vuetify";
import "./assets/css/index.css";
import "./assets/css/iconfont/iconfont.css";
import Toast from "@/components/toast/index";

Vue.config.productionTip = false;
Vue.prototype.blogConfig = require("./assets/js/config");
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.use(animated);
Vue.use(VueAxios, axios);
Vue.use(Toast)

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

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount('#app')
