<template>
  <div>
    <!--    封面及文章信息-->
    <div
        class="banner"
        :style="articleBanner"
    >
      <!--      文章信息-->
      <div class="article-info-container">
        <!--        标题-->
        <div class="article-title">
          {{ article.articleTitle }}
        </div>
        <!--        详细信息-->
        <div class="article-info">
          <!--          第一行：日期|更新时间|分类-->
          <div class="first-line">
            <!--            发表时间-->
            <span>
              <i class="iconfont icon-rili"/>
              发表于 {{ article.createTime | date }}
            </span>
            <span class="separator"> | </span>

            <!--            更新时间-->
            <span>
              <i class="iconfont icon-gengxinshijian"/> 更新于
              <span v-if="article.updateTime">
                {{ article.updateTime | date }}
              </span>
              <span v-else>
                {{ article.createTime | date }}
              </span>
              <span class="separator"> | </span>
            </span>

            <!--            文章分类-->
            <span class="article-category">
              <i class="iconfont icon-fenlei1"/>
              <router-link :to="'/categories/' + article.categoryId">
                {{ article.categoryName }}
              </router-link>
            </span>
          </div>
<!--          第二行：阅读时间-->
          <div class="second-line">
            <!--            字数统计-->
            <span>
              <i class="iconfont icon-shuzishuru"/>
              字数统计：{{ wordNum | num }}
              <span class="separator"> | </span>
            </span>
<!--            阅读时长-->
            <span>
              <i class="iconfont icon-shijian"/>
              阅读时长:：{{ readTime }}
            </span>
          </div>
<!--          第三行：-->
          <div class="third-line">
            <span class="separator"> | </span>
<!--            阅读量-->
            <span>
              <i class="iconfont icon-liulan"/>
              阅读量：{{ article.viewsCount }}
            </span>
            <span class="separator"> | </span>
            <span>
              <i class="iconfont icon-pinglunxiao"/>
              评论数：{{ commentCount }}
            </span>
          </div>
        </div>

      </div>
    </div>
<!--    内容-->
    <v-row class="article-container">
<!--      这一列：移动设备占9格，默认占全部 -->
      <v-col
        :md="9"
        cols="12"
        >
<!--        文章内容卡片-->
        <v-card
          class="article-wrapper">
<!--          内容-->
          <div
              class="markdown-body article-content"
              v-html="article.articleContent"
              ref="article"
          />
<!--          版权-->
          <div class="article-copyright">
            <div>
              <span>文章作者：</span>
              <router-link to="/">
<!--                TODO 文章作者-->
                {{ this.$store.state.blogInfo.websiteConfig.websiteAuthor }}
              </router-link>
            </div>
            <div>
              <span>文章链接：</span>
              <a :href="articleHref" target="_blank">{{ articleHref }}</a>
            </div>
            <div>
              <span>版权声明：</span>本博客所有文章除特别声明外，均采用
              <a
                  href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
                  target="_blank"
              >
                CC BY-NC-SA 4.0
              </a>
              许可协议。转载请注明文章出处。
            </div>
          </div>

<!--          转发-->
          <div class="d-flex align-center mt-4">
            <div class="tag-container">
              <router-link
                v-for="tagDto of article.tagDTOList"
                :key="tagDto.id"
                :to="'/tags/' + tagDto.id"
                >
                {{ tagDto.tagName }}
              </router-link>
            </div>
            <share :config="shareConfig" class="ml-auto"></share>
          </div>

<!--          点赞-->
          <div class="d-flex align-center justify-center mt-5">
            <a :class="isLike" @click="doLike">
              <v-icon size="14" color="#fff">mdi-thumb-up</v-icon>
              点赞
              <span
                v-show="article.likeCount > 0"
              >
                {{ article.likeCount }}
              </span>
            </a>
            <v-dialog
                transition="dialog-bottom-transition"
                max-width="600"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    class="reward-btn"
                    v-on="on"
                    tile
                    color="blue"
                    v-if="blogInfo.websiteConfig.isReward == 1"
                >
                  <i class="iconfont icon-erweima"/> 打赏
                </v-btn>
              </template>
              <template v-slot:default="dialog">
                <v-card>
                  <v-toolbar
                      color="success"
                      dark
                  >感谢你的打赏</v-toolbar>
