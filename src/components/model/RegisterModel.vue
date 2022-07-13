<template>
  <v-dialog
      v-model="registerFlag"
      :fullscreen="isMobile"
      max-width="460"
  >
    <!--    和登录卡片一个样式-->
    <v-card
        class="login-container"
        style="border-radius: 4px"
    >
      <!--      关闭图标 icon-->
      <v-icon
          class="float-right"
          @click="registerFlag = false"
      >mdi-close
      </v-icon>

      <!--      wrapper-->
      <div class="login-wrapper">
        <!--        用户名-->
        <v-text-field
            clearable
            v-model="username"
            label="邮箱地址"
            placeholder="请输入您的邮箱地址"
            @keyup.enter="doRegister"
        />
        <!--        验证码区域-->
        <div class="mt-7 send-wrapper">
          <!--          验证码-->
          <v-text-field
              clearable
              v-model="confirmCode"
              label="验证码"
              placeholder="请输入验证码"
              @keyup.enter="doRegister"
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

<!--        密码-->
        <v-text-field
          v-model="password"
          class="mt-7"
          label="密码"
          placeholder="请输入您的密码"
          @keyup.enter="doRegister"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append="showPassword = !showPassword"
          />

<!--        注册按钮-->
        <v-btn
          block
          class="mt-7"
          color="red"
          style="color:#fff"
          @click="doRegister"
          >注册</v-btn>

        <div class="mt-10 login-tip">
          已有账号？<span @click="this.$store.state.loginFlag = true">登录</span>
        </div>
      </div>
    </v-card>

  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      username: "",             // 用户名
      password: "",             // 密码
      confirmCode: "",          // 验证码
      disableFlag: false,       // 禁用
      sendMessage: "发送",       // 发送
      countdown: 60,            // 倒计时
      showPassword: false,      // 是否显示密码
    }
  },
  methods: {
    // 注册
    doRegister() {
      // TODO 注册
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
      if (this.username.trim() == "") {
        this.$toast.error("请输入邮箱地址");
        return false;
      }
      let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!reg.test(this.username)) {
        this.$toast.error("邮箱格式不正确");
        return false;
      }
      return true;
    }
  },
  computed: {
    // 显示模态框 标记
    registerFlag: {
      get() {
        return this.$store.state.registerFlag
      },
      set(value) {
        this.$store.state.registerFlag = value;
      },
    },
    // 是否为移动设备 标记
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  }
}
</script>

<style scoped>

</style>