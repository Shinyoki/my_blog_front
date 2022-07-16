<template>
  <router-link
      to="/talks"
      class="swiper-container"
  >
    <!--    图标-->
    <v-icon
        size="20"
        color="#4c4948"
    >mdi-chat-outline
    </v-icon>
    <!--    水平滚动html-->
    <div
        :style="{height : height * lineNum + 'px'}"
        class="rollScreen_container"
        id="rollScreen_container"
    >
      <ul
          class="rollScreen_list"
          :style="{ transform: transform }"
          :class="{ rollScreen_list_unanim : index == 0}"
          >
        <li
          class="rollScreen_once"
          v-for="(text, index) in list"
          :key="index"
          :style="{ height: height + 'px' }"
          >
          <span
            class="item"
            v-html="text"/>
        </li>
        <li
          class="rollScreen_once"
          v-for="(text, index) in list"
          :key="index + list.length"
          :style="{ height: height + 'px' }"
          >
          <span
            class="item"
            v-html="text"/>
        </li>
      </ul>
    </div>
    <v-icon
      size="20"
      color="#4c4948"
      class="arrow"
      >mdi-chevron-double-right</v-icon>
  </router-link>
</template>

<script>
export default {
  props: {
    list: {
      default: [],
      type: Array
    },
    height: {
      default: 25,
      type: Number
    },
    lineNum: {
      default: 1,
      type: Number
    }
  },
  created() {
    /**
     * 定时向上滚动
     */
    let that = this;
    setInterval(() => {
      if (that.index != that.list.length) {
        that.index++;
      } else {
        that.index = 0;
      }
    }, 5000)
  },
  data() {
    return {
      index: 0
    };
  },
  methods: {},
  computed: {
    transform() {
      // 移动
      return "translateY(-" + this.index * this.height + "px)";
    }
  }
}
</script>

<style>
/*容器：flex 让左图标、内容、右图标分开*/
.swiper-container {
  margin-top: 20px;
  padding: .6rem 1rem;
  font-size: 15px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}
/*文本容器*/
.rollScreen_container {
  width: 100%;
  line-height: 25px;
  text-align: center;

  position: relative;
  overflow: hidden;
}
.item {
  width: 100%;

  white-space: nowrap;
  transition: all .3s;
}
.rollScreen_list {
  transition: 1s linear;
}
.rollScreen_list:hover .item {
  color: #8e8cd8;
}
.rollScreen_list_unanim {
  transition: none;
}
.arrow {
  animation: 1s passing infinite;
}
@keyframes passing {
  0% {
    transform: translateX(-50%);
    opacity: 0;
  }
  50% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(50%);
    opacity: 0;
  }
}
</style>