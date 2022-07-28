<template>
  <div>
    <div class="banner" :style="cover">
      <div class="banner-title">标签</div>
    </div>
    <v-card class="blog-container">
      <v-card-subtitle
          style="font-size: 3rem"
          class="text-center font-weight-bold"
      >标签 - {{ count }}
      </v-card-subtitle>
      <vue-word-cloud
          style="width: 100%; height: 400px"
          :color="chooseColor"
          :words="tagList"
          font-family="Roboto"
      >
        <template slot-scope="{text, weight, word}">
          <div :title="weight" style="cursor: pointer;" @click="onWordClick(word)">
            {{ text }}
          </div>
        </template>
      </vue-word-cloud>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'TagsView',
  created() {
    this.listTags();
  },
  mounted() {
  },
  data() {
    return {
      tagList: [],
      count: 0,
    }
  },
  methods: {
    onWordClick(world) {
      let path = `/tags/` + this.getTagId(world[0]);
      this.$router.push(path);
    },
    getTagId(world) {
      // console.log(this.tagList)
      let id = 0;
      this.tagList.forEach(tagList => {
        if (tagList[0] == world) {
          id = tagList[2];
        }
      })
      return id;
    },
    listTags() {
      this.getRequest("/tags").then(res => {
        if (res.data.flag) {
          let tags = res.data.data.recordList;
          tags.forEach(tagCountDTO => {
            let tagItem = [
              tagCountDTO.tagName,
              tagCountDTO.tagCount >= 30 ? 30 : tagCountDTO.tagCount,
              tagCountDTO.id
            ]
            this.tagList.push(tagItem);
          })
          this.count = res.data.data.count;
        }
      })
    },
  },
  computed: {

    chooseColor() {
      return function (arg, weight) {
        // 彩虹色
        return weight > 30 ? 'Green' : weight > 20 ? 'DeepPink' : weight > 10 ? 'RoyalBlue' : weight > 5 ? 'Indigo' : weight > 1 ? 'Orange' : 'Purple';
      }
    },
    cover() {
      let cover = "";
      this.$store.state.blogInfo.pageList.forEach(page => {
        if (page.pageLabel == "tag") {
          cover = page.pageCover;
        }
      })
      return "background: url(" + cover + ") center center / cover no-repeat";
    },
  },
}
</script>

<style scoped>

</style>