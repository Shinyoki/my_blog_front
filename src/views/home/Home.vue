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
        >mdi-chevron-down
        </v-icon>
      </div>
    </div>
    <!--    主体内容-->
    <v-row
        class="home-container"
    >
      <!--      中大型设备9列，默认12列-->
      <v-col
          md="9"
          cols="12"
      >
        <!--        说说轮播-->
        <v-card
            class="animated zoomIn"
            v-if="talkList.length > 0"
        >
          <Swiper :list="talkList"></Swiper>
        </v-card>
        <!--        文章流-->
        <v-card
            class="animated zoomIn article-card"
            style="border-radius: 12px 8px 8px 12px"
            v-for="(article, index) of articleList"
            :key="index"
        >
          <!--          文章封面-->
          <div :class="isRight(index)">
            <router-link
                :to="'/articles/' + article.id">
              <v-img
                  class="on-hover"
                  width="100%"
                  height="100%"
                  :src="article.articleCover"
              />
            </router-link>
          </div>
          <!--          文章信息-->
          <div class="article-wrapper">
            <!--            标题-->
            <div style="font-size: 1.5rem; font-weight: bold">
              <router-link :to="'/articles/' + article.id">
                {{ article.articleTitle }}
              </router-link>
            </div>
            <!--            信息-->
            <div class="article-info">
              <!--              是否置顶-->
              <span v-if="article.isTop == 1">
                <span style="color: #ff7242">
                  <i class="iconfont icon-zhiding"/> 置顶
                </span>
                <span class="separator">|</span>
              </span>

              <!--              发表时间-->
              <v-icon
                  size="14"
              >mdi-calendar-month-outline
              </v-icon>
              {{ article.createTime | date }}
              <span class="separator">|</span>

              <!--              文章分类-->
              <router-link
                  :to="'/categories/' + article.categoryId">
                <v-icon
                    size="14"
                >mdi-inbox-full
                </v-icon>
                {{ article.categoryName }}
              </router-link>
              <span class="separator">|</span>

              <!--              文章标签-->
              <router-link
                  v-for="tag of article.tagDTOList"
                  class="mr-1"
                  :key="tag.id"
                  :to="'/tags/' + tag.id"
              >
                <v-icon
                    size="14"
                >mdi-tag-multiple
                </v-icon>
                {{ tag.tagName }}
              </router-link>
            </div>
            <!--            内容-->
            <div class="article-content">
              {{ article.articleContent }}
            </div>
          </div>
        </v-card>

        <!--            无限加载-->
        <infinite-loading @infinite="infiniteHandler">
          <div slot="no-more" class="mt-7">没有更多文章了捏~</div>
        </infinite-loading>
      </v-col>

      <!--      博主信息-->
      <!--      当设备为md及以下时改为block状态，并不显示-->
      <v-col
          md="3"
          cols="12"
          class="d-md-block d-none"
      >
        <div class="blog-wrapper">
          <v-card
              class="animated zoomIn blog-card mt-5">
            <div class="author-wrapper">
<!--              博主头像-->
              <v-avatar
                size="110"
                >
                <img
                  :src="blogInfo.websiteConfig.websiteAvatar"
                  class="author-avatar"
                  />
              </v-avatar>
<!--              名称-->
              <div style="font-size: 1.375rem;margin-top: .625rem">
                {{ blogInfo.websiteConfig.websiteAuthor }}
              </div>
<!--              介绍-->
              <div style="font-size: .875rem">
                {{ blogInfo.websiteConfig.websiteIntro }}
              </div>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import EasyTyper from "easy-typer-js";
import Swiper from "@/components/Swiper";

export default {
  components: {
    Swiper
  },
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
      },
      talkList: [],
      articleList: [],
      // page
      current: 0,
      size: 10
    }
  },
  created() {
    this.init();
    this.listHomeTalks();
  },
  methods: {
    // 无限加载文章
    infiniteHandler($state) {
      // markdown it组件
      let md = require('markdown-it')();
      let params = {
        current: this.current,
        size: this.size
      }
      this.getRequest("/articles", params).then(res => {
        if (res.data.data.length) {
          // 长度非空
          res.data.data.forEach(article => {
            article.articleContent = md.render(article.articleContent)
                .replace(/<\/?[^>]*>/g, "")
                .replace(/[|]*\n/, "")
                .replace(/&npsp;/gi, "");
          })

          this.articleList.push(...res.data.data);
          this.current += res.data.data.length;
          $state.loaded();
        } else {
          // 长度为null | undefined
          $state.complete();
        }
      })

    },
    // 初始化
    init() {
      // 修改标题
      document.title = this.blogInfo.websiteConfig.websiteName ? this.blogInfo.websiteConfig.websiteName : "个人博客";
      // 抓取一言API
      fetch("https://v1.hitokoto.cn?")
          .then(res => {
            return res.json();    // 接收json格式
          })
          .then(({hitokoto}) => {
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
    // 查询说说
    listHomeTalks() {
      this.getRequest("/home/talks").then(res => {
        this.talkList = res.data.data;
      });
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
        return this.$store.state.blogInfo.websiteConfig.socialUrlList.indexOf(contactType) != -1;
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
    },
    // 奇偶判断，分成左右
    isRight() {
      return function (index) {
        return index % 2 == 0 ? "article-cover left-radius" : "article-cover right-radius";
      };
    },
  },
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

/*一言闪烁光标*/
.typing-cursor {
  opacity: 1;
  animation: blink 1.3s infinite;
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
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
/*PC端*/
@media (min-width: 960px) {
  /*博主*/
  .blog-title {
    font-size: 2.5rem;
  }
  /*一言*/
  .blog-intro {
    font-size: 1.5rem;
  }
  /*联系方式*/
  .blog-contact {
    display: none;
  }
  /*主体内容*/
  .home-container {
    max-width: 1200px;
    margin: calc(100vh - 48px) auto 28px auto;
    padding: 0 5px;
  }
  /*文章卡片*/
  .article-card {
    display: flex;
    align-items: center;
    height: 200px;
    width: 100%;
    margin-top: 20px;
  }
  /*放在卡片上时，图片放大*/
  .article-card:hover .on-hover {
    transform: scale(1.1);
  }
  /*默认过渡*/
  .on-hover {
    transition: all .6s;
  }
  /*文章图片*/
  .article-cover {
    overflow: hidden;
    height: 100%;
    width: 50%;
  }
  /*文章内容*/
  .article-wrapper {
    padding: 0 2.5rem;
    width: 55%;
  }
  .article-wrapper a {
    transition: all .3s;
  }
}

.left-radius {
  border-radius: 8px 0 0 8px !important;
  order: 0;
}
.right-radius {
  border-radius: 0 8px 8px 0 !important;
  order: 1;
}

/*悬浮在超链接上时*/
.article-wrapper a:hover {
  color: #8e8cd8;
}
/*文章内容*/
.article-content {
  line-height: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  color: grey;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

</style>