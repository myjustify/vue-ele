import moment from 'moment'

export default function lushuMixin(refName = 'lushu', lushuObj = 'lushu') {
  return {
    data() {
      return {
        [lushuObj]: {
          path: [], // 地理坐标点
          polylinePath: [], // 线路
          landmarkPois: [{
            lat: 29.903969998323923,
            lng: 104.35075627116314, html: '加油站', pauseTime: 1000
          }],
          infoWindow: true,
          content: '',
          iconPoint:
            {
              url: 'http://api.map.baidu.com/library/LuShu/1.2/examples/car.png',
              size: { width: 41, height: 23 }
            },
          startIndex: 0,
          isEnded: false,
          play: true,
          rate: 4000,
          speed: 4000,
          speedArr: [4000, 8000, 16000],
          progress: 0,
          totalDis: 0,
          currentIndex: -1
        }
      }
    },
    methods: {
      [lushuObj + 'AutoSpeed'](total) {
        const temp = +total
        const result = (temp > 30 ? 4000 : temp * 25).toFixed(0)
        const res = +(result[0] + '0'.repeat(result.length - 1)) || 1
        this[lushuObj].rate = res
        this[lushuObj].speed = res
        this[lushuObj].speedArr = [res, res * 2, res * 4]
      },
      // 手动开始播放
      [lushuObj + 'Play']() {
        if (this[lushuObj].isEnded) {
          this[lushuObj].isEnded = false
          this.lushuRePlay()
          return
        }
        this[lushuObj].play = true
      },
      [lushuObj + 'Pause']() {
        this[lushuObj].play = false
      },
      [lushuObj + 'Toggle'](v) {
        v && this.lushuPlay()
        !v && this.lushuPause()
      },
      // lushu @start
      [lushuObj + 'Start']() {
        const lushuRef = this.$refs[refName]
        const originInstance = lushuRef.originInstance
        originInstance._addMarker = function() {
          if (originInstance._marker) {
            originInstance.stop()
            originInstance._map.removeOverlay(originInstance._marker)
            clearTimeout(originInstance._timeoutFlag)
          }
          originInstance._overlay && originInstance._map.removeOverlay(originInstance._overlay)
          const marker = new lushuRef.BMap.Marker(originInstance._path[0])
          originInstance._opts.icon && marker.setIcon(originInstance._opts.icon)
          originInstance._map.addOverlay(marker)
          marker.setAnimation(null)
          originInstance._marker = marker
        }
      },
      [lushuObj + 'Stop']() {
        console.log('lushu stop')
        this[lushuObj].play = false
        this[lushuObj].currentIndex = -1
        this[lushuObj].startIndex = 0
        this[lushuObj].isEnded = true
      },
      [lushuObj + 'Seek'](progress) {
        this.$refs[refName].originInstance.stop()
        if (this[lushuObj].isEnded) {
          this[lushuObj].isEnded = false
        }
        const len = this[lushuObj].polylinePath.length
        const i = Math.floor((len - 1) * (progress / 100))
        this[lushuObj].startIndex = i
        this[lushuObj].path = JSON.parse(JSON.stringify(this[lushuObj].polylinePath)).slice(i)
        setTimeout(() => {
          this[lushuObj].play = true
        })
      },
      [lushuObj + 'RestParams']() {
        this[lushuObj].currentIndex = -1
        this[lushuObj].startIndex = 0
        this[lushuObj].play = true
        this[lushuObj].speed = 4000
        this[lushuObj].rate = 4000
        this[lushuObj].speedArr = [4000, 8000, 16000]
      },
      [lushuObj + 'RePlay']() {
        this[lushuObj].currentIndex = -1
        this[lushuObj].startIndex = 0
        this[lushuObj].play = false
        this[lushuObj].path = JSON.parse(JSON.stringify(this[lushuObj].polylinePath))
        setTimeout(() => {
          this[lushuObj].play = true
        }, 100)
      },
      [lushuObj + 'Tick'](index) {
        if (index < this[lushuObj].currentIndex) return
        this[lushuObj].currentIndex = index
        const len = this[lushuObj].polylinePath.length
        let percent = (((index + this[lushuObj].startIndex + 1) / (len - 1)) * 100).toString()
        const dotIndex = percent.indexOf('.')
        percent = percent.slice(0, dotIndex === -1 ? percent.length : dotIndex + 2)
        this[lushuObj].progress = +percent
      },
      [lushuObj + 'SliderChange'](e) {
        this[lushuObj].currentIndex = -1
        this.lushuSeek(e)
      },
      [lushuObj + 'formatTooltip'](progress) {
        const len = this[lushuObj].polylinePath.length
        const i = Math.floor((len - 1) * (progress / 100))
        const son = this[lushuObj].polylinePath[i]
        try {
          return son.gpsTime ? moment(son.gpsTime).format('YYYY-MM-DD HH:mm:ss') : '--'
        } catch (err) {
          return '--'
        }
      }
    }
  }
}
