<template>
  <div style="width: 100%;">
    <time-line v-model="time" />
  </div>
</template>
<script>
import TimeLine from '@/views/timeLine/timeLine'
export default {
  name: 'TimeLineView',
  components: { TimeLine },
  data() {
    return {
      time: '00:00'
    }
  },
  created() {
    console.log('time-line-view created')
  },
  mounted() {
    console.log(this.$route)
    console.log('time-line-view mounted')
  }
}
</script>
