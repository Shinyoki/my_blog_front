<template>
  <div class="right-bottom" :style="isShow">
<!--    切换主题-->
    <div :class="'right-light-or-dark ' + isOut">
      <i :class="'iconfont ' + icon + ' rightside-icon'" @click="check"/>
    </div>
<!--    设置按钮-->
    <div class="setting-container" @click="switchOut">
      <i class="iconfont icon-shezhi setting"/>
    </div>
<!--    回到顶端-->
    <i @click="back2Top" class="iconfont icon-iconfontfanhuidingbu rightside-icon"/>
  </div>
</template>
<script>
export default {
  mounted() {
    //注册
    window.addEventListener("scroll", this.scrollToTop);
  },
  destroyed() {
    //销毁
    window.removeEventListener("scroll", this.scrollToTop);
  },
  data() {
    return {
      isShow: "",
      isOut: "out",
      icon: "icon-taiyang"
    }
  },
  methods: {
    // 为了计算距离顶部的高度，当高度大于20显示回顶部图标，小于20则隐藏
    scrollToTop() {
      const curY = window.scrollY ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
      if (curY > 20) {
        this.isShow = "opacity: 1;transform: translateX(-38px);";
      } else {
        this.isShow = "";
      }
    },
    // 显示主题切换
    switchOut() {
      this.isOut = (this.isOut == "out") ? "in" : "out";
    },
    // 切换主题颜色
    check() {
      const flag = this.icon == "icon-yueliang";
      this.icon = flag ? "icon-taiyang" : "icon-yueliang";

      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },
    // 回到顶端
    back2Top() {
      window.scrollTo({
        behavior: "smooth",
        top: 0
      })
    },
  },
  computed: {

  }
}
</script>
<style scoped>
.right-bottom {
  z-index: 4;
  position: fixed;
  right: -38px;
  bottom: 85px;

  transition: all .5s;
}
/*切换主题*/
.right-light-or-dark {
  transform: translate(30px, 0);
}
.out {
  animation: rightsideOut .3s;
}
.in {
  transform: translate(0, 0);
  animation: rightsideIn .3s;
}
@keyframes rightsideOut {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(30px, 0);
  }
}
@keyframes rightsideIn {
  0% {
    transform: translate(30px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}
/*两个设置按钮*/
.setting-container,
.rightside-icon {
  display: block;
  margin-bottom: 2px;
  width: 30px;
  height: 30px;
  background: #49b1f5;
  color: #fff;
  text-align: center;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;

  transition: background-color 1s;
}
.setting-container:hover,
.rightside-icon:hover {
  background-color: #ff7242;
}
.setting-container i {
  display: inline-block;
  animation: turn-around 2s linear infinite;
}
@keyframes turn-around {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>