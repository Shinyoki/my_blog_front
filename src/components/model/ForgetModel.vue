<template>
  <v-dialog
    v-model="forgetFlag"
    :fullscreen="isMobile"
    max-width="460"
    >
    <v-card
      class="login-container"
      style="border-radius: 4px"
      >
      <v-icon
        style="position:absolute; top: 5px; right: 8px"
        @click="forgetFlag = false"
        >mdi-close
      </v-icon>
      <div class="login-wrapper">
        <h1 style="text-align: center" class="mb-7">忘记密码</h1>
<!--        用户名-->
        <v-text-field
          clearable
          v-model="username"
          label="邮箱号"
          placeholder="请输入您的邮箱号"
          @keyup.enter="forget"
          />
        <div class="mt-7 send-wrapper">
          <!--          验证码-->
          <v-text-field
              clearable
              v-model="confirmCode"
              label="验证码"
              placeholder="请输入验证码"
              @keyup.enter="forget"
          />
          <!--          发送验证码-->
          <v-btn
              text
              small
              :disabled="disableFlag"
              @click="sendCode"
          >
            {{ sendMessage }}
          </v-btn>
        </div>
<!--        新密码-->
        <v-text-field
          v-model="password"
          class="mt-7"
          label="新密码"
          placeholder="请输入您的新密码"
          @keyup.enter="forget"
          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show ? 'text' : 'password'"
          @click:append="show = !show"
          />
<!--        按钮-->
        <v-btn
          class="mt-7"
          block
          color="green"
          style="color: white"
          @click="forget"
          >确定</v-btn>
<!--        登录-->
        <div class="mt-10 mr-7 login-tip float-right">
          想起密码？<span @click="openLogin">点此登录</span>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  created() {
  },
  mounted() {
  },
  data() {
    return {
      username: "",
      password: "",
      confirmCode: "",
      show: false,
      sendMessage: "发送",
      disableFlag: false,
      countdown: 60,
    }
  },
  methods: {
    forget() {
      this.validEmail();
      if (this.confirmCode.trim().length != 6) {
        this.$toast.error("验证码长度不正确");
        return;
      }
      if (this.password.trim().length < 6) {
        this.$toast.error("密码长度不正确");
        return;
      }

      let params = {
        username: this.username,
        password: this.password,
        code: this.confirmCode,
      }
      this.postRequest("/users/password", params).then(res => {
        if (res.data.flag) {
          this.$store.commit("closeModel");
          this.$toast.success("修改成功，请重新登录");
          this.$store.commit("logout");
          this.$store.state.loginFlag = true;
        } else {
          this.$toast.error(res.data.message);
        }
      })
    },
    // 发送验证码
    sendCode() {
      if (!this.validEmail()) {
        return false;
      }

      const that = this;
      let captcha = new TencentCaptcha(this.blogConfig.TENCENT_CAPTCHA_APP_ID, (res) => {
        if (res.ret == 0) {
          // 设置间隔
          that.beginCountDown();
          // 发送邮件
          let params = {
            username: that.username
          }
          that.getRequest("/users/code", params).then(res => {
            if (res.data.flag) {
              that.$toast.success("验证码发送成功");
            } else {
              that.$toast.error(res.data.msg);
            }
          })
        }
      });
      captcha.show();
    },
    // 点击间隔
    beginCountDown() {
      this.disableFlag = true;
      this.mTimer = setInterval(() => {
        this.countdown--;
        this.sendMessage = this.countdown + "s";

        if (this.countdown <= 0) {
          this.countdown = 60;
          this.disableFlag = false;
          this.sendMessage = "发送";
          clearInterval(this.mTimer);
        }
      }, 1000)
    },
    // 验证邮箱格式是否正确
    validEmail() {
      if (this.username.trim().length == 0) {
        this.$toast.error("请输入邮箱地址");
        return false;
      }
      let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!reg.test(this.username)) {
        this.$toast.error("邮箱格式不正确");
        return false;
      }
      return true;
    },
    // 打开登录框
    openLogin() {
      this.$store.state.forgetFlag = false;
      this.$store.state.loginFlag = true;
    },
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    forgetFlag: {
      get() {
        return this.$store.state.forgetFlag;
      },
      set(val) {
        this.$store.state.forgetFlag = val;
      }
    }
  },

}
</script>

<style scoped>
.user-avatar{
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-tip {
  color: #b3b3b3;
  font-size: .865rem;
}

.login-tip span {
  color: #817f7f;
  cursor: pointer;
}
</style>