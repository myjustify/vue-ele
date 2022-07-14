<template>
  <div
    v-loading="mapLoading"
    :element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    :class="[ comName ]"
    :style="[calcStyle]"
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
      @dragstart="dragstart"
      @dragging="dragging"
      @dragend="dragend"
    >
      <bm-marker
        v-if="currentPoint"
        dragging
        :position="{ lng: currentPoint.lng, lat:currentPoint.lat }"
        :icon="{
          url: currentPointIcon, size: { width: 36, height: 36 },
          opts: { anchor: { width: 18, height: 36 }, imageSize: { width: 36, height: 36 } }
        }"
        @dragend="markDragend"
      />
    </baidu-map>
  </div>
</template>

<script>
import { bd2wgs, wgs2bd } from '@/utils/offsetCorrection'
export default {
  name: 'ChoosePoint',
  props: {
    customStyle: {
      type: Object,
      default: () => ({})
    },
    customTransLoading: {
      type: Boolean,
      default: false
    },
    transformLoading: {
      type: Function,
      default: function() {}
    },
    transformLoaded: {
      type: Function,
      default: function() {}
    },
    point: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      comName: 'choosePoint',
      mapLoading: false,
      loadingText: '拼命加载中...',
      BMap: null,
      map: null,
      mapInfo: {
        center: {
          lng: 111.52, lat: 36.08
        },
        zoom: 7
      },
      currentPointIcon: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSIxMDAwIiB3aWR0aD0iMTAwMCIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgo8bWV0YWRhdGE+SWNvRm9udCBJY29uczwvbWV0YWRhdGE+Cjx0aXRsZT5sb2NhdGlvbi1waW48L3RpdGxlPgo8Z2x5cGggZ2x5cGgtbmFtZT0ibG9jYXRpb24tcGluIiB1bmljb2RlPSImI3hlZjc5OyIgaG9yaXotYWR2LXg9IjEwMDAiIC8+CjxwYXRoIGZpbGw9InJlZCIgZD0iTTQ4MC43IDkxNi4yYy0xOC44OTk5OTk5OTk5OTk5NzctMjUuNzAwMDAwMDAwMDAwMDQ1LTM3LjM5OTk5OTk5OTk5OTk4LTUwLjgwMDAwMDAwMDAwMDA3LTU1LjE5OTk5OTk5OTk5OTk5LTc2LjIwMDAwMDAwMDAwMDA1LTYxLjE5OTk5OTk5OTk5OTk5LTg3LTExNy44MDAwMDAwMDAwMDAwMS0xNzYuNzk5OTk5OTk5OTk5OTUtMTYzLjUtMjczLjEtMjIuNDAwMDAwMDAwMDAwMDA2LTQ3LjI5OTk5OTk5OTk5OTk1NS00My05NS41LTUzLTE0Ny0xOC45MDAwMDAwMDAwMDAwMDYtOTYuNTk5OTk5OTk5OTk5OTcgMy41LTE4My4zOTk5OTk5OTk5OTk5OCA2OC44OTk5OTk5OTk5OTk5OC0yNTcuMjk5OTk5OTk5OTk5OTUgNjMuMTAwMDAwMDAwMDAwMDItNzEuMTAwMDAwMDAwMDAwMDIgMTQzLjkwMDAwMDAwMDAwMDAzLTEwMy43MDAwMDAwMDAwMDAwMiAyMzguNzAwMDAwMDAwMDAwMDUtOTkuODAwMDAwMDAwMDAwMDMgMTMyLjI5OTk5OTk5OTk5OTk1IDUuNSAyNDcuNzk5OTk5OTk5OTk5OTUgMTA1LjAwMDAwMDAwMDAwMDAxIDI3NC42OTk5OTk5OTk5OTk5MyAyMzUuMDk5OTk5OTk5OTk5OTcgMTEgNTMuNDAwMDAwMDAwMDAwMDM0IDcuNDAwMDAwMDAwMDAwMDkxIDEwNS42MDAwMDAwMDAwMDAwMi05IDE1Ny42MDAwMDAwMDAwMDAwMi0zMi44OTk5OTk5OTk5OTk5OCAxMDMuMzk5OTk5OTk5OTk5OTgtODQuMzk5OTk5OTk5OTk5OTggMTk3LjUtMTQzLjI5OTk5OTk5OTk5OTk1IDI4Ny43MDAwMDAwMDAwMDAwNS00Mi4xMDAwMDAwMDAwMDAwMiA2NC4zOTk5OTk5OTk5OTk5OC04Ny44OTk5OTk5OTk5OTk5OCAxMjYuMzk5OTk5OTk5OTk5OTgtMTMyLjEwMDAwMDAwMDAwMDAyIDE4OS4zOTk5OTk5OTk5OTk5OC0xLjA5OTk5OTk5OTk5OTk2NiAxLjUtMi4xOTk5OTk5OTk5OTk5ODg2IDIuODk5OTk5OTk5OTk5OTc3My0zLjY5OTk5OTk5OTk5OTk4ODYgNC42MDAwMDAwMDAwMDAwMjMtMi4xOTk5OTk5OTk5OTk5ODg2IDIuMzk5OTk5OTk5OTk5OTc3My0xMi4xOTk5OTk5OTk5OTk5ODktNy0yMi41LTIxeiBtMTY0LjgtNTUxLjgwMDAwMDAwMDAwMDFjMy44OTk5OTk5OTk5OTk5NzczLTc1LjI5OTk5OTk5OTk5OTk1LTU4LjYwMDAwMDAwMDAwMDAyLTE0NS40OTk5OTk5OTk5OTk5Ny0xMzMuMjk5OTk5OTk5OTk5OTUtMTQ5LjU5OTk5OTk5OTk5OTk3LTg2LjIwMDAwMDAwMDAwMDA1LTQuODAwMDAwMDAwMDAwMDExLTE1My4wMDAwMDAwMDAwMDAwNiA1NS4xOTk5OTk5OTk5OTk5OS0xNTcuNjAwMDAwMDAwMDAwMDIgMTQxLjg5OTk5OTk5OTk5OTk4LTQgNzUuMzAwMDAwMDAwMDAwMDEgNTkuODk5OTk5OTk5OTk5OTggMTQ1LjIgMTM2LjIgMTQ4LjggODMuOTAwMDAwMDAwMDAwMDMgNCAxNTAuNDAwMDAwMDAwMDAwMDMtNTYuODAwMDAwMDAwMDAwMDEgMTU0LjctMTQxLjEwMDAwMDAwMDAwMDAyeiIvPgo8L3N2Zz4K',
      currentPoint: '',
      markerPixel: ''
    }
  },
  computed: {
    calcStyle() {
      return {
        width: '100%',
        height: '100%',
        ...this.customStyle
      }
    },
    pointStr() {
      return JSON.stringify(this.point)
    },
    projection() {
      return this.map && this.map.getMapType().getProjection()
    }
  },
  watch: {
    pointStr: {
      handler() {
        this.initPoint(this.point)
      },
      deep: true
    }
  },
  destroyed() {
    this.map && this.map.removeEventListener('click', this.choosePoint)
  },
  mounted() {
    this.mapLoading = true
  },
  methods: {
    initPoint(point) {
      // eslint-disable-next-line no-prototype-builtins
      if (point && this.hasOwnProperty(point, 'lat') && point.lat) {
        const [lat, lng] = wgs2bd(point.lat, point.lng)
        this.currentPoint = { lat, lng }
      } else {
        this.currentPoint = ''
      }
    },
    panTo(point) {
      if (this.BMap && point && point.lat) {
        if (point instanceof this.BMap.Point) {
          this.map.panTo(point)
        } else {
          this.map.panTo(new this.BMap.Point(point.lng, point.lat))
        }
      }
    },
    hasOwnProperty(point, key) {
      return Object.prototype.hasOwnProperty.call(point, key)
    },
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter()
      this.mapInfo.center.lng = lng
      this.mapInfo.center.lat = lat
      this.mapInfo.zoom = e.target.getZoom()
    },
    mapReady({ BMap, map }) {
      this.mapLoading = false
      this.BMap = BMap
      this.map = map
      this.map.setDefaultCursor('crosshair')
      const { point } = this
      this.initPoint(point)
      this.panTo(this.currentPoint)
      this.map.addEventListener('click', this.choosePoint)
    },
    markDragend(e) {
      this.choosePoint(e)
    },
    choosePoint(e) {
      // const prevPoint = this.currentPoint
      // if (!this.customTransLoading) {
      //   this.mapLoading = true
      //   this.loadingText = '地址获取中...'
      // } else {
      //   this.transformLoading()
      // }
      const point = e.point
      const wgsPoint = bd2wgs(point.lat, point.lng)
      this.$emit('update:point', wgsPoint)
      this.$emit('success', { point, wgsPoint })
      // this.getLocation(point)
      //   .then(res => {
      //     this.$emit('update:point', point)
      //     this.$emit('success', { ...res, wgsPoint })
      //   })
      //   .catch(err => {
      //     this.currentPoint = prevPoint
      //     this.$emit('fail', { errMsg: err, prevPoint })
      //   })
      //   .finally(() => {
      //     if (!this.customTransLoading) {
      //       this.mapLoading = false
      //       this.loadingText = '拼命加载中...'
      //     } else {
      //       this.transformLoaded()
      //     }
      //   })
    },
    getStandardPoint(point) {
      if (point instanceof this.BMap.Point) {
        return point
      }
      return new this.BMap.Point(point.lng, point.lat)
    },
    getLocation(point) {
      return new Promise((resolve, reject) => {
        new this.BMap.Geocoder().getLocation(this.getStandardPoint(point), (res) => {
          if (res) {
            const { addressComponents, surroundingPois, point } = res
            const { city, district, province, street, streetNumber, town } = addressComponents
            const address = (street || '') + (surroundingPois.length ? surroundingPois[0].title : '')
            resolve({
              city, district, province, street, streetNumber, town, address, point, originData: res
            })
          } else {
            reject('解析失败')
          }
        })
      })
    },
    getPoint(address = '') {
      return new Promise((resolve, reject) => {
        if (!address) return this.getPoint({ lat: 0, lng: 0 })
        new this.BMap.Geocoder().getPoint(address, (result) => {
          if (result) {
            resolve(result)
          } else {
            reject('经纬度获取失败')
          }
        })
      })
    },
    dragstart() {
      const { currentPoint } = this
      if (!currentPoint) return
      const { lng, lat } = currentPoint
      this.markerPixel = this.map.pointToPixel(new this.BMap.Point(lng, lat))
      this.getMarkerPoint(this.markerPixel)
    },
    dragend() {
      const { currentPoint } = this
      if (!currentPoint) return
      this.getMarkerPoint(this.markerPixel)
    },
    dragging() {
      const { currentPoint } = this
      if (!currentPoint) return
      this.getMarkerPoint(this.markerPixel)
    },
    getMarkerPoint(pixel) {
      const currentPoint = this.map.pixelToPoint(pixel)
      this.choosePoint({ point: currentPoint })
    }
  }
}
</script>

<style lang="scss" scoped>
$name: '.choosePoint';

#{ $name } {
  .map {
    width: 100%;
    height: 100%;
  }
}
</style>
