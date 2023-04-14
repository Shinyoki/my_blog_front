<template>
  <div>
    <!--    banner-->
    <div class="home-banner" :style="bannerCoverStyle">
      <!--      container-->
      <div class="banner-container">
        <!--        联系方式-->
        <h1 class="animate__zoomIn">
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
            class="animate__animated animate__zoomIn"
            v-if="talkList.length > 0"
        >
          <Swiper :list="talkList"></Swiper>
        </v-card>
        <!--        文章流-->
        <v-card
            class="animate__animated animate__zoomIn article-card"
            style="border-radius: 12px 8px 8px 12px"
            v-for="(article, index) of articleList"
            :key="index"
        >
          <!--          文章封面-->
          <div :class="isRight(index)">
            <router-link
                :to="'/articles/' + article.id">
              <v-img
                  class="article-img"
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
                  <i class="iconfont icon-zhiding"/> {{ $vuetify.lang.t('$vuetify.置顶') }}
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
          <div slot="no-more" class="mt-7">{{ $vuetify.lang.t('$vuetify.没有更多文章了捏~') }}</div>
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
          <!--            卡片一：博主-->
          <v-card
              class="animate__animated animate__zoomIn blog-card mt-5">
<!--            博主信息-->
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
<!--            博客信息-->
            <div class="blog-info-wrapper">
              <div class="blog-info-data">
                <div style="font-size: .875rem">{{ $vuetify.lang.t('$vuetify.文章') }}</div>
                <div style="font-size: 1.25rem">{{ blogInfo.articleCount }}</div>
              </div>
              <div class="blog-info-data">
                <router-link to="/categories">
                  <div style="font-size: .875rem">{{ $vuetify.lang.t('$vuetify.分类') }}</div>
                  <div style="font-size: 1.25rem">{{ blogInfo.categoryCount }}</div>
                </router-link>
              </div>
              <div class="blog-info-data">
                <router-link to="/tags">
                  <div style="font-size: 0.875rem">{{ $vuetify.lang.t('$vuetify.标签') }}</div>
                  <div style="font-size: 1.25rem">{{ blogInfo.tagCount }}</div>
                </router-link>
              </div>
            </div>
<!--            收藏按钮-->
            <a class="collection-btn" @click="showTip = true">
              <v-icon
                color="#fff"
                size="18"
                class="mr-1"
                >mdi-bookmark</v-icon>
                {{ $vuetify.lang.t('$vuetify.加入书签') }}
            </a>
<!--            社交-->
            <div class="card-info-social">
              <a
                v-if="isShowSocialContact('qq')"
                class="mr-5 iconfont icon-QQ"
                target="_blank"
                href="/"/>
              <a
                  v-if="isShowSocialContact('gitee')"
                  class="mr-5 iconfont icon-gitee"
                  target="_blank"
                  href="/"/>
              <a
                  v-if="isShowSocialContact('github')"
                  class="mr-5 iconfont icon-github"
                  target="_blank"
                  href="/"/>
            </div>
          </v-card>
          <v-card
            class="mt-5 animate__animated animate__zoomIn blog-card big"
            >
            <div class="web-info-title">
              <v-icon
                size="18"
                >mdi-bell</v-icon>
                {{ $vuetify.lang.t('$vuetify.公告') }}
            </div>
            <div style="font-size: .875rem">
              {{ blogInfo.websiteConfig.websiteNotice }}
            </div>
          </v-card>
          <v-card
            class="animate__animated animate__zoomIn mt-5 blog-card">
            <div class="web-info-title">
              <v-icon size="18">
                mdi-chart-line
              </v-icon>
              {{ $vuetify.lang.t('$vuetify.网站资讯') }} 
            </div>
            <div class="web-info">
              <div style="padding: 4px 0 0">
                {{ $vuetify.lang.t('$vuetify.运行时间：') }}<span class="float-right">{{ time }}</span>
              </div>
              <div style="padding: 4px 0 0">
                {{ $vuetify.lang.t('$vuetify.总访问量：') }}<span class="float-right">{{ blogInfo.viewsCount }}</span>
              </div>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>
    <v-snackbar
        v-model="showTip"
        top
        color="#49b1f5"
        :timeout="3000"
    >{{ $vuetify.lang.t('$vuetify.按CTRL+D 键将本页加入书签') }}</v-snackbar>
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
      size: 10,
      showTip: false,
      time: ""
    }
  },
  created() {
    this.init();
    this.listHomeTalks();
    setInterval(() => {
      this.runTime();
    }, 1000);
  },
  methods: {
    // 网站时间
    runTime() {
      // 时间相隔
      let oldTime = new Date().getTime() - new Date(this.blogInfo.websiteConfig.websiteCreateTime).getTime();
      let msPerDay = 24 * 60 * 60 * 1000;
      let oldDays = Math.floor(oldTime / msPerDay);
      let str = "";
      let now = new Date();
      str = oldDays + "天";
      str += now.getHours() + "时";
      str += now.getMinutes() + "分";
      str += now.getSeconds() + "秒";
      this.time = str;
    },
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
        return this.$store.state.blogInfo.websiteConfig.socialUrlList[0].indexOf(contactType) != -1;
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
    height: 250px;
    width: 100%;
    margin-top: 20px;
  }

  /*放在卡片上时，图片放大*/
  .article-card:hover .article-img {
    transform: scale(1.1);
  }

  /*默认过渡*/
  .article-img {
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

/*移动端*/
@media (max-width: 959px) {
  .blog-title {
    font-size: 26px;
  }

  .blog-contact {
    font-size: 1.25rem;
    line-height: 2;
  }

  .home-container {
    width: 100%;
    margin: calc(100vh - 66px) auto 0 auto;
  }

  .article-card {
    margin-top: 1rem;
    border-radius: 4px;
    overflow: hidden;
  }

  .article-cover {
    height: 230px;
    width: 100%;
  }

  .article-wrapper {
    padding: 1.25rem 1.25rem 1.875rem;
  }

  .article-wrapper a {
    font-size: 1.25rem;
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

/*文章详情*/
.article-info {
  font-size: 95%;
  line-height: 2;
  margin: .375rem 0;
}

.article-info a {
  font-size: 95%;
  color: #858585 !important;
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

/*侧边博客信息*/
.blog-wrapper {
  position: sticky;
  top: 10px;
}
/*博客卡片*/
.blog-card {
  line-height: 2 !important;
  padding: 1.25rem 1.5rem !important;
}
/*作者*/
.author-wrapper {
  text-align: center;
}
.author-avatar {
  transition: all .4s ease-in-out;
}
.author-avatar:hover {
  transform: scale(1.1);
}
/*博客信息*/
.blog-info-wrapper {
  display: flex;
  justify-content: space-between;
  padding: .875rem 0;
}
.blog-info-data div:nth-child(2) {
  text-align: center;
  font-weight: bold;
}
/*收藏按钮*/
.collection-btn {
  z-index: 1;
  background: #49b1f5;
  color: #fff !important;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  position: relative;
  display: block;
  text-align: center;
  transition-duration: 1s;
  transition-property: color;
}
.collection-btn:before {
  z-index: -1;
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #ff7242;

  transition-timing-function: ease-out;
  transition-duration: .5s;
  transition-property: transform;
  transform: scaleX(0);
  transform-origin: 0 50%;
}
.collection-btn:hover:before {
  transition-timing-function: cubic-bezier(.45, 1.64, .47, .66);
  transform: scaleX(1);
}
/*联系*/
.card-info-social {
  line-height: 40px;
  text-align: center;
  margin: 6px 0 -6px;
}
.card-info-social a {
  font-size: 1.5rem;
}
</style>