<template>
  <div style="width: 100%;">
    <time-line v-model="time">
      <div>11111</div>
    </time-line>
  </div>
</template>
<script>
import TimeLine from '@/views/timeLineNew/timeLine'
export default {
  name: 'TimeLineNewView',
  components: { TimeLine },
  data() {
    return {
      time: '00:00'
    }
  },
  created() {
    console.log('time-line-new-view created')
  },
  mounted() {
    console.log('time-line-new-view mounted')
  }
}
</script>
