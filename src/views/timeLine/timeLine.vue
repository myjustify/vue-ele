<template>
  <div
    ref="timeLine"
    v-mousewheel="timeLineMousewheel"
    class="timeLine"
    style="margin-top: 20px; user-select: none;"
  >
    <!--    <div class="currentLine" />-->
    <div
      class="allLine"
      :style="[ calcAllLineStyle ]"
    >
      <div
        v-for="(item) in timeArr"
        :key="item"
        class="item"
      >
        {{ item }}
        <div class="minute">
          <template v-for="(son) in timeItemObj[item]">
            <div
              :key="son.value"
              class="minute-item"
              :class="{ active: son.active, currentActive: son.value === value }"
              @click="timeLineClick(son)"
            />
          </template>
        </div>
      </div>
    </div>
    <div class="viewTimeBox">
      <div
        class="viewTime"
        :style="calcViewTimeStyle"
      >{{ value }}</div>
    </div>
  </div>
</template>
<script>
import Mousewheel from 'element-ui/lib/directives/mousewheel'
export default {
  name: 'TimeLine',
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
      default: 1.3
    },
    viewTimeWidth: {
      type: Number,
      default: 60
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
          value,
          active: index === 0 && i !== 0
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
    calcViewTimeStyle() {
      const { viewTimeWidth, calcViewTimeLeft, value } = this
      return {
        width: viewTimeWidth + 'px',
        marginLeft: calcViewTimeLeft(value)
      }
    },
    calcViewTimeLeft() {
      return (v) => {
        const { lineWidth, viewTimeWidth } = this
        const minuteIndex = this.valueIndexObj[v].index
        const res = (lineWidth * minuteIndex - viewTimeWidth / 2).toFixed(2)
        const maxLeft = (this.calcAllLineLong - viewTimeWidth).toFixed(2)
        return (+res < 0 ? 0 : +res > +maxLeft ? maxLeft : res) + 'px'
      }
    },
    timeLineRef() {
      return this.$refs.timeLine
    },
    calcAllLineLong() {
      const { lineWidth } = this
      return lineWidth * 24 * 60
    },
    calcAllLineStyle() {
      return {
        width: this.calcAllLineLong + 'px'
      }
    }
  },
  created() {
    console.log('timeLine created')
  },
  mounted() {
    console.log('timeLine mounted')
  },
  methods: {
    timeLineClick({ value }) {
      this.$emit('input', value)
      this.$emit('change', value)
    },
    timeLineMousewheel(event, data) {
      this.timeLineRef.scrollLeft += Math.abs(data.pixelX) > Math.abs(data.pixelY) ? data.pixelX / 2 : data.pixelY / 2
      event.preventDefault()
    }
  }
}
</script>

<style scoped lang="scss">
.timeLine {
  width: 100%;
  overflow-x: scroll;
  background: #f6f3f3;
  border-radius: 0;
  cursor: pointer;

  &::-webkit-scrollbar {
    background: transparent;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 0;
  }

  &::-webkit-scrollbar-track {
    border-radius: 0;
    box-shadow: none;
  }

  .currentLine {
    height: 6px;
    background: #098000;
  }

  .allLine {
    display: flex;
    height: 30px;

    .item {
      position: relative;
      display: flex;
      flex: 1;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      height: 100%;
      font-size: 14px;
      color: #333;

      .minute {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;

        .minute-item {
          display: inline-block;
          height: 100%;
          flex: 1;

          &.active {
            background-color: #666;
          }

          &.currentActive {
            background-color: red;
          }
        }
      }
    }
  }

  .viewTimeBox {
    padding: 4px 0;
    .viewTime {
      box-sizing: border-box;
      width: 70px;
      height: 18px;
      margin-top: 2px;
      font-size: 12px;
      line-height: 16px;
      color: red;
      text-align: center;
      border: 1px solid red;
      //border-radius: 4px;
      transition: all ease-in-out 0.5s;
    }
  }
}
</style>

