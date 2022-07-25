<template>
  <div>
    <!-- banner -->
    <div class="banner" :style="cover">
      <h1 class="banner-title">相册</h1>
    </div>
<!--    内容-->
    <v-card class="blog-container">
      <v-row>
        <v-col
            :md="6"
            v-for="album of photoAlbumList"
            :key="album.id"
            >
          <div class="album-item">
            <v-img
                class="album-cover"
                :src="album.albumCover"
            />
            <router-link
                :to="`/albums/` + album.id"
                class="album-wrapper"
            >
              <div class="album-name">{{ album.albumName}}</div>
              <div class="album-desc">{{ album.albumDesc}}</div>
            </router-link>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "AlbumView",
  created() {
    this.listPhotoAlbums();
  },
  data() {
    return {
      photoAlbumList: []
    }
  },
  methods: {
    // 查询相册
    listPhotoAlbums() {
      this.getRequest("/photos/albums").then(res => {
        this.photoAlbumList = res.data.data;
        console.log(this.photoAlbumList)
      })
    },

  },
  computed: {
    cover() {
      var cover = "";
      this.$store.state.blogInfo.pageList.forEach(item => {
        if (item.pageLabel == "album") {
          cover = item.pageCover;
        }
      });
      return "background: url(" + cover + ") center center / cover no-repeat";
    },
  }
}
</script>

<style scoped>
/*容器*/
.album-item {
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background: #000;
  border-radius: .5rem !important;
}
.album-cover {
  position: relative;
  height: 250px;
  opacity: .8;
  transition: opacity .35s, transform .35s;
  transform: translateX(-10px);
  object-fit: cover;
  width: calc(100% + 1.25rem);
  /*取消图片的最大限制*/
  max-width: none;
}
/*内部信息*/
.album-wrapper {
  /*拉伸文字区域*/
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  padding: 1.8rem 2rem;
  color: #fff !important;
}
.album-name {
  font-weight: bold;
  font-size: 1.25rem;
  overflow: hidden;
  padding: .7rem 0;
  position: relative;
}
.album-name:after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  height: 2px;
  background: #fff;

  transition: transform .35s;
  transform: translate(-101%);
}
.album-item:hover .album-name:after {
  transform: translate(0);
}

.album-item:hover .album-cover {
  transform: translateX(0);
  opacity: .4;
}
.album-desc {
  margin: 0;
  padding: .4rem 0 0;
  line-height: 1.5;
  opacity: 0;
  transition: opacity 0.35s, transform 0.35s;
  transform: translate3d(100%, 0, 0);
}
</style>