<!--               二维码   -->
                  <div class="reward-main">
                    <ul class="reward-all">
                      <li class="reward-item">
                        <img
                          class="reward-img"
                          :src="blogInfo.websiteConfig.weixinQRCode"
                          />
                        <div class="reward-desc">微信</div>
                      </li>
                      <li class="reward-item">
                        <img
                            class="reward-img"
                            :src="blogInfo.websiteConfig.alipayQRCode"
                        />
                        <div class="reward-desc">支付宝</div>
                      </li>
                    </ul>
                  </div>
                  <v-card-actions class="justify-end">
                    <v-btn
                        text
                        @click="dialog.value = false"
                    >关闭</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </div>
<!--          上下篇-->
          <div class="pagination-post">
            <!-- 上一篇 -->
            <div
                :class="isFull(article.lastArticle.id)"
                v-if="article.lastArticle.id"
            >
              <router-link :to="'/articles/' + article.lastArticle.id">
                <img
                    class="post-cover"
                    :src="article.lastArticle.articleCover"
                />
                <div class="post-info">
                  <div class="label">上一篇</div>
                  <div class="post-title">
                    {{ article.lastArticle.articleTitle }}
                  </div>
                </div>
              </router-link>
            </div>
            <!-- 下一篇 -->
            <div
                :class="isFull(article.nextArticle.id)"
                v-if="article.nextArticle.id"
            >
              <router-link :to="'/articles/' + article.nextArticle.id">
                <img
                    class="post-cover"
                    :src="article.nextArticle.articleCover"
                />
                <div class="post-info" style="text-align: right">
                  <div class="label">下一篇</div>
                  <div class="post-title">
                    {{ article.nextArticle.articleTitle }}
                  </div>
                </div>
              </router-link>
            </div>
          </div>
          <!--            推荐列表：推荐相同tag的-->
          <div
              class="recommend-container mt-10"
              v-if="article.recommendArticleList.length"
          >
            <!--              标题-->
            <div class="recommend-title">
              <v-icon
                  size="20"
                  color="#4c4948"
              >
                mdi-thumb-up
              </v-icon>
              相关推荐
            </div>
            <div class="recommend-list">
<!--                文章-->
              <div
                class="recommend-item"
                v-for="(articleDTO, index) of article.recommendArticleList"
                :key="index"
                >
                <router-link
                  :to="'/articles/' + articleDTO.id"
                  >
                  <img class="recommend-cover" :src="articleDTO.articleCover"/>
                  <div class="recommend-info">
                    <div class="recommend-date">
                      <i class="iconfont icon-rili"/>
                      {{ articleDTO.createTime | date }}
                    </div>
                    <div>{{ articleDTO.articleTitle }}</div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

<!--      侧边功能-->
      <v-col
        :cols="12"
        :md="3"
        class="d-md-block d-none"
        >
<!--        sticky 侧边栏-->
        <div
          style="position: sticky; top: 20px;"
          >
<!--                    文章目录-->
          <v-card class="right-container">
            <div class="right-title">
              <i class="iconfont icon-fenlei1" style="font-size: 16.8px"/>
              <span style="margin-left: 10px">目录</span>
            </div>
            <v-card>
              <div id="toc"/>
            </v-card>
          </v-card>
