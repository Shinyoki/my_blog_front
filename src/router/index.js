import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: resolve => require(["../views/home/Home.vue"], resolve),
        meta: {
            title: "首页"
        }
    },
    {
        path: "/oauth/login/:loginType",
        component: resolve => require(["../components/oauth/OauthLogin.vue"], resolve),
        meta: {
            title: "第三方认证"
        }
    },
    {
        path: "/articles/:articleId",
        component: resolve => require(["../views/article/Article.vue"], resolve),
        meta: {
            title: "文章"
        },
    },
    {
        path: "/archives",
        component: resolve => require(["../views/archive/Archive.vue"], resolve),
        meta: {
            title: "归档"
        }
    },
    {
        path: "/albums",
        component: resolve => require(["../views/album/Album.vue"], resolve),
        meta: {
            title: "相册"
        }
    },
    {
        path: "/albums/:albumId",
        component: resolve => require(["../views/album/Photo.vue"], resolve),
        meta: {
            title: "图库"
        }
    },
    {
        path: "/talks",
        component: resolve => require(["../views/talk/Talks.vue"], resolve),
        meta: {
            title: "说说"
        }
    },
    {
        path: "/talks/:talkId",
        component: resolve => require(["../views/talk/TalkInfo.vue"], resolve),
        meta: {
            title: "说说"
        }
    },
    {
        path: "/user",
        component: resolve => require(["../views/user/User.vue"], resolve),
        meta: {
            title: "个人中心"
        }
    },
    {
        path: "/tags",
        component: resolve => require(["../views/tag/Tags.vue"], resolve),
        meta: {
            title: "标签"
        }

    }


];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
