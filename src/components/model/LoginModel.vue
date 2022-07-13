<template>
  <v-dialog
      :fullscreen="isMobile"
      max-width="460"
      v-model="showLoginDialog"
  >
    <!--      登录框-->
    <v-card
        class="login-container"
        style="border-radius: 4px"
    >
      <!--      图标-->
      <v-icon
          class="float-right"
          @click="showLoginDialog = false"
      >
        mdi-close
      </v-icon>
      <!--      登录-->
      <div class="login-wrapper">
        <!--        用户名-->
        <v-text-field
            clearable
            v-model="username"
            label="邮箱号"
            placeholder="请输入您的邮箱地址"
            @keyup.enter="doLogin"
        />
        <!--        密码-->
        <!--          mt-8 ==> margin-top: 7级别-->
        <v-text-field
            :type="showPassword ? 'text' : 'password'"
            :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append="showPassword = !showPassword"
            v-model="password"
            label="密码"
            placeholder="请输入您的密码"
            class="mt-7"
            @keyup.enter="doLogin"
        />
        <!--        登录-->
        <v-btn
            class="mt-7"
            block
            color="blue"
            style="color: #fff"
            @click="doLogin"
        >
          登录
        </v-btn>
        <!--        注册和找回密码-->
        <div class="mt-10 login-tip">
          <v-btn plain @click="openRegister">立即注册</v-btn>
          <v-btn plain @click="openForget" class="float-right">忘记密码?</v-btn>
        </div>

        <!--        第三方 登录-->
        <div v-if="socialLoginList.length > 0">
          <div class="social-login-title">第三方登录</div>
          <div class="social-login-wrapper">
            <!--            qq-->
            <v-icon
                large
                v-if="isThirdLoginSupport('qq')"
                class="mr-3 iconfont icon-QQ third-login-icon"
                style="color: #00AAEE;"
                @click="qqLogin"
            />


            <!--            github-->
            <v-icon
                large
                v-if="isThirdLoginSupport('github')"
                class="iconfont icon-github third-login-icon"
                style="color: #00AAEE;"
                @click="githubLogin"
            />

          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  mounted() {

  },
  data() {
    return {
      showPassword: false,    // 显示密码框中的密码
      username: null,         // 用户名
      password: null,         // 密码
    }
  },
  methods: {
    // 登录
    doLogin() {
      let emailPattern = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      if (!emailPattern.test(this.username)) {
        // 邮箱格式不通过
        this.$toast.error("邮箱格式不正确");
        return false;
      }
      if (this.password.trim() == "") {
        this.$toast.error("密码不能为空");
        return false;
      }

      const that = this;
      let captcha = new TencentCaptcha(this.blogConfig.TENCENT_CAPTCHA_APP_ID, (res) => {
        if (res.ret == 0) {
          //发送登录请求
          let param = new URLSearchParams();
          param.append("username", that.username);
          param.append("password", that.password);
          console.log("请求")
          that.postRequest("/login", param).then(({data}) => {
            if (data.flag) {
              that.username = "";
              that.password = "";
              that.$store.commit("login", data.data);
              that.$store.commit("closeModel");
              that.$toast.success("登录成功");
            } else {
              that.$toast.error(data.message);
            }
          });
        }
      });
      // 显示验证码
      captcha.show();

    },
    qqLogin() {
      //TODO qq登录
    },
    githubLogin() {
      // 保存当前的路径，登录成功后跳转回来
      this.$store.commit("saveBeforeLoginUrl", this.$route.path);
      // 开启一个新的窗口并跳转到 github 登录页面
      const loginUrl = this.blogConfig.GITHUB_AUTHORIZE_URL +
          "?client_id=" + this.blogConfig.GITHUB_CLIENT_ID +
          "&redirect_uri=" + this.blogConfig.GITHUB_REDIRECT_URL;
      window.open(loginUrl, "_self");
    },
    // 打开注册模态框
    openRegister() {
      this.$store.state.loginFlag = false;
      this.$store.state.registerFlag = true;
    },
    // 打开忘记密码模态框
    openForget() {
      this.$store.state.loginFlag = false;
      this.$store.state.forgetFlag = true;
    },
  },
  computed: {
    // 是否为移动端
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    // 显示登录模态框
    showLoginDialog: {
      get() {
        return this.$store.state.loginFlag;
      },
      set(value) {
        this.$store.state.loginFlag = value;
      },
    },
    // 社交登录
    socialLoginList() {
      // 如果list是undefined或者是null，则返回空数组
      let flag = null;
      if (this.$store.state.blogInfo.websiteConfig.socialLoginList == undefined || this.$store.state.blogInfo.websiteConfig.socialLoginList == null) {
        flag = [];
      } else {
        flag = JSON.parse(this.$store.state.blogInfo.websiteConfig.socialLoginList);
      }
      return flag;
    },
    // 第三方登录支持
    isThirdLoginSupport() {
      return function (type) {
        return this.socialLoginList.indexOf(type) != -1;
      };
    },
  }
}
</script>
<style scoped>
/*登录框*/
.login-container {
  background-color: #fff;
}

/*提示*/
.login-tip {
  color: #b3b3b3;
  font-size: .865rem;
}

.login-tip span {
  cursor: pointer;
}

/*第三方登录图标*/
.social-login-wrapper {
  margin-top: 1rem;
  font-size: 2rem;
  text-align: center;
}

.social-login-wrapper a {
  text-decoration: none;
}

/*第三方登录：居中*/
.social-login-title {
  margin-top: 1.5rem;
  color: #b5b5b5;
  font-size: .75rem;
  text-align: center;
}

/*在前后加个块级元素，拉长显示*/
.social-login-title::before {
  content: "";
  display: inline-block;
  vertical-align: middle;

  background-color: #d8d8d8;
  width: 60px;
  height: 1px;
  margin: 0 12px;
}

.social-login-title::after {
  content: "";
  display: inline-block;
  vertical-align: middle;

  background-color: #d8d8d8;
  width: 60px;
  height: 1px;
  margin: 0 12px;
}

.third-login-icon:hover {
  color: #ee7752 !important;
}
</style>