<!--          最新文章-->
          <v-card class="right-container" style="margin-top: 20px;">
            <div class="right-title">
              <i class="iconfont icon-gengxinshijian" style="font-size: 16.8px"/>
              <span style="margin-left: 10px;">最新文章</span>
            </div>
            <div class="article-list">
              <div
                  class="article-item"
                  v-for="(newArticle, index) of article.newestArticleList"
                  @click="this.$router.push('/articles/' + newArticle.articleId)"
                  :key="index"
                  >
                <router-link
                    :to="'/articles/' + newArticle.id"
                    class="content-cover">
                  <img :src="newArticle.articleCover"/>
                </router-link>
                <div class="content">
                  <div class="content-title">
                    <router-link :to="'/articles/' + newArticle.id">
                      {{ newArticle.articleTitle }}
                    </router-link>
                  </div>
                  <div class="content-time">{{ newArticle.createTime | date }}</div>
                </div>
              </div>
            </div>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Clipboard from "clipboard";  // 复制文本
import tocbot from "tocbot";        // 目录生成
export default {
  created() {
    this.getCurArticle();
  },
  mounted() {
  },
  destroyed() {
    this.clipboard.destroy();
    tocbot.destroy();
  },
  data() {
    return {
      // 展开打赏页
      expand: false,
      // vue-share-config
      shareConfig: {
        sites: ["weibo", "qq", "wechat", "qzone", "douban", "twitter", "facebook"],
      },
      // 文章链接
      articleHref: location.href,
      // 大概的阅读时间
      readTime: "1分钟",
      // 文章字数
      wordNum: 0,
      // 剪切板模块 用于再destory时销毁
      clipboard: null,
      // 评论数
      commentCount: 0,
      // 文章对象
      article: {
        // 上一篇
        lastArticle: {
          id: 0,
          articleCover: "",
          articleTitle: ""
        },
        // 下一篇
        nextArticle: {
          id: 0,
          articleCover: "",
          articleTitle: ""
        },
        // 推荐文章集合
        recommendArticleList: [],
        // 最新的文章集合
        newestArticleList: [],
        //文章id
        id: this.$route.params.articleId,
        // 文章封面
        articleCover: "",
        // 文章标题
        articleTitle: "",
        // 文章内容
        articleContent: "",
        // 文章分类
        categoryName: "",
        // 分类ID
        categoryId: null,
        // 文章标签
        tagNameList: [],
        // 文章类型 1.原创 2.转载 3.翻译
        type: 1,
        // 文章状态 1.公开 2.私密 3.草稿
        status: 1,
        // 原文链接
        originUrl: "",
        // 是否置顶
        isTop: 0,
        // 创建时间
        createTime: "",
        // 更新时间
        updateTime: "",
        // 阅读量
        viewsCount: 0,
        // 点赞量
        likeCount: 0
      },
    }
  },
  methods: {
    // 是否占满
    isFull(exist) {
      return exist ? "post full" : "post";
    },
    // 处理点赞
    doLike() {
      if (!this.$store.state.userId) {
        // 未登录
        this.$toast.warning("你还没有登录呢");
        this.$store.state.loginFlag = true;
        return false;
      }

      this.postRequest("/articles/" + this.article.id + "/like").then(res => {
        if (res.data.flag) {
          if (this.$store.state.articleLikeSet.indexOf(this.article.id) != -1) {
            // 取消点赞
            this.$set(this.article, "likeCount", this.article.likeCount - 1);
          } else {
            // 确认点赞
            this.$set(this.article, "likeCount", this.article.likeCount + 1);
          }

          this.$store.state.articleLikeSet.push(this.article.id)
        }
      })
    },
    // 获取当前地址的文章
    getCurArticle() {
      this.getRequest("/articles/" + this.$route.params.articleId).then(res => {
        if (res.data.flag) {
          // 修改网页标签
          document.title = res.data.data.articleTitle;
          // markdown转换
          this.markdownToHtml(res.data.data);
          // 得到数据后 nextTick渲染
          this.$nextTick(() => {
            // 统计字数
            this.wordNum = this.deleteHtmlTag(this.article.articleContent).length;
            // 计算阅读时间
            this.readTime = Math.round(this.wordNum / 400) + "分钟";
            // 添加代码复制
            this.clipboard = new Clipboard(".copy-btn");
            this.clipboard.on("success", () => {
              this.$toast.success("复制代码成功！")
            })
            this.clipboard.on("error", () => {
              this.$toast.error("复制代码失败！")
            })

            // tocbot需要给对应的标签加上id，才能实现跳转，这也是为什么使用了nextTick
            let doms = this.$refs.article.children;
            if (doms.length) {
              for (let index = 0; index < doms.length; index++) {
                let reg = /^H[1-4]{1}$/;
                // 如果是h标签，则加上id属性，值为index
                if (reg.exec(doms[index].tagName)) {
                  doms[index].id = index;
                }
              }
            }

            // tocbot 实现目录效果，需在dom流成型之后init
            tocbot.init({
              tocSelector: "#toc", // 目录绑定的dom元素
              contentSelector: ".article-content", // 需要监听的内容dom
              headingSelector: "h1, h2, h3, h4",  // 内容映射匹配的dom
              hasInnerContainers: true,
              smoothScrolling: true,
              scrollSmoothness: 0.2,
              onClick: (event) => {
                // 防止刷新页面跳转
                event.preventDefault();
              }
            });
          })
        } else {
          this.$toast.error("文章查询失败！");
        }
      })
    },
    // 得到删除HTML标签后的字符串
    deleteHtmlTag(content) {
      return content
          .replace(/<\/?[^>]*>/g, "") //去除HTML tag
          .replace(/[|]*\n/, "")      //去除行尾空格
          .replace(/&npsp;/gi, "");   //去掉&npsp;
    },
    // 文章内容转换html，同时自动处理markdown以及代码高亮
    markdownToHtml(article) {
      const MarkdownIt = require("markdown-it");
      const hljs = require("highlight.js");
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
        highlight: function(str, lang) {
          // 当前时间加随机数生成唯一的id标识
          var d = new Date().getTime();
          if (
              window.performance &&
              typeof window.performance.now === "function"
          ) {
            d += performance.now();
          }
          const unicode = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
              /[xy]/g,
              function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
              }
          );
          // 复制功能主要使用的是 clipboard.js
          let copyBtnHtml = `<button class="copy-btn iconfont icon-fuzhi" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${unicode}"></button>`;

          // 生成行号
          const linesLength = str.split(/\n/).length - 1;
          let linesNumberSpan = '<span aria-hidden="true" class="line-numbers-rows">';
          for (let index = 0; index < linesLength; index++) {
            linesNumberSpan = linesNumberSpan + "<span></span>";
          }
          linesNumberSpan += "</span>";

          // highlight.js 高亮代码
          if (lang == null) {
            lang = "java";
          }
          if (lang && hljs.getLanguage(lang)) {
            // hljs 渲染一次代码
            const preCode = hljs.highlight(lang, str, true).value;

            // 将渲染好的html代码拼接到button上
            copyBtnHtml = copyBtnHtml + preCode;
            if (linesLength) {
              copyBtnHtml += '<b class="name">' + lang + "</b>";
            }

            // 将代码包裹在 textarea 中，加上id以便通过 clipboard js复制
            return `<pre class="hljs"><code>${copyBtnHtml}</code>${linesNumberSpan}</pre><textarea style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;" id="copy${unicode}">${str.replace(/<\/textarea>/g, "</textarea>")}</textarea>`;
          }
        }
      }).use(require("markdown-it-mark"));

      // 重新设置内容
      article.articleContent = md.render(article.articleContent);
      this.article = article;
    },
  },
  computed: {
    // banner图样式
    articleBanner() {
      return "background: url(" + this.article.articleCover + ") center center / cover no-repeat";
    },
    // bloginfo
    blogInfo() {
      return this.$store.state.blogInfo;
    },
    // 点赞按钮样式
    isLike() {
      let likeSet = this.$store.state.articleLikeSet;
      let flag = likeSet.indexOf(this.article.id) == -1;
      return flag ? "like-btn" : "like-btn-active";
    },
  }

}
</script>

