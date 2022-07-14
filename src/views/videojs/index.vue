<template>
  <div>
    <!--    想让video标签 自动播放 视频，必须先设置为静音。-->
    <video
      ref="videoPlayer"
      muted
      class="video-js"
    />
  </div>
</template>

<script>
import videojs from 'video.js'
import 'flv.js'
import 'videojs-flvjs-es6'
export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default() {
        return {
          autoplay: true,
          controls: true,
          // liveui: true,
          techOrder: ['html5', 'flvjs'],
          sources: [ // https://www.runoob.com/http/mime-types.html
            // {
            //   src: 'http://adas.wbtech.com/file//data/alarmFile/dailyVideo/20220626/50674/192180671993_01_22062610.ts.mp4',
            //   // type: 'video/mp4'
            // },
            {
              src: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-uni4934e7b/c4d93960-5643-11eb-a16f-5b3e54966275.m3u8'
              // type: 'application/vnd.apple.mpegurl'
            }
            // { // 实时视频
            //   src: 'https://live.cloud.xstrive.com/hdl/_liveXsw_1/4c684e2a202e5203b0b31a57e0b0f6de.flv',
            //   type: 'video/x-flv' // flv
            // },
            // {
            //   src: 'ws://47.103.153.132:4022/ws?port=10077&app=live&stream=03177574659_channel_4_playback',
            //   type: 'video/x-flv'
            // }
          ],
          flvjs: {
            mediaDataSource: {
              type: 'flv',
              autoFastForward: true,
              isLive: false,
              hasAudio: false,
              enableStashBuffer: false,
              duration: 1
            }
          }
        }
      }
    }
  },
  data() {
    return {
      player: null
    }
  },
  mounted() {
    // this.$prompt('', '确定终止?', {
    //   customClass: 'stop-prompt',
    //   inputPlaceholder: '请输入终止原因',
    //   inputType: 'textarea', // 输入框类型
    //   inputValidator: (q) => {
    //     const flag = (q === null || q === '' || q === undefined)
    //     return flag ? '请输入终止原因' : true
    //   }
    // })
    console.log(videojs.url.parseUrl(this.options.sources[0].src), videojs.url.getFileExtension(this.options.sources[0].src))
    this.player = videojs(this.$refs.videoPlayer, this.options, () => {
      this.player.log('onPlayerReady', this)
      this.player.on('ended', () => {
        console.log('播放结束')
        this.player.pause()
      })
      this.player.on('error', () => {
        console.log('error')
        // this.player.pause();
      })
      this.player.on('pause', () => {
        console.log('pause')
        this.player.currentTime(0)
      })
      this.player.on('play', () => {
        // this.player.currentTime(0);
        console.log('play')
      })
      this.player.on('ready', () => {
        // setTimeout(() => {
        //   const PlayToggle = videojs.getComponent('PlayToggle')
        //   const btn = new PlayToggle(this.player)
        //   if(btn.player_.paused()) {
        //     btn.handleClick()
        //   }
        // }, 100)
      })
    })
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose()
    }
  }
}
</script>
<style lang="scss">
.video-js {
  width: 300px;
  height: 200px;
}

.stop-prompt {
  position: relative;

  .el-message-box__input {
    padding-left: 15px;
    position: relative;

    &::after {
      content: '*';
      display: block;
      position: absolute;
      top: 15px;
      left: 0;
      color: #ee2020;
      font-size: 13px;
     }
  }
}
</style>
