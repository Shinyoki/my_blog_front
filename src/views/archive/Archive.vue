<template>
  <div>
    <!--   banner-->
    <div class="banner" :style="cover">
      <h1 class="banner-title">{{ $vuetify.lang.t('$vuetify.归档') }}</h1>
    </div>
    <v-card class="blog-container">
      <v-card-subtitle class="text-h3 text-center" style="">
        {{ $vuetify.lang.t('$vuetify.归档') }}
      </v-card-subtitle>
      <v-divider/>
      <v-timeline
          align-top
          :dense="$vuetify.breakpoint.smAndDown"
      >
        <v-timeline-item
            :class="isLeft(i)"
            v-for="(item, i) in archiveList"
            :key="i"
            :color="colors[i % 10]"
            :icon="emoji[i % 10]"
            fill-dot
        >
          <v-card
              :color="colors[i % 10]"
              v-ripple="{class: `white--text`}"
              dark
          >
            <router-link :to="`/articles/` + item.id" class="white--text">
              <v-card-title class="text-h6">
                {{ item.articleTitle }}
              </v-card-title>
              <v-card-text class="white text--primary font-weight-medium pt-3">
                {{ $vuetify.lang.t('$vuetify.发表时间：') }}{{ item.createTime | date }}
              </v-card-text>
            </router-link>
          </v-card>
        </v-timeline-item>
      </v-timeline>
      <v-divider/>
      <infinite-loading
        @infinite="infiniteHandler"
        >
        <div slot="no-more" class="mt-7">{{ $vuetify.lang.t('$vuetify.没有更多了捏') }}~</div>
        <div slot="no-results">{{ $vuetify.lang.t('$vuetify.没有更多了捏') }}~</div>
      </infinite-loading>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "ArchiveView",
  created() {
    window.document.title = this.$route.meta.title;
    this.listArchives();
  },
  data() {
    return {
      current: 0,
      count: 0,
      archiveList: [],
      colors: ['primary', 'secondary', 'info', 'success', 'warning', 'error'],
      // vuetify的图标集合
      emoji: ['mdi-emoticon', 'mdi-emoticon-cool', 'mdi-emoticon-tongue', 'mdi-emoticon-sad', 'mdi-emoticon-angry', 'mdi-emoticon-neutral', 'mdi-emoticon-happy',  'mdi-emoticon-angry-outline', 'mdi-emoticon-neutral-outline', 'mdi-emoticon-happy-outline', 'mdi-emoticon-wink-outline', 'mdi-emoticon-wink-wacky-outline', 'mdi-emoticon-tired-outline', 'mdi-emoticon-cool-outline', 'mdi-emoticon-sad-outline', 'mdi-emoticon-angry-outline', 'mdi-emoticon-neutral-outline', 'mdi-emoticon-happy-outline', 'mdi-emoticon-wink-outline', 'mdi-emoticon-wink-wacky-outline', 'mdi-emoticon-tired-outline', 'mdi-emoticon-cool-outline', 'mdi-emoticon-sad-outline', 'mdi-emoticon-angry-outline', 'mdi-emoticon-neutral-outline', 'mdi-emoticon-happy-outline', 'mdi-emoticon-wink-outline', 'mdi-emoticon-wink-wacky-outline', 'mdi-emoticon-tired-outline', 'mdi-emoticon-cool-outline', 'mdi-emoticon-sad-outline', 'mdi-emoticon-angry-outline', 'mdi-emoticon-neutral-outline', 'mdi-emoticon-happy-outline', 'mdi-emoticon-wink-outline', 'mdi-emoticon-wink-wacky-outline', 'mdi-emoticon-tired-outline', 'mdi-emoticon-cool-outline', 'mdi-emoticon-sad-outline', 'mdi-emoticon-angry-outline', 'mdi-emoticon-neutral-outline', 'mdi-emoticon-happy-outline', 'mdi-emoticon-wink-outline', 'mdi-emoticon-wink-wacky-outline', 'mdi-emoticon-tired-outline', 'mdi-emoticon-cool-outline']
    }
  },
  methods: {
    // 查询归档集合
    listArchives() {
      let params = {
        current: this.current,
        size: 10
      }
      this.getRequest("/articles/archives", params).then(res => {
        this.archiveList = res.data.data.recordList;
        this.current += res.data.data.recordList.length;
        this.count = res.data.data.count;
      })
    },
    // vue infinite loading
    infiniteHandler($state) {
      let params = {
        current: this.current,
        size: 10
      }

      this.getRequest("/articles/archives", params).then(res => {
        if (res.data.flag) {
          if (res.data.data.recordList.length > 0) {
            this.archiveList.push(...res.data.data.recordList);
            this.current += res.data.data.recordList.length;
            $state.loaded();
          } else {
            $state.complete();
          }
        } else {
          $state.complete();
        }

      })
    },
  },
  computed: {
    cover() {
      var cover = "";
      this.$store.state.blogInfo.pageList.forEach(item => {
        if (item.pageLabel == "archive") {
          cover = item.pageCover;
        }
      });
      return "background: url(" + cover + ") center center / cover no-repeat";
    },
    isLeft() {
      return function (index) {
        if (index % 2 == 0) {
          return "animate__animated animate__backInRight";
        } else {
          return "animate__animated animate__backInLeft";
        }
      };
    },
  },


}
</script>

<style scoped>

</style>