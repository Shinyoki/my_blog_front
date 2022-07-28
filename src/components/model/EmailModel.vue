<template>
  <v-dialog
    :fullscreen="isMobile"
    v-model="showEmailBindDialog"
    max-width="460px"
    >
    <v-card
      class="login-container"
      style="border-radius: 4px"
      >
      <!--    关闭按钮-->
      <v-icon
          style="position:absolute; top: 5px; right: 8px"
          @click="showEmailBindDialog = false"
      >mdi-close</v-icon>
      <!--    内容-->
      <div class="login-wrapper">
        <div class="user-avatar">
          <v-avatar
              color="primary"
              size="80"
          >
            <img :src="this.$store.state.avatar"/>
          </v-avatar>
        </div>

<!--        用户名-->
        <v-text-field
          clearable
          label="邮箱号"
          placeholder="请输入您的邮箱号"
          @input="update()"
          v-model="email"
          @keyup.enter="bindEmail"
          />
<!--        验证码-->
        <div class="mt-7 send-wrapper">
          <!--          验证码-->
          <v-text-field
              clearable
              v-model="confirmCode"
              label="验证码"
              placeholder="请输入验证码"
              @keyup.enter="bindEmail"
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
<!--        按钮-->
        <v-btn
          class="mt-7"
          block
          color="blue"
          style="color: white"
          @click="bindEmail"
          >绑定</v-btn>
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
      email: "",
      confirmCode: "",
      disableFlag: false,
      sendMessage: "发送",
      countdown: 60,
    }
  },
  methods: {
    update() {
      this.$emit("updateEmail", this.email);
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
            username: that.email
          }
          that.getRequest("/users/code", params).then(res => {
            console.log(res)
            if (res.data.flag) {
              that.$toast.success("验证码发送成功");
            } else {
              that.$toast.error(res.data.message);
            }
          })
        }
      });
      captcha.show();
    },
    // 绑定邮箱
    bindEmail() {
      this.validEmail()
      if (this.confirmCode.trim().length != 6) {
        this.$toast.error("验证码格式不正确")
        return false;
      }

      let params = {
        email: this.email,
        code: this.confirmCode
      }

      console.log(params)
      this.postRequest("/users/email", params).then(res => {
        if (res.data.flag) {
          this.$store.commit("closeModel");
          this.$store.state.email = this.email;
          this.email = "";
          this.confirmCode = "";
          this.disableFlag = false;
          this.sendMessage = "发送";
          this.$toast.success("绑定成功")
        } else {
          this.$toast.error(res.data.message)
        }
      })
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
      if (this.email.trim() == "") {
        this.$toast.error("请输入邮箱地址");
        return false;
      }
      let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      if (!reg.test(this.email)) {
        this.$toast.error("邮箱格式不正确");
        return false;
      }
      return true;
    }
  },
  computed: {
    // 是否是移动端
    isMobile() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
    // 显示绑定邮箱弹窗
    showEmailBindDialog: {
      get() {
        return this.$store.state.emailFlag;
      },
      set(value) {
        this.$store.state.emailFlag = value;
      },
    }
  }
}
</script>

<style scoped>
/*让user-avatar内的元素居中*/
.user-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 45px;
}
</style>