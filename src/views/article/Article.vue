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
          <div
              class="markdown-body"
              v-html="article.articleContent"/>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import hljs from "highlight.js";    // 引入复制组件
export default {
  created() {
    this.getCurArticle();
  },
  destroyed() {
    this.clipboard.destroy();
  },
  data() {
    return {
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
        },
        // 下一篇
        nextArticle: {
          id: 0,
          articleCover: "",
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
    // 获取当前地址的文章
    getCurArticle() {
      this.getRequest("/articles/" + this.$route.params.articleId).then(res => {
        if (res.data.flag) {
          // 修改网页标签
          document.title = res.data.data.articleTitle;
          // markdown转换
          this.markdown2Html(res.data.data);
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
            // TODO 目录和图片预览
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
    markdown2Html(article) {
      const MarkdownIt = require("markdown-it");
      const hljs = require("highlight.js");
      const md = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true,
        breaks: true,
        highlight: function(str, lang) {
          // uid
          var d = new Date().getTime();
          if (
              window.performance &&
              typeof window.performance.now === "function"
          ) {
            d += performance.now();
          }
          const codeIndex = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
              /[xy]/g,
              function(c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
              }
          );
          // 复制功能主要使用的是 clipboard.js
          let copyBtnHtml = `<button class="copy-btn iconfont icon-fuzhi" type="button" data-clipboard-action="copy" data-clipboard-target="#copy${codeIndex}"></button>`;

          // 行号
          const linesLength = str.split(/\n/).length - 1;
          let linesNumerHtml = '<span aria-hidden="true" class="line-numbers-rows">';
          for (let index = 0; index < linesLength; index++) {
            linesNumerHtml = linesNumerHtml + "<span></span>";
          }
          linesNumerHtml += "</span>";

          // 渲染代码
          if (lang == null) {
            lang = "java";
          }
          if (lang && hljs.getLanguage(lang)) {
            // highlight.js 高亮代码
            const preCode = hljs.highlight(lang, str, true).value;

            console.log("hljs加工后的代码")
            console.log(preCode)

            copyBtnHtml = copyBtnHtml + preCode;
            if (linesLength) {
              copyBtnHtml += '<b class="name">' + lang + "</b>";
            }

            // 将代码包裹在 textarea 中隐藏，hljs加工好的代码和btn一同放进 code 中，clipbard复制的内容就在 #copy + uid中
            return `<pre class="hljs">
                        <code>${copyBtnHtml}</code>
                        ${linesNumerHtml}
                    </pre>
                    <textarea
                        style="position: absolute;top: -9999px;left: -9999px;z-index: -9999;"
                        id="copy${codeIndex}"
                        >${str.replace(/<\/textarea>/g, "</textarea>")}
                    </textarea>`;
          }
        }
      }).use(require("markdown-it-mark"));
      // 将markdown替换为html标签
      article.articleContent = md.render(article.articleContent);
      this.article = article;
    },
  },
  computed: {
    // banner图样式
    articleBanner() {
      return "background: url(" + this.article.articleCover + ") center center / cover no-repeat";
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
}
/*分类颜色*/
.article-category a {
  color: #eee !important;
}

</style>


<style lang="scss">
pre.hljs {
  padding: 12px 2px 12px 40px !important;
  border-radius: 5px !important;
  position: relative;
  font-size: 14px !important;
  line-height: 22px !important;
  overflow: hidden !important;

  &:hover .copy-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  code {
    display: block !important;
    //margin: 0 10px !important;
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
</style>