<style scoped>
/*给底图上阴影*/
.banner:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, .5);
}

/*PC端*/
@media (min-width: 960px) {
  /*banner div中的所有文字颜色均为白色*/
  .banner {
    color: #eee !important;
  }
  /*文章信息容器*/
  .article-info-container {
    position: absolute;
    bottom: 6.25rem;

    padding: 0 8%;
    width: 100%;
    text-align: center;
  }
  /*文章标题*/
  .article-title {
    font-size: 35px;
    margin: 20px 0 8px;
  }
  /*将第二行和第三行合并为一行*/
  .second-line,
  .third-line {
    display: inline;
  }
  .article-info span {
    font-size: 95%;
  }
  /*上下叶*/
  .pagination-post {
    display: flex;
  }
  .post {
    width: 50%;
  }
  /*推荐文章*/
  .recommend-item {
    position: relative;
    display: inline-block;
    overflow: hidden;
    margin: 3px;

    width: calc(33% - 6px);
    height: 200px;

    background-color: #000;
    vertical-align: center;
  }

}
/*==========移动端===========*/
@media (max-width: 959px) {
  .banner {
    color: #eee !important;
    height: 360px;
  }
  .article-info-container {
    position: absolute;
    bottom: 1.3rem;
    width: 100%;
    color: #eee;
    text-align: left;
    padding: 0 3%;
  }
  .article-title {
    font-size: 1.7rem;
    margin-bottom: .4rem;
  }
  .article-info {
    font-size: 90%;
  }
  /*删掉第三行第一个分隔符*/
  .separator:first-child {
    display: none;
  }
  .pagination-post {
    display: block;
  }
  .post {
    width: 100% ;
  }
  .recommend-item {
    position: relative;
    display: inline-block;
    overflow: hidden;
    margin: 3px;

    width: calc(100% - 4px);

    height: 150px;
    margin: 2px;
    background: #000;

  }
}
/*分类颜色*/
.article-category a {
  color: #eee !important;
}

