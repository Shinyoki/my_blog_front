<template>
  <v-app-bar :class="navClass" app hide-on-scroll flat height="60">
    <!--    960px > < 1264px*-->
    <div class="d-md-none nav-mobile-container">
      <!--      Avatar-->
      <div style="font-size: 18px; font-weight: bold">
        <router-link to="/">
          <v-avatar
              size="40px"
              color="grey"
              style="margin-right: 10px"
          >
            <img :src="blogInfo.websiteConfig.websiteAvatar"/>
          </v-avatar>
        </router-link>
      </div>
      <!--     搜索  -->
      <div style="margin-left: auto">
        <a @click="openSearch"><i class="iconfont icon-sousuoxiao"/> </a>
        <a @click="openDrawer" style="margin-left: 10px; font-size: 20px"><i class="iconfont icon-fenlei1"/> </a>
      </div>
    </div>

    <!--    大屏幕设备-->
    <div class="d-md-block d-none nav-container">
      <div class="float-left blog-title">
        <router-link to="/">
          {{ blogInfo.websiteConfig.websiteAuthor }}
        </router-link>
      </div>

      <div class="float-right nav-title">
        <div class="menus-item">
          <a class="menu-btn" @click="openSearch"><i class="iconfont icon-sousuoxiao"/> 搜索</a>
        </div>

        <div class="menus-item">
          <router-link to="/" class="menu-btn"><i class="iconfont icon-shouye"/> 首页</router-link>
        </div>

        <div class="menus-item">
          <a class="menu-btn">
            <i class="iconfont icon-faxian"/> 发现
            <i class="iconfont icon-xiangxia2 expand"/>
          </a>
          <ul class="menus-submenu">
            <li>
              <router-link to="/archives">
                <i class="iconfont icon-guidang"/> 归档
              </router-link>
            </li>
            <li>
              <router-link to="/categories">
                <i class="iconfont icon-fenlei1"/> 分类
              </router-link>
            </li>
            <li>
              <router-link to="/tags">
                <i class="iconfont icon-biaoqing_xiao_o"/> 标签
              </router-link>
            </li>
          </ul>
        </div>

        <div class="menus-item">
          <a class="menu-btn">
            <i class="iconfont icon-qita"/> 娱乐
            <i class="iconfont icon-xiangxia2"/>
          </a>
          <ul class="menus-submenu">
            <li>
              <router-link to="/albums">
                <i class="iconfont icon-xiangce1"/> 相册
              </router-link>
            </li>
            <li>
              <router-link to="/talks">
                <i class="iconfont icon-qunliao"/> 说说
              </router-link>
            </li>
          </ul>
        </div>

        <div class="menus-item">
          <router-link to="/links" class="menu-btn">
            <i class="iconfont icon-lianjie"/> 友链
          </router-link>
        </div>

        <div class="menus-item">
          <router-link to="/about" class="menu-btn">
            <i class="iconfont icon-24gl-paperPlane"/> 关于
          </router-link>
        </div>

        <div class="menus-item">
          <router-link to="/message" class="menu-btn">
            <i class="iconfont icon-pinglunxiao"/> 留言
          </router-link>
        </div>

        <div class="menus-item">
          <a
              class="menu-btn"
              v-if="!this.$store.state.avatar"
              @click="openLogin"
          >
            <i class="iconfont icon-denglu"/> 登录
          </a>

          <template v-else>
            <img
                :src="this.$store.state.avatar"
                class="user-avatar"
                height="30"
                width="30"
            >
            <ul class="menus-submenu">
              <li>
                <router-link to="/user">
                  <i class="iconfont icon-iconfontgerenzhongxin1"/> 个人中心
                </router-link>
              </li>
              <li>
                <a @click="logout">
                  <i class="iconfont icon-tuichubianji"/> 退出
                </a>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
  </v-app-bar>
