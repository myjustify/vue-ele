<template>
  <div :class="[ comName ]">
    <gr-slider
      v-bind="$attrs"
      :step="0.1"
      v-on="$listeners"
    />
    <div class="operate">
      <div class="totalDis">
        总里程(≈): {{ totalDis }} Km
      </div>

      <div class="control el-row--flex is-align-middle is-justify-space-between">
        <div
          style="width: 14px; height: 20px;"
          class="el-row--flex is-align-middle is-justify-center"
        >
          <el-image
            :src="require('@/assets/TrajectoryProgress/pre.png')"
            @click="decSpeed"
          />
        </div>
        <div
          style="width: 30px; height: 30px;"
          class="el-row--flex is-align-middle is-justify-center"
        >
          <el-image
            :src="play ? require('@/assets/TrajectoryProgress/play.png'): require('@/assets/TrajectoryProgress/pause.png')"
            @click="toggle"
          />
        </div>
        <div
          style="width: 14px; height: 20px;"
          class="el-row--flex is-align-middle is-justify-center"
        >
          <el-image
            :src="require('@/assets/TrajectoryProgress/next.png')"
            @click="incSpeed"
          />
        </div>

        <div
          class="currentSpeed"
          style="font-size: 15px;"
          @click="pollSpeed"
        >x{{ speed / rate }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash-es'

export default {
  name: 'TrajectoryProgress',
  props: {
    totalDis: {
      type: [Number, String],
      default: 0
    },
    play: {
      type: Boolean,
      default: false
    },
    speedArr: {
      type: Array,
      default: () => [4000, 8000, 16000]
    },
    speed: {
      type: Number,
      default: 4000
    },
    rate: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      comName: 'trajectory-progress',
      sliderValue: 0
    }
  },
  methods: {
    debounceFn: debounce(function(fn) {
      fn && fn()
    }, 100),
    toggle() {
      this.debounceFn(() => {
        this.$emit('toggle', !this.play)
        this.$emit('update:play', !this.play)
      })
    },
    // 减速
    decSpeed() {
      this.debounceFn(() => {
        const index = this.speedArr.indexOf(this.speed)
        if (index > 0) {
          this.$emit('update:speed', this.speedArr[index - 1])
          this.$emit('speedChange', this.speedArr[index - 1])
        }
      })
    },
    // 加速
    incSpeed() {
      this.debounceFn(() => {
        const index = this.speedArr.indexOf(this.speed)
        if (index < this.speedArr.length - 1) {
          this.$emit('update:speed', this.speedArr[index + 1])
          this.$emit('speedChange', this.speedArr[index + 1])
        }
      })
    },
    pollSpeed() {
      this.debounceFn(() => {
        const index = this.speedArr.indexOf(this.speed)
        if (index < this.speedArr.length - 1) {
          this.$emit('update:speed', this.speedArr[index + 1])
          this.$emit('speedChange', this.speedArr[index + 1])
        } else {
          this.$emit('update:speed', this.speedArr[0])
          this.$emit('speedChange', this.speedArr[0])
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$name: '.trajectory-progress';
#{ $name } {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  padding: 0 20px;
  background: $theme-color-light;

  ::v-deep .el-slider__runway {
    height: 4px;
    background-color: #31384f;
  }

  ::v-deep .el-slider__bar {
    height: 4px;
    background: linear-gradient(to right, #a5eef1, #6d90c3);
  }

  ::v-deep .el-slider__button-wrapper {
    width: 34px;
    height: 34px;
  }

  ::v-deep .el-slider__button {
    background-color: #7bb3ef;
    border: solid 2px #5d82b0;
  }

  .operate {
    position: relative;
    display: flex;
    justify-content: center;
    padding: 0 0 10px;
    margin-top: -6px;

    .control {
      width: 200px;

      .currentSpeed {
        padding: 0 10px;
        color: #fff;
        background-color: #7bb3ef;
        border-radius: 2px;
      }
    }

    .totalDis {
      position: absolute;
      right: 0;
      bottom: 10px;
      color: #6ca5bc;
    }
  }

}
</style>
