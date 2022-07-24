<template>
  <v-card v-show="chooseEmoji" class="emoji-wrapper pa-2">
    <v-btn
        class="pa-1 ma-1"
        icon
        v-for="(emoji, index) of emojs"
        style="font-size: 1.5rem"
        :key="index"
        @click="addEmoji(emoji, index)"
    >
      {{ emoji }}
    </v-btn>
  </v-card>
</template>

<script>
import Emojs from "@/assets/js/emoji"

export default {
  props: {
    chooseEmoji: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      emojs: Emojs
    }
  },
  created() {
  },
  methods: {
    // 添加表情
    addEmoji(emoji, index) {
      this.$emit("eclick", emoji, index)
    },
  }
}
</script>

<style>
.emoji-area {
  max-height: 150px;
  overflow-y: auto;
}
.v-btn.v-btn--icon {
  color: rgba(0, 0, 0, 0.8) !important;
}
</style>