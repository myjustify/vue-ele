<template>
  <div
    v-loading="mapLoading"
    :class="[ comName ]"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <baidu-map
      class="map"
      :center="mapInfo.center"
      :zoom="mapInfo.zoom"
      :scroll-wheel-zoom="true"
      @moving="syncCenterAndZoom"
      @moveend="syncCenterAndZoom"
      @zoomend="syncCenterAndZoom"
      @ready="mapReady"
    >
      <bm-polyline
        :path="lushu.polylinePath"
        stroke-color="#00A86B"
        :stroke-opacity="1"
        :stroke-weight="3"
        :stroke-style="'solid'"
      />

      <bml-lushu
        v-if="mapManager && lushu.path.length>0"
        ref="lushu"
        :path="lushu.path"
        :icon="lushu.iconPoint"
        :rotation="true"
        :play="lushu.play"
        :info-window="lushu.infoWindow"
        :content="lushu.content"
        :speed="lushu.speed"
        @stop="lushuStop"
        @start="lushuStart"
        @tick="lushuTick"
      />
    </baidu-map>

    <div
      v-if="lushu.polylinePath && lushu.polylinePath.length"
      style="position: absolute; bottom: 0; width: 100%; box-sizing: border-box;"
    >
      <trajectory-progress
        v-model="lushu.progress"
        :speed.sync="lushu.speed"
        :speed-arr="lushu.speedArr"
        :play="lushu.play"
        :rate="lushu.rate"
        :total-dis="lushu.totalDis"
        :format-tooltip="lushuformatTooltip"
        @change="lushuSliderChange"
        @immediatePause="lushuPause"
        @toggle="lushuToggle"
      />
    </div>
    <!--    <el-button-group>-->
    <!--      <el-button>{{ lushu.speed }}</el-button>-->
    <!--      <el-button @click="lushuPlay">开始</el-button>-->
    <!--      <el-button @click="lushuPause">pause</el-button>-->
    <!--      <el-button @click="incSpeed">增加速度</el-button>-->
    <!--      <el-button @click="decSpeed">减速速度</el-button>-->
    <!--      <el-button @click="seek">seek</el-button>-->
    <!--      <el-button @click="rePlay">rePlay</el-button>-->
    <!--      <el-button @click="getI">getI</el-button>-->
    <!--      <el-button @click="sliderValue++">sliderValue+</el-button>-->
    <!--      <el-button @click="sliderValue&#45;&#45;">sliderValue-</el-button>-->
    <!--    </el-button-group>-->

    <!--    <el-slider-->
    <!--        v-model="sliderValue"-->
    <!--        :step="0.1"-->
    <!--        @dragStart="lushuPause"-->
    <!--        @change="sliderChange"-->
    <!--    >-->

    <!--    </el-slider>-->
  </div>
</template>

<script>
import { BmlLushu } from 'vue-baidu-map'
import MapUtils from '@/utils/map'
import lushuData from '@/views/lushu/data1'
import TrajectoryProgress from '@/components/TrajectoryProgress'
import lushuMixin from '@/utils/lushu'
export default {
  name: 'LuShu',
  mixins: [lushuMixin()],
  components: { TrajectoryProgress, BmlLushu },
  data() {
    return {
      comName: 'lu-shu',
      loadingText: '加载中...',
      mapLoading: true,
      mapInfo: {
        center: {
          lng: 111.52, lat: 36.08
        },
        zoom: 7
      },
      mapManager: null
    }
  },
  methods: {
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter()
      this.mapInfo.center.lng = lng
      this.mapInfo.center.lat = lat
      this.mapInfo.zoom = e.target.getZoom()
    },
    mapReady({ BMap, map }) {
      this.mapLoading = false
      this.mapManager = new MapUtils(map, BMap)
      const points = lushuData.map(son => {
        // return this.mapManager.genPoint({ lng: son.x, lat: son.y })
        return this.mapManager.genPoint(son)
      })
      this.lushuAutoSpeed((MapUtils.calcLineLength(points) / 1000).toFixed(2))
      this.lushu.path = JSON.parse(JSON.stringify(points)).slice(0, 1000)
      this.lushu.polylinePath = JSON.parse(JSON.stringify(points))
      // .slice(0,1000)
      this.mapManager.centerAndZoom(this.lushu.polylinePath)
    }
  }
}
</script>

<style lang="scss" scoped>
$name: '.lu-shu';
#{$name}{
  width: 100%;
  box-sizing: border-box;
  .map {
    width: 500px;
    height: 500px;
  }
}
</style>
