<template>
  <div>
    <!--    评论区标题-->
    <div class="comment-title">
      <i class="iconfont icon-pinglunxiao"/>
      评论
    </div>
    <!--    评论框-->
    <div class="comment-input-wrapper mt-3">
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
                placeholder="留下点什么内容吧..."
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
                @click="submit"
                tile
                color="blue"
                class="mr-auto"
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
    <v-divider class="mt-5 mb-5"></v-divider>
    <!--    评论详情-->
    <div v-if="count > 0 && reFresh">
      <!--      评论数量-->
      <div class="count">{{ count }} 条评论</div>
<!--      评论-->
      <v-card
          class="d-flex pa-2 mt-3"
          v-for="(comment, index) of commentList"
          :key="index"
      >
        <!--        头像-->
        <v-avatar size="40" class="comment-avatar">
          <img :src="comment.avatar"/>
        </v-avatar>

        <!--        内容-->
        <div class="flex-grow-1 ml-1">
          <!--          用户名-->
          <div class="comment-user">
            <span v-if="!comment.webSite">{{ comment.nickname }}</span>
            <a
                v-else
                :href="comment.webSite"
                target="_blank"
            >
              {{ comment.nickname }}
            </a>
          </div>
          <!--          评论信息-->
          <div class="comment-info">
            <!--            楼层-->
            <span class="mr-1">{{ count - index }} 楼</span>
            <!--            发表时间-->
            <span class="mr-1">
              {{ comment.createTime | date }}
            </span>
            <!--            点赞-->
            <span
                :class="isLike(comment.id) + ' iconfont icon-dianzan'"
                @click="doLike(comment)"
            />
            <span v-show="comment.likeCount > 0">
              {{ comment.likeCount }}
            </span>

            <span v-ripple="{class: 'blue--text'}" class="reply-btn" @click="replyComment(comment, index)">回复</span>
          </div>
          <!--          评论内容 -->
          <p v-html="comment.commentContent" class="comment-content"/>

          <!--          回复系统-->
          <div
              class="d-flex"
              v-for="(reply) of comment.replyDTOList"
              :key="reply.id"
          >
            <!--            回复：头像-->
            <v-avatar
                size="36"
                class="comment-avatar"
            >
              <img :src="reply.avatar"/>
            </v-avatar>
            <!--            回复：信息-->
            <div class="flex-grow-1 ml-1">
              <!--              用户名-->
              <div class="comment-user">
                <span v-if="!reply.webSite">{{ reply.nickname }}</span>
                <a v-else :href="reply.webSite" target="_blank">{{ reply.nickname }}</a>
              </div>
              <!--              信息-->
              <div class="comment-info">
                <span class="mr-1">{{ reply.createTime | date }}</span>
                <span
                    :class="isLike(reply.id) + ' iconfont icon-dianzan'"
                    @click="doLike(reply)"
                />
                <span v-show="reply.likeCount > 0">{{ reply.likeCount }}</span>
                <span class="reply-btn"  @click="replyComment(reply, index)">回复</span>
              </div>
              <!--              内部回复-->
              <p class="comment-content">
                <!--                回复用户名-->
                <template
                    v-if="reply.replyUserId != comment.userId"
                >
                    <span v-if="!reply.replyWesite" class="ml-1">
                      @{{ reply.replyNickname }}
                    </span>
                  <a
                      v-else
                      :href="reply.WebSite"
                      target="_blank"
                      class="comment-nickname ml-1"
                  >
                    @{{ reply.replyNickname }}
                  </a>
                  ，
                </template>
                <span v-html="reply.commentContent"/>
              </p>
            </div>
          </div>
          <!--        回复数量-->
          <div
              class="mb-3"
              style="font-size: .75rem; color: #6d757a"
              v-show="comment.replyCount > 3"
              ref="check"
          >
            共
            <b>{{ comment.replyCount }}</b>
            条回复，
            <span
                style="color: #00a1d6; cursor: pointer"
                @click="checkReplies(comment, index)"
            >
            点击查看
            </span>
          </div>
          <!--        回复分页-->
          <div
            class="mb-3"
            style="font-size: .75rem; color: #222; display: none"
            ref="paging"
            >
            <span style="padding-right: 10px">
              共{{ Math.ceil(comment.replyCount / 5)}}页
            </span>
