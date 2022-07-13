<template>
  <v-app >
<!--    导航栏-->
    <TopNavBar></TopNavBar>
<!--    侧边栏-->
    <SideBarNav></SideBarNav>
<!--    主体内容-->
    <v-main>
      <router-view :key="this.$route.fullPath" />
    </v-main>
<!--    Footer-->
    <Footer></Footer>
<!--    回到顶端-->
    <BackTop></BackTop>
<!--    登录模态框-->
    <LoginModel></LoginModel>
<!--    注册模态框-->
    <RegisterModel></RegisterModel>
  </v-app>
</template>

<script>
import TopNavBar from "./components/layout/TopNavBar";
import SideBarNav from "@/components/layout/SideBarNav";
import Footer from "@/components/layout/Footer";
import BackTop from "@/components/BackTop"
import LoginModel from "@/components/model/LoginModel";
import RegisterModel from "@/components/model/RegisterModel";
export default {
  created() {
    //获取博客信息
    this.getBlogInfo();
    //上传访客信息
    this.postRequest("/record");
  },
  mounted() {

  },
  methods: {
    getBlogInfo() {
      this.getRequest("/").then(res => {
        this.$store.commit("setBlogInfo", res.data.data);
      })
    },
  },
  components: {
    TopNavBar,
    SideBarNav,
    Footer,
    BackTop,
    LoginModel,
    RegisterModel
  }
}
</script>
<style>
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background-color: rgba(73, 177, 245, 0.2);
  border-radius: 2em;
}

::-webkit-scrollbar-thumb {
  background-color: #49b1f5;
  background-image: -webkit-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.4) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0.4) 75%,
      transparent 75%,
      transparent
  );
  border-radius: 2em;
}

::-webkit-scrollbar-corner {
  background-color: transparent;
}
</style>

