<template>
  <v-navigation-drawer
    app
    right
    overlay-opacity="0.8"
    v-model="drawer"
    width="250"
    disable-resize-watcher
  >
  <!-- 顶端头像 -->
    <div class="blogger-avatar">
      <v-avatar
        size="40"
        style="margin-bottom: .5rem"
        >
        <img :src="curAvatar"/>
      </v-avatar>
    </div>
<!-- 博客信息 -->
    <div class="blog-info-wrapper">

      <!-- 文章数 -->
      <div class="blog-info-data">
        <router-link to="/archives">
          <div style="font-size: .875rem">{{ $vuetify.lang.t('$vuetify.文章') }}</div>
          <div style="font-size: 1.125rem">
            {{ this.$store.state.blogInfo.articleCount }}
          </div>
        </router-link>
      </div>

      <!-- 分类数 -->
      <div class="blog-info-data">
        <router-link to="/categories">
          <div style="font-size: .875rem">{{ $vuetify.lang.t('$vuetify.分类') }}</div>
          <div style="font-size: 1.125rem">
            {{ this.$store.state.blogInfo.categoryCount }}
          </div>
        </router-link>
      </div>

      <!-- 标签数 -->
      <div class="blog-info-data">
        <router-link to="/tags">
          <div style="font-size: .875rem">{{ $vuetify.lang.t('$vuetify.标签') }}</div>
          <div style="font-size: 1.125rem">
            {{ this.$store.state.blogInfo.tagCount }}
          </div>
        </router-link>
      </div>
    </div>

    <hr/>

    <!-- 导航 -->
    <div class="menu-container">
      <div class="menus-item">
        <router-link to="/">
           <i class="iconfont icon-shouye"/> {{ $vuetify.lang.t('$vuetify.首页') }}
        </router-link>
      </div>
      <div class="menus-item">
        <router-link to="/archives">
          <i class="iconfont icon-guidang"/> {{ $vuetify.lang.t('$vuetify.归档') }}
        </router-link>
      </div>
      <div class="menus-item">
        <router-link to="/albums">
          <i class="iconfont icon-xiangce1"/> {{ $vuetify.lang.t('$vuetify.相册') }}
        </router-link>
      </div>
      <div class="menus-item">
        <router-link to="/talks">
          <i class="iconfont icon-pinglunxiao" /> {{ $vuetify.lang.t('$vuetify.说说') }}
        </router-link>
      </div>
      <div class="menus-item">
        <router-link to="/categories">
          <i class="iconfont icon-fenlei1"/> {{ $vuetify.lang.t('$vuetify.分类') }}
        </router-link>
      </div>
      <div class="menus-item">
        <router-link to="/tags">
          <i class="iconfont icon-biaoqing_xiao_o"/> {{ $vuetify.lang.t('$vuetify.标签') }}
        </router-link>
      </div>
      <div class="menus-item">
        <router-link to="/links">
          <i class="iconfont icon-lianjie"/> {{ $vuetify.lang.t('$vuetify.友链') }}
        </router-link>
      </div>
      <div class="menus-item">
        <router-link to="/about" >
          <i class="iconfont icon-24gl-paperPlane"/> {{ $vuetify.lang.t('$vuetify.关于') }}
        </router-link>
      </div>
      <div class="menus-item">
        <router-link to="/message">
          <i class="iconfont icon-pinglunxiao"/> {{ $vuetify.lang.t('$vuetify.留言') }}
        </router-link>
      </div>
      <div class="menus-item" v-if="!this.$store.state.avatar">
        <a @click="openLogin">
          <i class="iconfont icon-denglu"/> {{ $vuetify.lang.t('$vuetify.登录') }}
        </a>
      </div>
      <div v-else>
        <div class="menus-item">
          <router-link to="/user">
            <i class="iconfont icon-iconfontgerenzhongxin1"/> {{ $vuetify.lang.t('$vuetify.个人中心') }}
          </router-link>
        </div>
        <div class="menus-item">
          <a @click="logout">
            <i class="iconfont icon-tuichubianji"/> {{ $vuetify.lang.t('$vuetify.退出') }}
          </a>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  methods: {
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
    openLogin() {
      this.$store.state.loginFlag = true;
    },
  },
  computed: {
    drawer: {
      set(value) {
        this.$store.state.drawerFlag = value;
      },
      get(){
        return this.$store.state.drawerFlag;
      }
    },
    curAvatar() {
      return this.$store.state.avatar ? this.$store.state.avatar : this.$store.state.blogInfo.websiteConfig.websiteAvatar;
    },
  }
}
</script>
<style scoped>
.blogger-avatar {
  padding: 26px 30px 0;
  text-align: center;
}

.blog-info-wrapper {
  display: flex;
  align-items: center;
  padding: 12px 10px 0;
}
.blog-info-data {
  flex: 1;
  line-height: 2;
  text-align: center;
}

.menu-container {
  padding: 0 10px 40px;
  animation: 0.8s ease 0s 1 normal none running sidebarItem;
}
@keyframes sidebarItem {
  0% {
    transform: translateX(200px);
  }
  100% {
    transform: translateX(0);
  }
}
.menus-item a {
  padding: 6px 30px;
  display: block;
  line-height: 2;
}
.menus-item i {
  margin-right: .35rem;
}

hr {
  border: 2px dashed #d2ebfd;
  margin: 20px 0;
}
</style>