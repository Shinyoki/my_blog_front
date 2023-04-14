<template>
  <div>
    <div class="banner" :style="cover">
      <h1 class="banner-title">{{ $vuetify.lang.t('$vuetify.分类') }}</h1>
    </div>
    <v-card class="blog-container">
      <v-card-subtitle class="text-center font-weight-black" style="font-size: 2rem">{{ $vuetify.lang.t('$vuetify.总计分类数量：') }}{{
          count
        }}
      </v-card-subtitle>
      <v-card-text>
        <ul class="category-list mt-4">
          <li
              class="category-list-item"
              v-for="item of categoryList"
              :key="item.id"
          >
            <router-link :to="'/categories/' + item.id">
              {{ item.categoryName }}
              <span class="category-count">({{ item.articlesCount }})</span>
            </router-link>
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'CategoryView',
  created() {
    this.listCategories();
  },
  mounted() {
  },
  data() {
    return {
      categoryList: null,
      count: 0
    }
  },
  methods: {
    listCategories() {
      this.getRequest("/categories").then(res => {
        if (res.data.flag) {
          this.categoryList = res.data.data.recordList;
          this.count = res.data.data.count;
          console.log(this.categoryList)
        }
      })
    },
  },
  computed: {
    cover() {
      var cover = "";
      this.$store.state.blogInfo.pageList.forEach(item => {
        if (item.pageLabel == "category") {
          cover = item.pageCover;
        }
      });
      return "background: url(" + cover + ") center center / cover no-repeat";

    },
  },
}
</script>

<style scoped>
.category-list {
  margin: 0 1.8rem;
  list-style: none;
}
.category-list-item {
  padding: 8px 1.8rem 8px 0;
}
.category-list-item:before {
  display: inline-block;
  position: relative;
  left: -0.75rem;
  width: 12px;
  height: 12px;
  border: 0.2rem solid #49b1f5;
  border-radius: 50%;
  background: #fff;
  content: "";
  transition-duration: 0.3s;
}
.category-list-item:hover:before {
  border: 0.2rem solid #ff7242;
}
.category-list-item a:hover {
  transition: all 0.3s;
  color: #8e8cd8;
}
.category-list-item a:not(:hover) {
  transition: all 0.3s;
}
.category-count {
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: #858585;
}
</style>