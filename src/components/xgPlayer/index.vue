<template>
  <div
      :class="[ comName ]"
      :style="{ width: '100%', height: '100%', ...customStyle }"
  >
    <div ref="xgRef" />
  </div>
</template>

<script>
import xgPlayer from 'xgplayer'
import HlsPlayer from 'xgplayer-hls'
import FlvJsPlayer from 'xgplayer-flv.js'
import errorPlugin from '@/components/xgPlayer/plugin/error'
import { timeoutPlugin } from '@/components/xgPlayer/plugin/timeoutPlugin'
import { getVideoType } from '@/components/xgPlayer/util'
const players = {
  mp4: xgPlayer,
  m3u8: HlsPlayer,
  flv: FlvJsPlayer,
  'ws-flv': FlvJsPlayer
}
const configs = {
  isLive: {
    isLive: true
  },
  autoplay: {
    autoplay: true,
    autoplayMuted: true
  },
  loop: true
}

xgPlayer.install(timeoutPlugin.name, timeoutPlugin.method)
xgPlayer.install(errorPlugin.name, errorPlugin.method)

export default {
  name: 'xgPlayer',
  props: {
    customStyle: {
      type: Object,
      default: () => ({})
    },
    videoObj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      comName: 'xgPlayer',
      player: null
    }
  },
  watch: {
    'videoObj.playUrl': {
      handler(value) {
        console.log(value)
        if (value) {
          this.unload()
          this.init()
        } else {
          this.unload()
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    this.unload()
  },
  methods: {
    init() {
      this.unload()
      if (!this.videoObj.playUrl) return
      const { type } = getVideoType(this.videoObj.playUrl)
      const XgPlayer = players[type]
      const p = this.getOptions(this.videoObj, type)
      this.player = new XgPlayer({
        el: this.$refs.xgRef,
        ignores: ['error'],
        ...p
      })
    },
    unload() {
      if (this.player) {
        this.player.destroy()
        this.player = null
      }
    },
    getOptions(videoObj, type) {
      const {
        playUrl,
        isLive = false,
        autoplay = true,
        loop = false,
        flvOptionalConfig = {},
        ...options
      } = videoObj
      const result = {
        fluid: true,
        playbackRate: [0.25, 0.5, 0.75, 1, 1.5, 2],
        defaultPlaybackRate: 1,
        timeoutNums: 10000,
        playsinline: true,
        poster: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAADKAQMAAACxE4SqAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAANQTFRFKCcn7ustjAAAACBJREFUeJztwQEBAAAAgiD/r25IQAEAAAAAAAAAAABfBig+AAHMC8RBAAAAAElFTkSuQmCC',
        ...options
      }
      if (type === 'flv' || type === 'ws-flv') {
        result.flvOptionalConfig = {
          enableWorker: true,
          autoFastForward: true,
          isLive: isLive,
          hasAudio: false, // 设置这个参数为false
          enableStashBuffer: false,
          ...flvOptionalConfig
        }
      }

      // if (type === 'm3u8') {
      //   result.useHls = true
      // }
      result.url = playUrl
      isLive && (Object.assign(result, configs.isLive))
      autoplay && (Object.assign(result, configs.autoplay))
      loop && (Object.assign(result, configs.loop))
      return result
    }
  }
}
</script>

<style lang="scss" scoped>
$name: '.xgPlayer';
#{$name}{
  ::v-deep .xgplayer {
    width: 100%;
    height: 100% !important;
    padding-top: 0 !important;
  }
}
</style>
