<template>
  <v-snackbar
    v-model="visible"
    :timeout="3000"
    :color="color"
    top
    >
    <i :class="icon" style="margin-right: 10px"/>
    {{ message }}
  </v-snackbar>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      message: "",
      type: "primary",
      color: "#49b1f5",
      icon: ""
    };
  },
  watch: {
    type(val) {
      switch (val) {
        case "primary":
          this.color = "#49b1f5";
          this.icon = "";
          break;
        case "success":
          this.color = "#52C41A";
          this.icon = "iconfont icon-tishichenggong";
          break;
        case "error":
          this.color = "#F56C6C";
          this.icon = "iconfont icon-cuowu";
          break;
        case "warnning":
          this.color = "#F57C00";
          this.icon = "iconfont icon-tishichenggong";
          break;
      }
    },
  }
}
</script>