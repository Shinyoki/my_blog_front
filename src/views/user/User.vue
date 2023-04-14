<template>
  <div>
    <div class="banner" :style="cover">
      <div class="banner-title">{{ $vuetify.lang.t('$vuetify.个人中心') }}</div>
    </div>
    <v-card class="blog-container">
      <v-card-title class="font-weight-bold">
        {{ $vuetify.lang.t('$vuetify.基本信息') }}
      </v-card-title>

      <div class="info-container d-md-flex">
        <div class="u-avatar d-flex justify-center align-center flex-grow-1">
          <v-avatar
              rounded
              class=" ma-2"
              size="140"
          >
            <v-img
                v-if="userInfo.avatar"
                :src="userInfo.avatar"
            />
          </v-avatar>
        </div>
        <v-form
            ref="form"
            v-model="validFlag"
            class="u-info flex-grow-1"
            lazy-validation
        >
          <v-text-field
              label="昵称"
              placeholder="请输入您的昵称"
              v-model="userInfo.nickname"
              :rules="unNullRules"
          />

          <v-text-field
              label="个人网站"
              placeholder="请输入您的个人网站"
              v-model="userInfo.webSite"
          />

          <v-text-field
              label="简介"
              placeholder="请输入您的简介"
              v-model="userInfo.intro"
          />

          <div class="mail-operation d-flex">
            <v-text-field
                label="邮箱号"
                disabled
            />
            <v-btn
                color="primary"
                class="ml-2 lighten-1 align-self-center"
                @click="openEmailModel"
              >{{email? "修改邮箱" : "绑定"}}</v-btn>
          </div>

          <v-btn
              color=" success
            "
            :disabled="!validFlag"
            @click="validate"
            shaped
            >
            {{ $vuetify.lang.t('$vuetify.提交') }}
            </v-btn>
        </v-form>
      </div>
    </v-card>
  </div>
</template>

<script>
import EmailModel from "@/components/model/EmailModel";
export default {
  name: 'UserView',
  components: {EmailModel},
  created() {
  },
  mounted() {
  },
  data() {
    return {
      userInfo: {
        userId: this.$store.state.userId,                       //用户id
        avatar: this.$store.state.avatar,                       //用户头像
        nickname: this.$store.state.nickname,                     //用户昵称
        intro: this.$store.state.intro,                        //用户简介
        webSite: this.$store.state.webSite,                      //用户网站
        email: this.$store.state.email,                        //用户邮箱
      },
      validFlag: true,
      showEmailBindDialog: false,
      unNullRules: [
        value => !!value || '昵称不能为空'
      ],
      emailRules: [
        value => !!value || '邮箱号不能为空',
        value => /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value) || '邮箱格式不正确'
      ]
    };
  },
  methods: {
    updateEmail(newEmail) {
      console.log("父亲接收参数" + newEmail)
      this.userInfo.email = newEmail;
    },
    openEmailModel() {
      this.$store.state.emailFlag = true;
    },
    validate() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      this.axios.put("/api/users/info", this.userInfo).then(({ data }) => {
        if (data.flag) {
          this.$store.commit("updateUserInfo", this.userInfo);
          this.$toast({ type: "success", message: "修改成功" });
        } else {
          this.$toast({ type: "error", message: data.message });
        }
      });
    },
  },
  computed: {
    cover() {
      let cover = "";
      this.$store.state.blogInfo.pageList.forEach(page => {
        if (page.pageLabel == "user") {
          cover = page.pageCover;
        }
      });
      return "background: url(" + cover + ") center center / cover no-repeat";
    },
    email() {
      return this.$store.state.email;
    },
  },
}
</script>

<style scoped>

</style>