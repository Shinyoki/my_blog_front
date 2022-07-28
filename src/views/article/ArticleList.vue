<template>
  <div>
    <v-card
        tile
        class="banner"
        :style="cover"
    >
      <div class="banner-title">{{ name }} - {{ subName }}</div>
    </v-card>
    <div class="blog-container" style="max-width: 1300px">
      <v-row>
        <v-col
            md="4"
            cols="12"
            v-for="(article, index) of articleList"
            :key="index"
        >
          <v-card
              class="article-card animate__animated animate__fadeIn elevation-6"
              style="border-radius: 12px; overflow: hidden"
              min-width="400">
            <router-link
                :to="`/articles/` + article.id">
              <v-img
                  height="200px"
                  class="d-flex align-end on-hover"
                  :src="article.articleCover"
              >
                <v-card-title class="white--text inner-info">
                  <v-avatar size="56">
                    <img
                        alt="user"
                        :src="article.avatar"
                    >
                  </v-avatar>
                  <span class="ml-3 align-center">
                    {{ article.username }}
                  </span>
                </v-card-title>
              </v-img>
            </router-link>


            <v-card-text>
              <div style="font-size: 1.75rem" class="font-weight-bold ml-1 mb-2">
                {{ article.articleTitle }}
              </div>
              <di class="d-flex">
                <div class="ml-1 d-flex align-center">
                  <i class="iconfont icon-shijian"/>
                  {{ article.createTime | datetime}}
                </div>
                <router-link class="ml-auto font-weight-black"
                  :to="`/categories/` + article.categoryId">
                  <v-btn text  style="font-size: .9rem">
                    <v-icon>mdi-bookmark</v-icon>{{ article.categoryName }}
                  </v-btn>
                </router-link>
              </di>
            </v-card-text>

            <v-divider/>

            <v-card-actions>
              <router-link
                v-for="(tag, tagIndex) of article.tagDTOList"
                :key="tagIndex"
                :to="`/tags/` + tag.id"
                >
                <v-btn
                    color="primary"
                    rounded
                    outlined
                    small
                    class="ml-1"
                >
                  {{ tag.tagName }}
                </v-btn>
              </router-link>

            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <!-- 无限加载 -->
      <infinite-loading class="mt-15" @infinite="infiniteHandler">
        <div slot="no-results">没有更多内容了捏~</div>
        <div slot="no-more">没有更多内容了捏~</div>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleList',
  created() {
    this.id = this.$route.path.split("/")[1] == "tags" ? this.$route.params.tagId : this.$route.params.categoryId;
    this.name = this.$route.path.split("/")[1] == "tags" ? "标签" : "分类";
  },
  mounted() {
  },
  data() {
    return {
      mode: this.$route.path.split("/")[1], // tag / category
      name: null,
      id: null,
      current: 0,
      size: 10,
      articleList: [],
      subName: null,
    }
  },
  methods: {
    infiniteHandler($state) {
      let params = {
        current: this.current,
        size: this.size,
      }
      if (this.mode == "tags") {
        params.tagId = this.id;
      } else {
        params.categoryId = this.id;
      }
      this.getRequest("/articles/condition", params).then(res => {
        console.log(res.data)
        if (res.data.flag) {
          let pageName = res.data.data.name;
          if (pageName) {
            this.subName = pageName;
            document.title = this.name + " - " + pageName;
          }

          if (res.data.data.articlePreviewDTOList.length) {
            this.articleList.push(...res.data.data.articlePreviewDTOList);
            this.current += res.data.data.articlePreviewDTOList.length;
            $state.loaded();
          } else {
            $state.complete();
          }
        } else {
          $state.complete();
        }
      })
      $state.complete();
    },
  },
  computed: {
    cover() {
      let cover = "";
      this.$store.state.blogInfo.pageList.forEach(page => {
        if (page.pageLabel == "articleList") {
          cover = page.pageCover;
        }
      })
      return "background: url(" + cover + ") center center / cover no-repeat";
    },
  },
}
</script>

<style>
.on-hover:hover .v-image__image.v-image__image--cover {
  transition: all .3s;
  background-size: cover;
  background-position: bottom left !important;
}
.on-hover:not(:hover) .v-image__image.v-image__image--cover{
  transition: all .3s;
}
</style>