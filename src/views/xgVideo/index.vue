<template>
	<div :class="[ comName ]">
    <xg-player
        :custom-style="{ width: '300px' }"
        :video-obj="{
          playUrl: '//lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4',
          // playUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-uni4934e7b/c4d93960-5643-11eb-a16f-5b3e54966275.m3u8',
          // playUrl: 'ws://47.103.153.132:4022/ws?port=10077&app=live&stream=03177574659_channel_4_playback'
        }"
    >
    </xg-player>
  </div>
</template>

<script>
	import XgPlayer from '@/components/xgPlayer'
  export default {
		name:"xgVideo",
    components: {XgPlayer},
    activated() {
      console.log('activated')
    },
    deactivated() {
      console.log('deactivated')
    },
    destroyed() {
      console.log('destroyed')
    },
    data(){
			return {
				comName: "xgVideo",
        player: null
			}
		},
    mounted() {},
    methods: {}
  }
</script>

<style lang="scss" scoped>
$name: '.xgVideo';
#{$name}{
  width: 100%;
  height: 100%;
}
</style>
