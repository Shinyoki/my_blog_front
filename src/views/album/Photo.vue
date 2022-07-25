<template>
  <div>
    <div :style="cover" class="banner">
      <div class="banner-title">图库</div>
    </div>
    <!--    相册-->
    <v-card class="blog-container">
      <div class="photo-wrapper">
        <img
            class="photo-cover"
            v-for="(photo, index) of photoList"
            :key="index"
            :src="photo"
            @click="preview(index)"
        ></img>
      </div>
      <!--        无限加载-->
      <v-divider/>
      <infinite-loading class="mt-2 font-weight-medium" @infinite="infiniteHandler">
        <div slot="no-more">没有更多图片了捏</div>
        <div slot="no-results">没有更多图片了捏</div>
      </infinite-loading>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "PhotoView",
  created() {

  },
  data() {
    return {
      photoAlbumName: "",   // 像册名
      photoAlbumCover: "",  // 封面
      photoList: [],
      current: 1,
      size: 10,
    }
  },
  methods: {
    // vue photo preview
    preview(photoIndex) {
      this.$imagePreview({
        images: this.photoList,
        index: photoIndex
      })
    },
    // 无限加载
    infiniteHandler($state) {
      let params = {
        current: this.current,
        size: this.size
      }
      this.getRequest("/albums/" + this.$route.params.albumId + "/photos", params).then(res => {
        this.photoAlbumCover = res.data.data.photoAlbumCover;
        this.photoAlbumName = res.data.data.photoAlbumName;

        let phList = res.data.data.photoList;

        if (phList && phList.length > 0) {
          this.current += phList.length;
          this.photoList.push(...phList);

          $state.loaded();
        } else {
          $state.complete();
        }
      })
    },
  },
  computed: {
    cover() {
      return "background: url(" + this.photoAlbumCover + ") center center / cover no-repeat";
    },
  },
}
</script>

<style scoped>
.photo-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.photo-wrapper::after {
  /*最后一张图片*/
  content: "";
  display: block;
  flex-grow: 999;
}
@media (max-width: 959px) {
  .photo-cover {
    width: 100%;
  }
}

.photo-cover {
  margin: 3px;
  cursor: pointer;
  object-fit: cover;

  flex-grow: 1;
  height: 200px;
}
</style>