/*右侧容器*/
.right-container {
  padding: 20px 24px;
  font-size: 14px;
}
/*容器内标题*/
.right-title {
  display: flex;
  align-items: center;

  line-height: 2;
  font-size: 16.8px;
  margin-bottom: 6px;
}
.right-title i {
  font-weight: bold;
}
/*其他文章*/
.article-item {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 12px;

  transition: all .3s;
  cursor: pointer;
}
.article-item:hover {
  background-color: #eee;
}
.article-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/*缩略图*/
.content-cover {
  width: 59px;
  height: 59px;
  overflow: hidden;
}
/*缩略图侧边内容*/
.content {
  /*填充剩余的内容*/
  flex: 1;
  padding-left: 10px;
}
.content-title {
  /*只显示一行，*/
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bolder;
}
.content-title a {
  transition: all .3s;
}
.content-title a:hover {
  color: #2ba1d1;
}
.content-time {
  color: #858585;
  font-size: 85%;
  line-height: 2;
}
/*版权*/
.article-copyright {
  position: relative;
  margin-top: 40px;
  margin-bottom: 10px;

  font-size: .875rem;
  line-height: 2;
  padding: 0.625rem 1rem;
  border: 1px solid #eee;
}
.article-copyright span {
  color: #49b1f5;
  font-weight: bold;
}
.article-copyright a {
  text-decoration: underline !important;
  color: #99a9bf !important;
}
.article-copyright:before {
  content: "";
  position: absolute;
  top: .7rem;
  right: .7rem;

  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  background-color: #49b1f5;
}
/*点赞按钮*/
.like-btn {
  display: inline-block;
  background-color: #969696;
  width: 100px;
  color: #fff !important;
  text-align: center;
  line-height: 36px;
  font-size: .875rem;
}
.like-btn-active {
  display: inline-block;
  width: 100px;
  background-color: #ec7259;
  color: #fff !important;
  text-align: center;
  line-height: 36px;
  font-size: .875rem;
}
/*打赏*/
.reward-btn {
  width: 100px;
  background-color: #49b1f5;
  margin: 0 1rem;
  color: #fff !important;
  text-align: center;
  line-height: 36px;
  font-size: .875rem;
}
/*打赏容器*/
.reward-all {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
}
.reward-item {
  display: inline-block;
  padding: 0 8px;
  list-style-type: none;
}
.reward-img {
  width: 130px;
  height: 130px;
  display: block;
}
.reward-desc {
  margin: -5px 0;
  color: #858585;
  text-align: center;
}
/*标签*/
.tag-container a {
  display: inline-block;
  margin: .5rem .5rem .5rem 0;
  padding: 0 .75rem;
  width: fit-content;
  border: 1px solid #49b1f5;
  border-radius: 1rem;
  color: #49b1f5 !important;
  font-size: 12px;
  line-height: 2;
}
.tag-container a:hover {
  color: #fff !important;
  background: #49b1f5;
  transition: all 0.5s;
}
/*上下文章*/
.pagination-post {
  margin-top: 40px;
  overflow: hidden;
  width: 100%;
  /*上阴影*/
  background-color: #000;
}
.post {
  position: relative;
  height: 150px;
}
.post.full {
  width: 100% !important;
}
.post-cover {
  position: relative;
  width: 100%;
  height: 100%;
  opacity: .4;
  transition: all .3s;

  object-fit: cover;
}
.post-info {
  position: absolute;
  top: 50%;
  padding: 20px 40px;
  width: 100%;
  transform: translate(0, -50%);
  line-height: 2;
  font-size: 14px;
}
.post a {
  position: relative;
  display: block;
  overflow: hidden;
  height: 150px;
}
.post:hover .post-cover {
  opacity: .8;
  transform: scale(1.1);
}
.label {
  font-size: 90%;
  color: #eee;
}
.post-title {
  font-weight: 500;
  color: #fff;
}
/*推荐文章*/
.recommend-cover {
  width: 100%;
  height: 100%;
  opacity: .4;
  transition: all .6s;
  object-fit: cover;
}
.recommend-title {
  margin-left: 10px;
  line-height: 2;
  font-size: 16.8px;
  margin-bottom: 6px;
}
.recommend-info {
  line-height: 2;
  color: #fff;

  /*文字居中*/
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);

  width: 100%;
  padding: 0 20px;

  text-align: center;
  font-size: 14px;
}
.recommend-date {
  font-size: 90%;
}
.recommend-item:hover .recommend-cover {
  opacity: .8;
  transform: scale(1.1);
}

