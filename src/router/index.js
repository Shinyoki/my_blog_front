import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

//静态路由
const routes = [
    {
        name: "首页",
        path: "/",
        component: resolve => require(["../views/home/Home.vue"], resolve)
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
})

export default router;