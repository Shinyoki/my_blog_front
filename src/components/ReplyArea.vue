<template>
  <v-expand-transition>
    <div class="comment-input-wrapper mt-3" v-show="show" ref="reply">
      <div class="d-flex">
        <!--        用户头像-->
        <v-avatar rounded size="40">
          <img
              v-if="this.$store.state.avatar"
              :src="this.$store.state.avatar"
          />
          <img
              v-else
              :src="this.$store.state.blogInfo.websiteConfig.touristAvatar"
          />
        </v-avatar>
        <!--        评论-->
        <div style="width: 100%" class="ml-3">
          <div class="comment-input">
            <v-textarea
                ref="text"
                class="comment-textarea"
                v-model="commentContent"
                :placeholder="'回复 @' + nickname + '：'"
                hint="评论中..."
                dense
                auto-grow
            >
            </v-textarea>
          </div>
          <!--          操作-->
          <div class="emoji-container d-flex mx-3">
            <!--            表情-->
            <span
                :class="chooseEmoji ? 'emoji-btn-active' : 'emoji-btn'"
                @click="chooseEmoji = !chooseEmoji"
            >
              <i class="iconfont icon-biaoqing_xiao_o" id="emoji"/>
            </span>
            <!--            提交-->
            <v-spacer/>
            <v-btn
                @click="cancelReply"
                tile
                class="mr-auto"
                width="100px"
            >取消
            </v-btn>
            <v-btn
                @click="submit"
                tile
                color="blue"
                class="ml-3"
                width="100px"
            >提交
            </v-btn>
          </div>
          <!--          表情栏-->
          <div>
            <v-expand-transition>
              <EmojiArea
                  v-click-outside="closeEmojiArea"
                  v-show="chooseEmoji"
                  chooseEmoji
                  @eclick="getEmoji"
              />
            </v-expand-transition>
          </div>
        </div>
      </div>
    </div>
  </v-expand-transition>
</template>

<script>
import EmojiArea from "@/components/EmojiArea";

export default {
  name: "ReplyArea",
  components: {
    EmojiArea
  },
  mounted() {

  },
  props: {
    type: {
      type: Number
    },
    index: {
      type: Number
    }
  },
  data() {
    return {
      commentContent: "",   // 评论内容
      chooseEmoji: false,   // 开启表情包输入框
      nickname: "",
      parentId: null,
      replyUserId: null,
      show: false,
    }
  },
  methods: {
    // 取消
    cancelReply() {
      this.show = false;
    },
    // 关闭表情输入框
    closeEmojiArea(event) {
      console.log(event);
      if (event.path[0] && event.path[0].id == "emoji") {
        return;
      } else {
        this.chooseEmoji = false;
      }
    },
    // 插入表情
    getEmoji(emoji, index) {
      this.commentContent += emoji;
    },
    // 提交
    submit() {
      if (!this.$store.state.userId) {
        this.$toast.error("尚未登陆，请登录后再发表！")
        return false;
      }
      if (this.commentContent.trim().length == 0) {
        this.$toast.warning("评论内容不能为空！")
        return false;
      }


      // 文章id
      const articleId = this.$route.params.articleId;
      let params = {
        commentContent: ("回复 @" + this.nickname + "：").concat(this.commentContent),
        type: this.type,
        parentId: this.parentId,
        replyUserId: this.replyUserId
      }

      this.postRequest("/comments", params).then(res => {
        if (res.data.flag) {

          const isReview = this.$store.state.blogInfo.websiteConfig
              .isCommentReview;
          if (isReview) {
            this.$toast.success("评论成功，等待审核！");
          } else {
            this.$toast.success("评论成功！");
          }
          this.$emit("reloadReply", this.index)
        } else {
          this.$toast.error(res.data.message);
        }
      })
    }

  }
}
</script>

<style scoped>

</style>