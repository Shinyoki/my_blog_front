<template>
  <div>
<!--    封面-->
    <div
        class="banner"
        :style="articleBanner"
        >

    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getCurArticle();
  },
  data() {
    return {
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
        // 文章标签
        tagNameList: [],
        // 文章类型 1.原创 2.转载 3.翻译
        type: 1,
        // 文章状态 1.公开 2.私密 3.草稿
        status: 1,
        // 原文链接
        originUrl: "",
        // 是否置顶
        isTop: 0
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
          // markdown转换html
          this.markdown2Html(res.data.data.articleContent);
        } else {
          this.$toast.error("文章查询失败！");
        }
      })
    },
    // markdown转换html
    markdown2Html(articleContent) {
      const MarkDownIt = require("markdown-it");
      const HighlightCode = require("highlight.js");
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

</style>