<!--            分页组件-->
            <page
              ref="page"
              :totalPage="Math.ceil( comment.replyCount / 5)"
              :index="index"
              :commentId="comment.id"
              @changeReplyCurrent="changeReplyCurrent"
            />
            <!-- 回复框 -->
          </div>
          <ReplyArea :type="type" :index="index" ref="reply" @reloadReply="reloadReply(index)" />
        </div>
      </v-card>
<!--      加载按钮-->
      <div class="load-wrapper">
        <v-btn outlined v-if="count > commentList.length" @click="listComments">
          加载更多...
        </v-btn>
      </div>
    </div>
    <!-- 没有评论提示 -->
    <div v-else style="padding:1.25rem;text-align:center">
      来发评论吧~
    </div>
  </div>
</template>

<script>
import EmojiArea from "@/components/EmojiArea";
import Page from "@/components/Page"
import ReplyArea from "@/components/ReplyArea";
export default {
  components: {EmojiArea, Page, ReplyArea},
  props: {
    // 回复类型：1-评论文章，2-回复评论
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      commentContent: "",   // 评论内容
      commentList: [],     // 评论列表
      chooseEmoji: false,   // 开启表情包输入框
      current: 1,           // 评论区页数
      count: 0,            // 评论总数
      reFresh: true,       // 是否刷新评论区
      topicId: 0,
    }
  },
  created() {
    this.topicId = this.$route.params.articleId | this.$route.params.talkId;
    this.listComments();
  },
  methods: {
    // 查看 其他回复页
    changeReplyCurrent(current, index, commentId) {

      let params = {
        current: current,
        size: 5
      }
      this.getRequest("/comments/" + commentId + "/replies", params).then(res => {
        this.commentList[index].replyDTOList = res.data.data;
      })
    },
    // 查看全部回复 comment: 当前评论  index：当前楼层
    checkReplies(comment, index) {
      let params = {
        current: 1,
        size: 5
      }
      this.getRequest("/comments/" + comment.id + "/replies", params).then(res => {
        // 查看该评论下的五个回复，并以第一个页的形式展现
        // 被for遍历后ref="check"就变成了数组，于是让这个评论里的这里隐藏显示
        this.$refs.check[index].style.display = "none";
        // 设置为新查找的replies
        this.$set(comment, "replyDTOList", res.data.data);
        // 超过一夜则显示分页
        if (Math.ceil(comment.replyCount / 5) > 1) {
          this.$refs.paging[index].style.display = "flex";
        }
      })
    },
    // 回复
    replyComment(comment, index) {
      // 关闭回复框
      this.$refs.reply.forEach(reply => {
        reply.$el.style.display = "none"
      });
      this.$refs.reply[index].commentContent = "";
      this.$refs.reply[index].show = true;
      this.$refs.reply[index].nickname = comment.nickname;
      this.$refs.reply[index].replyUserId = comment.userId;
      this.$refs.reply[index].parentId = this.commentList[index].id;
      this.$refs.reply[index].chooseEmoji = false;
      this.$refs.reply[index].$el.style.display = "block";
    },
    reloadReply(index) {
      this.getRequest("/comments/" + this.commentList[index].id + "/replies", {
        current: this.$refs.page[index].current,
        size: 5
      }).then(({ data }) => {
        this.commentList[index].replyCount++;
        //回复大于5条展示分页
        if (this.commentList[index].replyCount > 5) {
          this.$refs.paging[index].style.display = "flex";
        }
        this.$refs.check[index].style.display = "none";
        this.$refs.reply[index].show = true;
        this.commentList[index].replyDTOList = data.data;
      });
    },
    // 点赞
    doLike(comment) {
      if (!this.$store.state.userId) {
        this.$store.state.loginFlag = true;
        this.$toast.error("您还未登录呢" + this.loginFlag)
        return false;
      }
      // 发送请求
      this.axios
          .post("/api/comments/" + comment.id + "/like")
          .then(({data}) => {
            if (data.flag) {
              // 判断是否点赞
              if (this.$store.state.commentLikeSet.indexOf(comment.id) != -1) {
                this.$set(comment, "likeCount", comment.likeCount - 1);
              } else {
                this.$set(comment, "likeCount", comment.likeCount + 1);
              }
              this.$store.commit("commentLike", comment.id);
            }
          });
    },
    // 查询评论
    listComments() {
      let params = {
        current: this.current,
        type: this.type,
        topicId: this.topicId
      }

      this.getRequest("/comments", params).then(res => {
        if (this.current == 1) {
          // 如果是第一页
          this.commentList = res.data.data.recordList;
        } else {
          // 不是第一页，就把之后的内容添加到前面
          this.commentList = this.commentList.concat(res.data.data.recordList);
        }
        this.current++;
        this.count = res.data.data.count;
        console.log("得到的内容")
        console.log(res.data.data.recordList)

        // @getCommentCount=""获取评论数量
        this.$emit("getCommentCount", this.count);
      })
    },
    // 关闭表情输入框
    closeEmojiArea(event) {
      if (event.path[0].id == "emoji") {
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
      let params = {
        commentContent: this.commentContent,
        type: this.type,
        topicId: this.topicId,
      }


      this.postRequest("/comments", params).then(res => {
        if (res.data.flag) {
          console.log("发送成功")
          this.current = 1;
          this.listComments();

          const isReview = this.$store.state.blogInfo.websiteConfig
              .isCommentReview;
          if (isReview) {
            this.$toast.success("评论成功，等待审核！");
          } else {
            this.$toast.success("评论成功！");
          }
        } else {
          console.log("发送失败")
          this.$toast.error(res.data.msg);
        }
      })
    },

  },
  computed: {
    isLike() {
      return function (commentId) {
        let commentLikeSet = this.$store.state.commentLikeSet;
        return commentLikeSet.indexOf(commentId) == -1 ? "like" : "like-active";
      };
    },
  },
  watch: {
    commentList() {
      // 刷新了评论，则等dom渲染完成后再显示div
      this.reFresh = false;   // v-if 关闭div
      this.$nextTick(() => {
        // v-if => true 重新渲染
        this.reFresh = true;
      });
    },
  }
}
</script>