</template>
<script>
export default {
  created() {

  },
  mounted() {
    window.addEventListener("scroll", this.scroll);
  },
  data() {
    return {
      navClass: "nav"
    }
  },
  methods: {
    scroll() {
      const that = this;
      let scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop > 60) {
        that.navClass = "nav-fixed";
      } else {
        that.navClass = "nav";
      }
    },
    //打开dialog
    openSearch() {
      this.$store.state.searchFlag = true;
    },
    openDrawer() {
      this.$store.state.drawerFlag = true;
    },
    openLogin() {
      this.$store.state.loginFlag = true;
    },
    logout() {
      if (this.$route.path == "/user") {
        //如果在个人中心则跳回上一页
        this.$router.go(-1);
      }
      this.getRequest("/logout").then(res => {
        if (res.data.flag) {
          this.$store.commit("logout");
          this.$toast({
            type: "success",
            message: "退出登录成功"
          });
        } else {
          this.$toast({
            type: "error",
            message: res.data.message
          });
        }
      })
    },
  },
  computed: {
    blogInfo() {
      return this.$store.state.blogInfo;
    },
  },

}
</script>
<style scoped>
body {
  background-color: black !important;
}

ul {
  list-style: none;
}

i {
  margin-right: 4px;
}

/*v-toolbar导航栏*/
.nav {
  background: rgba(0, 0, 0, 0) !important;
}

.nav a {
  color: #eee !important;
}

.nav .menu-btn {
  text-shadow: .1rem .1rem .2rem rgba(0, 0, 0, 0.3);
}

.nav .blog-title a {
  text-shadow: .1rem .1rem .2rem rgba(0, 0, 0, 0.15);
}

.nav-container {
  font-size: 14px;
  width: 100%;
  height: 100%;
}

.nav-mobile-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

/*主题*/
.theme--light.nav-fixed {
  background: rgba(255, 255, 255, .8) !important;
  box-shadow: 0 5px 6px -5px rgba(133, 133, 133, .6);
}

.theme--dark.nav-fixed {
  background: rgba(18, 18, 18, 0.8) !important;
}

.theme--dark.nav-fixed a {
  color: rgba(255, 255, 255, 0.8) !important;
}

.theme--light.nav-fixed a {
  color: #4c4948 !important;
}

.nav-fixed .menus-item a,
.nav-fixed .blog-title a {
  text-shadow: none;
}

/*按钮的鼠标悬浮*/
.nav-fixed .menu-btn:hover {
  color: #49b1f5 !important;
}

.menu-btn:hover:after {
  width: 100%;
}

.menus-item a:after {
  content: "";

  position: absolute;
  bottom: -5px;
  left: 0;
  z-index: -1;
  width: 0;
  height: 3px;
  background: #80c8f8;

  transition: all .3s ease-in-out;
}

.blog-title, .nav-title {
  display: flex;
  align-items: center;
  height: 100%;
}

.blog-title a {
  font-size: 18px;
  font-weight: bold;
}

.menus-item {
  position: relative;
  display: inline-block;
  margin: 0 0 0 .875rem;
}

.menus-item a {
  transition: all .2s;
}

/*悬浮时显示菜单*/
.menus-item:hover .menus-submenu {
  display: block;
}

.menus-submenu {
  position: absolute;
  display: none;

  right: 0;
  margin-top: 8px;
  width: max-content;
  box-shadow: 0 5px 20px -4px rgba(0, 0, 0, 0.5);
  background-color: #fff;

  animation: submenu 0.3s 0.1s ease both;
}
.menus-submenu a:hover{
  background-color: #80c8f8;
}

@keyframes submenu {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    transform: translateY(10px);
  }
  10% {
    opacity: 1;
    filter: none;
    transform: translateY(0);
  }
}

.menus-submenu:before {
  position: absolute;
  content: "";

  top: -8px;
  left: 0;
  width: 100%;
  height: 20px;
}

.menus-submenu a {
  display: block;
  padding: 6px 14px;
  line-height: 2;
  color: #4c4948 !important;
  text-shadow: none;

}

.user-avatar {
  cursor: pointer;
  border-radius: 50%;
}



</style>