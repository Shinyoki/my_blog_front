<template>
  <!-- 搜索框 -->
  <v-dialog
    v-model="searchFlag"
    max-width="700"
    :fullscreen="isMobile"
  >

    <v-card class="search-wrapper" style="border-radius:4px">
      <div class="mb-3">
        <span class="search-title">{{ $vuetify.lang.t('$vuetify.文章搜索') }}</span>
        <!-- 关闭按钮 -->
        <v-icon class="float-right" @click="searchFlag = false">
          mdi-close
        </v-icon>
      </div>
      <!-- 输入框 -->
      <div class="search-input-wrapper">
        <v-icon>mdi-magnify</v-icon>
        <input v-model="keywords" placeholder="输入文章名称..." />
      </div>
      <!-- 搜索结果 -->
      <div class="search-result-wrapper">
        <hr class="divider" />
        <div class="article-search-container">
          <div v-if="articleList.length == 0">啥也没有...</div>
          <v-card
            elevation="2"
            class="mt-3 mb-5 grey pr-5 lighten-5 search-card"
            @click="closeAndGoto(article.id)"
            v-for="(article, idx) of articleList"
            :index="idx"
          >
              <v-row>
                <v-col
                  cols="8"
                >
                  <!--                左-->
                  <v-card-subtitle class="pt-2 pb-1" style="font-size: 1.2rem; font-weight: bold">{{ article.articleTitle }}</v-card-subtitle>
                  <p class="two-lines pl-4">{{article.articleContent}}</p>
                  <div></div>
                </v-col>
                <v-col
                  cols="4"
                >
                  <!--                右-->
                  <v-img
                    class="search-cover rounded-lg"
                    :src="article.articleCover"
                  ></v-img>
                </v-col>
              </v-row>
          </v-card>
        </div>
      </div>
    </v-card>

  </v-dialog>
</template>

<script>
export default {
  components: {},
  created() {
    let params = {
      keywords: "",
      current: 1
    };
    this.loading = true;
    this.getRequest("/articles", params).then(res => {
      if (res.data.flag) {
        this.articleList = res.data.data;
      } else {
        this.$toast.error(res.data.message);
      }
    }).finally(() => {
      this.loading = false;
    });
  },
  data: function() {
    return {
      loading: false,
      keywords: "",
      articleList: [],
      flag: false
    };
  },
  methods: {
    closeAndGoto(articleId) {
      this.$store.commit("switchSearchModel")
      this.$router.push({
        path: '/articles/' + articleId
      })
    }
  },
  computed: {
    searchFlag: {
      set(value) {
        this.$store.state.searchFlag = value;
      },
      get() {
        return this.$store.state.searchFlag;
      }
    },
    isMobile() {
      const clientWidth = document.documentElement.clientWidth;
      return clientWidth <= 960;

    }
  },
  watch: {
    keywords(value) {
      this.flag = value.trim() != "" ? true : false;
      let params = {
        keywords: value,
        current: 1
      };
      this.loading = true;
      this.getRequest("/articles", params).then(res => {
        console.log("结果", res);
        if (res.data.flag) {
          this.articleList = res.data.data;
        } else {
          this.$toast.error(res.data.message);
        }
      }).finally(() => {
        this.loading = false;
      });

    }
  }
};
</script>

<style scoped>
.search-wrapper {
    padding: 1.25rem;
    height: 100%;
    background: #fff !important;
}

.search-title {
    color: #f58b49;
    font-size: 1.25rem;
    line-height: 1;
}

.search-input-wrapper {
    display: flex;
    padding: 5px;
    height: 35px;
    width: 100%;
    border: 2px solid #8e8cd8;
    border-radius: 2rem;
}

.search-input-wrapper input {
    width: 100%;
    margin-left: 5px;
    outline: none;
}

@media (min-width: 960px) {
    .search-result-wrapper {
        /*padding-right: 5px;*/
        height: 450px;
        overflow: auto;
    }
}

@media (max-width: 959px) {
    .search-result-wrapper {
        height: calc(100vh - 110px);
        overflow: auto;
    }
}

.search-reslut a {
    color: #555;
    font-weight: bold;
    border-bottom: 1px solid #999;
    text-decoration: none;
}

.search-reslut-content {
    color: #555;
    cursor: pointer;
    border-bottom: 1px dashed #ccc;
    padding: 5px 0;
    line-height: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.divider {
    margin: 20px 0;
    border: 2px dashed #fdf3d2;
}

.article-search-container {
}
.two-lines {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.search-card {
    transition: all .3s;
}
.search-card:hover {
    font-size: larger;
    cursor: pointer;
}
.search-card .search-cover {
    transition: all .3s;
}
.search-card:hover .search-cover {
    transform: scale(1.1);
}
</style>
