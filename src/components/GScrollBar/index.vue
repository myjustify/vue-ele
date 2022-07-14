<template>
  <div
    class="g-scroll-bar"
    :class="{'g-scroll-bar--vertical': vertical,
             'g-scroll-bar--horizontal': !vertical}"
  >
    <div
      class="g-scroll-bar__bar"
      :style="barStyle"
    >
      <div
        class="g-scroll-bar__thumb"
        :style="thumbStyle"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'GScrollBar',
  props: {
    vertical: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  },
  computed: {
    thumbStyle() {
      return {}
    },
    barStyle() {
      return {}
    }
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
.g-scroll-bar {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
  overflow: hidden;

  &__bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    &__thumb {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    }
  }

}
</style>