</style>


<style lang="scss">
//代码高亮样式
pre.hljs {
  padding: 12px 2px 12px 40px !important;
  border-radius: 5px !important;
  position: relative;
  font-size: 14px !important;
  line-height: 22px !important;
  overflow: hidden !important;
  &
  code {
    display: block !important;
    margin: 0 10px !important;
    overflow-x: auto !important;
    &::-webkit-scrollbar {
      z-index: 11;
      width: 6px;
    }
    &::-webkit-scrollbar:horizontal {
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      width: 6px;
      background: #666;
    }
    &::-webkit-scrollbar-corner,
    &::-webkit-scrollbar-track {
      background: #1e1e1e;
    }
    &::-webkit-scrollbar-track-piece {
      background: #1e1e1e;
      width: 6px;
    }
  }
  .line-numbers-rows {
    position: absolute;
    pointer-events: none;
    top: 12px;
    bottom: 12px;
    left: 0;
    font-size: 100%;
    width: 40px;
    text-align: center;
    letter-spacing: -1px;
    border-right: 1px solid rgba(0, 0, 0, 0.66);
    user-select: none;
    counter-reset: linenumber;
    span {
      pointer-events: none;
      display: block;
      counter-increment: linenumber;
      &:before {
        content: counter(linenumber);
        color: #999;
        display: block;
        text-align: center;
      }
    }
  }
  b.name {
    position: absolute;
    top: 7px;
    right: 45px;
    z-index: 1;
    color: #999;
    pointer-events: none;
  }
  .copy-btn {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 1;
    color: #ccc;
    background-color: #525252;
    border-radius: 6px;
    display: none;
    font-size: 14px;
    width: 32px;
    height: 24px;
    outline: none;
  }
}
pre:hover .copy-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
