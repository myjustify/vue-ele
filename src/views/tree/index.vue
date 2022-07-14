<template>
  <div class="tree">
    <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"
    />

    <div class="el-row--flex">
      <div class="tree-box">
        <gr-tree
          ref="grTree"
          height="100%"
          :el-ref.sync="tree.ref"
          :data="tree.data"
          :default-expanded-keys.sync="tree.defaultExpandedKeys"
          show-checkbox
          :node-key="tree.nodeKey"
          :default-expand-all="tree.defaultExpandAll"
          :props="tree.defaultProps"
          :filter-node-method="tree.filterNodeMethod"
          :lazy="tree.lazy"
          :load="tree.load"
          @check="check"
          @check-change="checkChange"
        >
          <template slot-scope="{ node, data }">
            <div>
              {{ data.label }}
              <span v-if="data.vehicleDriveDesc||data.vehicleStatusDesc">({{ data.vehicleDriveDesc }})</span>
            </div>
          </template>
        </gr-tree>
      </div>
      <div style="flex: 1;">111</div>
    </div>

    <el-button @click="getCheckedNodes">getCheckedNodes</el-button>
    <el-button @click="getCheckedKeys">getCheckedKeys</el-button>
    <el-button @click="reset">reset</el-button>
  </div>
</template>
<script>
import treeData from '@/views/tree/data'
import { cloneDeep } from 'lodash-es'
import GrTree from '@/components/GrTree'

export default {
  name: 'TestTree',
  components: { GrTree },
  data() {
    return {
      tree: {
        ref: null,
        nodeKey: 'frontKey',
        data: [],
        defaultExpandAll: false,
        checkedKeys: [],
        checkedMap: {},
        halfCheckedKeys: [],
        checkedLeafKeys: [],
        checkedLeafMap: {},
        // defaultExpandedKeys: [10, 4, 1],
        defaultExpandedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'label',
          isLeaf: (data) => {
            return data.type === 1
          }
        },
        lazy: false,
        load(node, resolve) {
          if (node.level === 0) {
            return resolve(node.data)
          } else {
            resolve(node.data.children || [])
            // setTimeout(() => {
            //   resolve(node.data.children || [])
            // }, 0)
          }
        },
        filterNodeMethod(value, data) {
          return data.label.indexOf(value) !== -1
          // if (!value) {
          //   node.collapse()
          //   return true
          // }
          // if(node.shouldLoadData() && node.data.children && node.data.children.length) {
          //   node.loadData((res) => { // 可触发load
          //     console.log(res)
          //   })
          // }
          // const flag = data.label.indexOf(value) !== -1
          // flag ? node.expand(() => {}, true) : ''
          // return flag
        }
      },
      filterText: ''
    }
  },
  computed: {
    grTree() {
      return this.$refs.grTree
    }
  },
  watch: {
    filterText(val) {
      this.grTree.defaultExpandedKeysTemp = []
      this.tree.ref.filter(val)
    }
  },
  created() {
    console.log('test-tree created')
  },
  mounted() {
    function traverse(data, callback) {
      data.forEach(item => { // 0.426025390625 ms
        callback && callback(item)
        if (item.children) {
          traverse(item.children, callback)
        }
      })

      // for (let i = 0; i < data.length; i++) { // 0.56787109375 ms
      //   callback && callback(data[i]);
      //   if (data[i].children) {
      //     traverse(data[i].children, callback);
      //   }
      // }
    }
    console.time('test-tree')
    traverse(treeData, (item) => {
      item.id = item.frontKey
    })
    console.timeEnd('test-tree')
    console.log(treeData)
    this.tree.data = treeData
  },
  methods: {
    reset() {
      console.log('reset')
      const node = this.tree.ref.getNode(this.tree.data[0])
      this.grTree.updateNodeState(node, { label: '222' })
      // const newTree = cloneDeep(treeData)
      // this.tree.data[0].label = '111111'
      // this.tree.data = newTree
      // this.tree.defaultExpandedKeys = [...this.grTree.defaultExpandedKeysTemp]
    },
    // checked: 是否选中 sonChecked: 子节点是否选中
    checkChange(data, checked, sonChecked) {
      console.log('checkChange', data.label, checked, sonChecked)
      // const node = this.tree.ref.getNode(data)
    },
    // check 后获取最终结果
    check(data, { checkedNodes, checkedKeys, halfCheckedKeys }) {
      // console.log(data, checkedNodes， checkedKeys)
      // const checkedLeafKeys = []
      // const result = checkedNodes.filter((item) => this.tree.defaultProps.isLeaf(item))
      // for (let i = 0; i < result.length; i++) {
      //   checkedLeafKeys.push(result[i][this.tree.nodeKey])
      // }
      // console.log(checkedLeafKeys, halfCheckedKeys, checkedKeys)
      // this.tree.checkedLeafKeys = checkedLeafKeys
      // this.tree.halfCheckedKeys = halfCheckedKeys
      // this.tree.checkedKeys = checkedKeys

      // const that = this
      // function traverse(arr, flag) {
      //   // flag true:选中 false: 不选
      //   if (arr.children && arr.children.length) {
      //     arr.children.forEach((item) => {
      //       if(flag) {
      //         !that.tree.checkedLeafKeys.includes(item.id) && that.tree.checkedLeafKeys.push(item.id)
      //         !that.tree.checkedKeys.includes(item.id) && that.tree.checkedKeys.push(item.id)
      //       } else {
      //         that.tree.checkedLeafKeys.includes(item.id) && that.tree.checkedLeafKeys.splice(that.tree.checkedLeafKeys.indexOf(item.id), 1)
      //         that.tree.checkedKeys.includes(item.id) && that.tree.checkedKeys.splice(that.tree.checkedKeys.indexOf(item.id), 1)
      //       }
      //       if(item.children && item.children.length) {
      //         traverse(item.children, flag)
      //       }
      //     })
      //   }
      // }
      // if(checkedKeys.includes(data[this.tree.nodeKey])) { // 选中
      //   traverse(data, true)
      // } else {
      //   traverse(data, false)
      // }
    },
    getCheckedNodes() {
      // 1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
      const leafOnly = false; const includeHalfChecked = false
      console.log(this.tree.ref.getCheckedNodes(leafOnly, includeHalfChecked))
    },
    getCheckedKeys() {
      console.log(this.tree.ref.getCheckedKeys())
    }
  }
}
</script>
<style lang="scss" scoped>
.tree-box {
  min-width: 300px;
  height: 400px;
}
</style>
