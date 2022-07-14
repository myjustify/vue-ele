<template>
  <div v-mousewheel="timeLineMousewheel" class="timeLine">
    <el-scrollbar
        ref="scrollbarRef"
        :wrap-style="wrapStyle"
    >
      <div v-mousewheel="timeLineMousewheel" class="allLine" :style="[calcAllLineStyle]">

        <template v-for="item in timeArr">
          <div :key="item" class="item el-row--flex">
            <div class="minute el-row--flex">
              <template v-for="(son) in timeItemObj[item]">
                <div
                    :key="son.value"
                    class="minute-item-box"
                    :data-value="son.value"
                    @click="timeLineClick(son)">
                  <div class="offset" :style="[ calcOffsetStyle ]" />
                  <div class="fill" />
                  <div
                      :key="son.value"
                      class="minute-item"
                      :style="calcMinuteItemStyle(son)"
                  >
                    <div v-if="valueIndexObj[son.value].index % 60 === 0" class="hours" @click.stop="() => {}">{{ valueIndexObj[son.value].h }}h</div>
                  </div>

                  <div class="hover-item">{{ son.value }}</div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import Mousewheel from 'element-ui/lib/directives/mousewheel'
export default {
  name: 'timeLine',
  directives: {
    Mousewheel
  },
  props: {
    value: {
      type: String,
      default: '00:00'
    },
    lineWidth: {
      type: Number,
      default: 2
    },
    wrapStyle: {
      type: [Array, String],
      default: 'padding-bottom: 24px; padding-top: 20px; padding-left: 10px; background-color: transparent;'
    },
    offsetStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    calcMinuteItemStyleFn: {
      type: Function,
      default: function(son, target) {
        const index = target.valueIndexObj[son.value].index
        const { value, lineWidth } = target
        const currentIndex = target.valueIndexObj[value].index
        return {
          width: lineWidth + 'px',
          height: index % 60 === 0 ? '14px' : '8px',
          background: (currentIndex > index && index % 6 === 0)
              ? '#45e0ff' : index % 60 === 0
                  ? '#8e8e8e' : index % 6 === 0
                      ? '#8e8e8e' : 'transparent',
          cursor: 'pointer',
          alignSelf: 'flex-end',
          color: currentIndex > index ? '#06a9ff' : '#9b9b9b'
        }
      }
    }
  },
  data() {
    const timeArr = new Array(24).fill(1).map((item, index) => index <= 9 ? `0${index}:00` : `${index}:00`)
    const timeItemObj = {}
    const valueIndexObj = {}
    for (let i = 0; i < timeArr.length; i++) {
      const son = timeArr[i]
      timeItemObj[son] = new Array(60).fill(1).map((item, index) => {
        const h = i <= 9 ? `0${i}` : `${i}`
        const m = index <= 9 ? `0${index}` : `${index}`
        const value = h + ':' + m
        valueIndexObj[value] = {
          h: i,
          m: index,
          index: i * 60 + index
        }
        return {
          value
          // active: index === 0 && i !== 0
        }
      })
    }
    return {
      timeArr,
      timeItemObj,
      valueIndexObj
    }
  },
  computed: {
    scrollbarRef() {
      return this.$refs.scrollbarRef
    },
    calcAllLineLong() {
      const { lineWidth } = this
      return lineWidth * 24 * 60
    },
    calcAllLineStyle() {
      return {
        width: this.calcAllLineLong + 'px'
      }
    },
    calcMinuteItemStyle() {
      return (son) => {
        return this.calcMinuteItemStyleFn(son, this)
      }
    },
    calcOffsetStyle() {
      const { offsetStyle } = this
      return {
        position: 'absolute',
        width: '100%',
        height: '20px',
        top: '-20px',
        left: '0',
        background: 'transparent',
        zIndex: 2,
        ...offsetStyle
      }
    }
  },
  mounted() {
    console.log(this.$slots)
  },
  methods: {
    timeLineClick({ value }) {
      this.$emit('input', value)
      this.$emit('change', value)
    },

    timeLineMousewheel(event, data) {
      this.scrollbarRef.wrap.scrollLeft += Math.abs(data.pixelX) > Math.abs(data.pixelY) ? data.pixelX : data.pixelY
      event.preventDefault()
    }
  }
}
</script>

<style scoped lang="scss">
$menuBg: rgba(36, 60, 211, 0.3);

::v-deep .el-scrollbar__bar.is-horizontal {
  left: 0;
  box-sizing: border-box;
  height: 20px;
  padding: 3px 0 3px 10px;
  background: $menuBg;
  opacity: 1;
}

::v-deep .el-scrollbar__thumb {
  background-color: #233a75;
  border-radius: 0 100px 100px 0;
}

.timeLine {
  width: 100%;
}
.allLine {
  box-sizing: border-box;
  display: flex;
  width: 100%;

  .item {
    .minute {
      .minute-item-box {
        position: relative;
        display: flex;
        flex-direction: column;

        .fill {
          z-index: 1;
          flex: 1;
        }

        .minute-item {
          position: relative;

          .hours {
            position: absolute;
            top: -20px;
            font-size: 14px;
            white-space: nowrap;
            transform: translateX(-50%);
          }
        }

        .hover-item {
          position: absolute;
          top: -20px;
          z-index: 4;
          display: none;
          padding: 0 10px;
          font-size: 13px;
          white-space: nowrap;
          background: #fff;
          border-radius: 3px;
          transform: translateX(-50%);
        }

        &:hover {
          .hover-item {
            display: block;
          }
        }
      }
    }
  }
}
</style>