<style scoped>
.count {
  padding: 5px;
  line-height: 1.75;
  font-size: 1.25rem;
  font-weight: bold;
}

/*评论区头像*/
.comment-avatar {
  transition: all 0.5s;
}

.comment-avatar:hover {
  transform: rotate(360deg);
}

/*回复人*/
.comment-user {
  font-size: 14px;
  line-height: 1.75rem;
}

.comment-user a {
  color: #1abc9c !important;
  font-weight: 500;
  transition: all .3s;

}

/*点赞图标*/
.like {
  cursor: pointer;
  font-size: .875rem;
}

.like:hover {
  color: #eb5005;
}

.like-active {
  cursor: pointer;
  font-size: .875rem;
  color: #eb5005;
}

/*回复按钮*/
.reply-btn {
  display: inline-block;
  padding: 2px 10px;
  cursor: pointer;
  float: right;
  color: #ef2f11;
}

/*评论信息*/
.comment-info {
  line-height: 1.75;
  font-size: .75rem;
  color: #b3b3b3;
}

/*评论内容*/
.comment-content {
  font-size: .875rem;
  line-height: 1.75;
  padding-top: .625rem;
  white-space: pre-line;
  word-wrap: break-word;
  word-break: break-all;
}

.comment-nickname {
  text-decoration: none;
  color: #1abc9c !important;
  font-weight: 500;
}
</style>