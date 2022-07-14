<template>
  <div id="app">
<!--    <div @click="toTimeLine">timeLine</div>-->
    <div>
      <el-checkbox :indeterminate="false" :value="false">全选</el-checkbox>
      <el-checkbox :indeterminate="false" :value="true">全选</el-checkbox>
      <el-checkbox :indeterminate="true" :value="false">全选</el-checkbox>
      <el-checkbox :indeterminate="true" :value="true">全选</el-checkbox>
    </div>
<!--    <el-button @click="download">下载</el-button>-->
    <template v-for="item in routes">
      <router-link :to="item.path" :key="item.path">{{ item.name }}</router-link>&nbsp;&nbsp;
    </template>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { routes } from '@/router'
import extName from 'ext-name'
const urls = [
    'http://adas.wbtech.com/file//data/alarmFile/dailyVideo/20220626/50674/192180671993_01_22062610.ts.mp4',
    'http://0f0fb3b075c8899be7443c7b9fd0430e.cloud.xstrive.com:9502/vod/index.m3u8?command=record&channel=record1&start_time=1657641600000&end_time=1657727999999',
    'https://live.cloud.xstrive.com/hdl/_liveXsw_1/4c684e2a202e5203b0b31a57e0b0f6de.flv',
    'ws://47.103.153.132:4022/ws?port=10077&app=live&stream=03177574659_channel_4_playback'
]

urls.forEach(item => {
  const result = extName(item.split('?').filter(Boolean)[0])
  if(item.startsWith('ws')) {
    console.log({
      type: 'ws-flv',
      ext: '',
      mime: 'video/x-flv'
    })
  } else if(result.length) {
    console.log({ ext: result[0].ext, mime: result[0].mime, type: result[0].ext })
  }
})
export default {
  name: 'App',
  data() {
    return {
      routes
    }
  },
  methods: {
    async download() {

    },
    toTimeLine() {
      this.$router.replace({
        // path: '/timeLine',
        name: 'timeLine',
        params: { b: 1 }, // 通过 name跳转才能获取
        query: { a: 1 } //  通过 name/path跳转都能获取
      })
    }
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
