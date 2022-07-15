<template>
  <div>
    <!--    banner-->
    <div class="home-banner" :style="bannerCoverStyle">
      <!--      container-->
      <div class="banner-container">
        <!--        联系方式-->
        <h1 class="blog-title animated zoomIn">
          {{ blogInfo.websiteConfig.websiteName }}
        </h1>
        <!--        一言-->
        <div class="blog-intro">
          {{ obj.output }} <span class="typing-cursor">|</span>
        </div>
<!--        联系方式-->
        <div class="blog-contact">
          <a
            v-if="isShowSocialContact('qq')"
            class="mr-5 iconfont icon-QQ"
            target="_blank"
            :href="qqContact"
            />
          <a
            v-if="isShowSocialContact('github')"
            class="mr-5 iconfont icon-github"
            target="_blank"
            :href="githubContact"
            />
          <a
            v-if="isShowSocialContact('gitee')"
            class="iconfont icon-gitee"
            target="_blank"
            :href="giteeContact"
            />
        </div>
      </div>
<!--      向下滑动-->
      <div class="scroll-down" @click="scrollDown">
        <v-icon
          color="#fff"
          class="scroll-down-effects"
          >mdi-chevron-down</v-icon>
      </div>
    </div>
  </div>
</template>

<script>
import EasyTyper from "easy-typer-js";
export default {
  data() {
    return {
      // easy-typer
      obj: {
        output: "",
        isEnd: false,
        speed: 300,
        singleBack: false,
        sleep: 0,
        type: "rollback",
        backSpeed: 40,
        sentencePause: true
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      // 修改标题
      document.title = this.blogInfo.websiteConfig.websiteName;
      // 抓取一言API
      fetch("https://v1.hitokoto.cn?")
          .then(res => {
            return res.json();    // 接收json格式
          })
          .then(({ hitokoto}) => {
            this.setTyping(hitokoto);
          })
    },
    // 设置typing效果
    setTyping(input) {
      const obj = this.obj;
      new EasyTyper(obj, input);
    },
    // 点击移动窗口
    scrollDown() {
      window.scrollTo({
        top: document.documentElement.clientHeight,
        behavior: "smooth"
      })
    },


  },
  computed: {
    // 如果是主页，就加上主页的background img
    bannerCoverStyle() {
      let cover = "";
      this.$store.state.blogInfo.pageList.forEach(page => {
        if (page.pageLabel == "home") {
          // 主页
          cover = page.pageCover;
        }
      });
      return "background: url(" + cover + ") center center / cover no-repeat";
    },
    // blogInfo
    blogInfo() {
      return this.$store.state.blogInfo;
    },
    // 是否可显示
    isShowSocialContact() {
      return function (contactType) {
        return this.blogInfo.websiteConfig.socialUrlList.indexOf(contactType) != -1;
      };
    },
    // qq联系
    qqContact() {
      return "";
    },
    // github联系
    githubContact() {
      return "";
    },
    // gitee联系
    giteeContact() {
      return "";
    }
  }
}
</script>

<style scoped>
/*底图*/
.home-banner {
  position: absolute;
  top: -60px;
  left: 0;
  right: 0;

  height: 100vh;
  background-attachment: fixed;
  text-align: center;
  color: #fff;
  animation: header-effect 1s;
}

@keyframes header-effect {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    transform: translateY(-50%);
  }
  100% {
    opacity: 1;
    filter: none;
    transform: translateY(0);
  }
}
/*中间信息*/
.banner-container {
  margin-top: 43vh;
  line-height: 1.5;
  color: #fff;
}
/*联系我图标*/
.blog-contact a {
  text-decoration: none;
  color: #fff;
}
/*下拉按钮*/
.scroll-down {
  cursor: pointer;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.scroll-down i {
  font-size: 2rem;
}
.scroll-down-effects {
  color: #eee !important;
  text-align: center;
  text-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.15);
  line-height: 1.5rem;

  display: inline-block;
  -webkit-font-smoothing: antialiased;
  animation: scroller-effect 1.5s infinite;
}
@keyframes scroller-effect {
  0% {
    top: 0;
    opacity: 0.4;
    filter: alpha(opacity=40);
  }
  50% {
    top: -16px;
    opacity: 1;
    filter: none;
  }
  100% {
    top: 0;
    opacity: 0.4;
    filter: alpha(opacity=40);
  }
}
</style>