import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        blogInfo: {
            articleCount: null,
            categoryCount: null,
            pageList: [],
            tagCount: null,
            viewCount: null,
            websiteConfig: {}
        },   //博客信息
        registerFlag: false, //注册状态
        userId: null, //用户id
        avatar: null, //用户头像
        nickname: null, //用户昵称
        intro: null, //用户简介
        webSite: null, //用户网站
        email: null, //用户邮箱
        loginType: null, //用户登录类型
        articleLikeSet: [], //用户文章点赞集合
        commentLikeSet: [], //用户评论点赞集合
        talkLikeSet: [], //用户说说点赞集合
        searchFlag: false,  //搜索框框
        drawerFlag: false,      //侧边抽屉
        loginFlag: false,   //登录框
    },
    mutations: {
        //登录
        login(state, user) {
            state.userId = user.userInfoId;
            state.avatar = user.avatar;
            state.nickname = user.nickname;
            state.intro = user.intro;
            state.webSite = user.webSite;
            state.email = user.email;
            state.loginType = user.loginType;
            state.articleLikeSet = user.articleLikeSet ? user.articleLikeSet : [];
            state.commentLikeSet = user.commentLikeSet ? user.commentLikeSet : [];
            state.talkLikeSet = user.talkLikeSet ? user.talkLikeSet : [];
        },
        //初始化用户信息
        logout(state) {
            state.userId = null;
            state.avatar = null;
            state.nickname = null;
            state.intro = null;
            state.webSite = null;
            state.email = null;
            state.loginType = null;
            state.articleLikeSet = [];
            state.commentLikeSet = [];
            state.talkLikeSet = [];
        },
        //初始化博客信息
        setBlogInfo(state, blogInfo) {
            state.blogInfo = blogInfo;
        },
    },
    plugins: [
        createPersistedState({
            storage: window.sessionStorage
        })
    ]
});