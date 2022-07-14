<template>
  <div>
    <choose-point
      :point.sync="point"
      :custom-style="customStyle"
      @success="success"
      @fail="fail"
    />

    <template v-if="dialogProps.dialogShow">
      <component
        :is="dialogProps.dialogName"
        :is-show.sync="dialogProps.dialogShow"
        :row-data="dialogProps.rowData"
        @handleSearch="handleSearch"
      />
    </template>

  </div>
</template>
<script>
import ChoosePoint from '@/components/choosePoint'
export default {
  name: 'TestChoosePoint',
  components: { ChoosePoint },
  data() {
    return {
      dialogProps: {
        dialogShow: false,
        dialogName: '',
        rowData: {}
      },
      customStyle: {
        width: '500px',
        height: '500px'
      },
      point: { lng: 111.52, lat: 36.08 }
    }
  },
  created() {},
  methods: {
    success(e) {
      // console.log(e)
    },
    fail(e) {
      // console.log(e)
    },
    dialogToggle(rowData = {}, dialogName) {
      dialogName && (this.dialogProps.dialogName = dialogName)
      this.dialogProps.dialogShow = !this.dialogProps.dialogShow
      this.dialogProps.rowData = rowData
    }
  }
}
</script>
