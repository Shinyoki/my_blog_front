<template>
  <div>
    <div class="banner" :style="cover">
      <div class="banner-title">{{ $vuetify.lang.t('$vuetify.说说') }}</div>
    </div>
    <!--    内容-->
    <v-card class="blog-container">
      <v-hover
          class="talk-item"
          v-for="(talk,index) of talkList"
          :key="index"
          v-slot="{ hover }"
      >
        <router-link :to="`/talks/` + talk.id">
          <v-card
              :class="`elevation-${hover ? 14 : 4}`"
              class="talk-item mb-6 pa-4 d-flex"
          >
            <v-avatar
                size="36"
                class="user-avatar"
            >
              <img :src="talk.avatar"/>
            </v-avatar>
            <div class="user-details-wrapper grow ml-3">
              <div class="user-nickname font-weight-bold">
                {{ talk.nickname }}
                <v-icon class="user-sign" size="20" color="#ffa51e">
                  mdi-check-decagram
                </v-icon>
              </div>
              <!-- 发表时间 -->
              <div class="time font-weight-light">
                {{ talk.createTime | datetime }}
                <span class="top" v-if="talk.isTop == 1">
                  <i class="iconfont iconzhiding" /> {{ $vuetify.lang.t('$vuetify.置顶') }}
                </span>
              </div>
              <!-- 说说信息 -->
              <div class="talk-content mb-2" v-html="talk.content" />
<!--              图库-->
              <v-row
                class="talk-images"
                v-if="talk.imgList"
                >
                <v-col
                  :md="4"
                  :cols="6"
                  v-for="(imgSrc, imgIndex) of talk.imgList"
                  :key="imgIndex"
                  >
                  <v-img
                    max-height="180px"
                    :aspect-ratio="1"
                    class="images-items"
                    :src="imgSrc"
                    style="border-radius: 12px"
                    @click.prevent="previewImg(imgSrc, talk.imgList)"/>
                </v-col>
              </v-row>
              <div class="mt-3 d-flex">
                <div class="talk-operation-item d-flex">
                  <v-icon
                    size="16"
                    :color="isLike(talk.id)"
                    @click.prevent="doLike(talk.id)"
                    >
                    mdi-thumb-up
                  </v-icon>
                  <div class="operation-count">
                    {{ talk.likeCount == null ? 0 : talk.likeCount}}
                  </div>
                </div>
                <div class="talk-operation-item d-flex">
                  <v-icon
                    size="16"
                    class="ml-4"
                    color="#999"
                    >mdi-chat</v-icon>
                  <div class="operation-count">
                    {{ talk.commentCount == null ? 0 : talk.commentCount }}
                  </div>
                </div>
              </div>
            </div>
          </v-card>
        </router-link>
      </v-hover>

      <v-divider class="ma-2"/>
      <infinite-loading class="font-weight-medium" @infinite="infiniteHandler">
        <div slot="no-more" class="mt-7">{{ $vuetify.lang.t('$vuetify.没有更多说说了捏') }}~</div>
        <div slot="no-results">{{ $vuetify.lang.t('$vuetify.没有更多说说了捏') }}~</div>
      </infinite-loading>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "TalksView",
  created() {
  },
  mounted() {
  },
  data() {
    return {
      talkList: [],
      current: 1,
      size: 10
    }
  },
  methods: {
    doLike(talk) {
      // 判断登录
      if (!this.$store.state.userId) {
        this.$store.state.loginFlag = true;
        return false;
      }
      this.postRequest("/talks/" + talk.id + "/like").then(res => {
        if (res.data.flag) {
          let talkLikeSet = this.$store.state.talkLikeSet;
          if (talkLikeSet.indexOf(talk.id) != -1) {
            // 存在，则减一
            this.$set(talk, "likeCount", talk.likeCount - 1);
          } else {
            // 不存在，加一
            this.$set(talk, "likeCount", talk.likeCount + 1);
          }
          this.$store.commit("talkLike", talk.id)
        }
      })
    },
    previewImg(imgSrc, srcList) {
      this.$imagePreview({
        images: srcList,
        index: srcList.indexOf(imgSrc),
      })
    },
    infiniteHandler($state) {
      let params = {
        current: this.current,
        size: 10
      }
      this.getRequest("/talks", params).then(res => {
        if (res.data.flag) {
          let tkList = res.data.data.recordList;
          if (res.data.data.recordList.length > 0) {
            this.current += tkList.length;
            this.talkList.push(...tkList);
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
        if (item.pageLabel == "talk") {
          cover = item.pageCover;
        }
      });
      return "background: url(" + cover + ") center center / cover no-repeat";
    },
    isLike() {
      return function(talkId) {
        var talkLikeSet = this.$store.state.talkLikeSet;
        return talkLikeSet.indexOf(talkId) != -1 ? "#eb5055" : "#999";
      };
    }
  },
}
</script>

<style scoped>
.talk-item {
  transition: all .3s;
}

.talk-item:hover {
  transform: scale(1.01);
}
</style>