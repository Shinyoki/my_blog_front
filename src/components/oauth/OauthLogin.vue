<template>
  <!--  加载页-->
  <div class="oauth-background">
    <div id="preloader_1">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    // 20秒后视作超时，将回到主页
    setTimeout(() => {
      this.$toast.error("超时，请重新登录");
      this.$router.push({path: that.$store.state.beforeLoginPath});
    }, 40000);
    const that = this;
    // 关闭所有模态框
    that.$store.commit("closeModel");
    console.log("得到消息")
    console.log(this.$route.params)
    if (this.$route.query.code == undefined || this.$route.query.code == "") {
      that.$toast.warning("非法访问");
      that.$router.push("/");
    } else {
      const loginType = this.$route.params.loginType;
      that.$toast.primary("开始处理Github登录请求，请稍后...", 4000);
      /**
       * Github
       */
      if (loginType == "github") {
        const params = {
          code: that.$route.query.code
        }
        this.postRequest("/users/oauth/github", params).then(res => {
          if (res.data.flag) {
            // 登录成功
            that.$store.commit("login", res.data.data);
            if (res.data.data.email == null) {
              that.$toast.warning("请绑定邮箱以便及时收到回复");
            } else {
              that.$toast.success(res.data.message);
            }
          } else {
            that.$toast.error(res.data.message);
          }

          // 跳转页面
          const lastPath = that.$store.state.beforeLoginPath;
          if (lastPath != null && lastPath != "") {
            that.$router.push({path: lastPath});
          } else {
            that.$router.push({path: "/"});
          }
        })
      }

      else if(loginType == "weiruan") {
        console.log("得到消息")
        console.log(this.$route.fullPath)
      }
      //TODO qq
    }

  },
  data() {
    return {}
  },
  methods: {},
  computed: {}
}
</script>

<style scoped>
/*全屏拉伸 最高index显示*/
.oauth-background {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  z-index: 1000;
}

#preloader_1 {
  position: relative;
  top: 45vh;
  left: 45vw;
}

#preloader_1 span {
  display: block;
  width: 9px;
  height: 5px;
  background-color: #9b59b6;

  position: absolute;
  bottom: 0px;

  animation: loading 1.5s infinite ease-in-out;
}

#preloader_1 span:nth-child(2) {
  left: 11px;
  animation-delay: .2s;
}

#preloader_1 span:nth-child(3) {
  left: 22px;
  animation-delay: .4s;
}

#preloader_1 span:nth-child(4) {
  left: 33px;
  animation-delay: .6s;
}

#preloader_1 span:nth-child(5) {
  left: 44px;
  animation-delay: .8s;
}

@keyframes loading {
  0% {
    height: 5px;
    transform: translateY(0px);
    background: #9b59b6;
  }
  25% {
    height: 30px;
    transform: translateY(15px);
    background: #3498db;
  }
  50% {
    height: 5px;
    transform: translateY(0px);
    background: #9b59b6;
  }
  100% {
    height: 5px;
    transform: translateY(0px);
    background: #9b59b6;
  }
}
</style>