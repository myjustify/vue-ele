<template>
  <div :class="[ comName ]">
    <vue-easy-tree
        ref="tree"
        class="gr-tree-main"
        :node-key="nodeKey"
        :props="$attrs.props || defaultProps"
        :auto-expand-parent="false"
        :default-expanded-keys="defaultExpandedKeys"
        v-bind="$attrs"
        v-on="$listeners"
        @node-expand="nodeExpand"
        @node-collapse="nodeCollapse"
    >
      <template slot-scope="{ node, data }">
        <slot :node="node" :data="data">
          <template v-if="!$scopedSlots.default">
            {{ node[$attrs.props.label] || node[defaultProps.label] }}
          </template>
        </slot>
      </template>
    </vue-easy-tree>

  </div>
</template>

<script>
import VueEasyTree from '@/components/vueEasyTree'
export default {
  name: 'gr-tree',
  components: {
    VueEasyTree
  },
  props: {
    nodeKey: {
      type: String,
      default: 'value'
    },
    defaultExpandedKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      comName: 'gr-tree',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultExpandedKeysTemp: []
    }
  },
  computed: {
    tree() {
      return this.$refs.tree
    }
  },
  watch: {
    defaultExpandedKeys(val) {
      this.defaultExpandedKeysTemp = val
    }
  },
  mounted() {
    this.$emit('update:el-ref', this.tree)
  },
  methods: {
    loadAllData(node, props) {
      if (node.shouldLoadData() && node.data.children && node.data.children.length) {
        node.loadData(() => {
          if (node.childNodes && node.childNodes.length) {
            for (let i = 0; i < node.childNodes.length; i++) {
              this.loadAllData(node.childNodes[i], props)
            }
          }
        }, props)
      }
    },
    collapseAll(nodes) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        node.collapse()
        this.nodeCollapse(node.data, node)
        if (node.childNodes) {
          for (let i = 0; i < node.childNodes.length; i++) {
            this.collapseAll([node.childNodes[i]])
          }
        }
      }
    },
    expandAll(nodes) {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        node.expand(() => {
          this.nodeExpand(node.data, node)
          if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; i++) {
              this.expandAll([node.childNodes[i]])
            }
          }
        })
      }
    },
    nodeExpand(e, node) {
      if (node.isLeaf) return
      const nodeKey = this.nodeKey
      const id = e[nodeKey]
      const defaultExpandedKeysTemp = new Set(this.defaultExpandedKeysTemp)
      defaultExpandedKeysTemp.add(id)
      this.defaultExpandedKeysTemp = [...defaultExpandedKeysTemp]
    },
    nodeCollapse(e, node) {
      if (node.isLeaf) return
      const { defaultExpandedKeysTemp, nodeKey } = this
      const id = e[nodeKey]
      const index = defaultExpandedKeysTemp.findIndex((item) => item === id)
      if (index > -1) this.defaultExpandedKeysTemp.splice(index, 1)
    },
    // default-expand-all 时获取所有节点id
    getDefaultExpandAllValue(data = [], value, result = []) {
      value = value || 'value'
      function traverse(node) {
        const uResult = new Set(result).add(node[value])
        result = [...uResult]
        if (node.children) {
          for (let i = 0; i < node.children.length; i++) {
            traverse(node.children[i])
          }
        }
      }
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        traverse(item)
      }
      return [...result]
    },
    /**
     * 更换node.data 中指定的值
     * @param node tree node
     * @param oData 指定数据源
     * @param keys 指定对哪些值替换
     */
    updateNodeState(node, oData, keys) {
      try {
        keys = ['label', ...keys || []]
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          node.data[key] = oData[key]
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$name: '.gr-tree';

#{$name}{
  width: 100%;
  height: 100%;

  .gr-tree-main {
    width: 100%;
    height: 100%;
    overflow: auto;
    color: #fff;
    background-color: $theme-color-light;

    ::v-deep .vue-recycle-scroller {
      min-width: 100%;
    }

    ::v-deep .el-tree-node:focus > .el-tree-node__content {
      background-color: $theme-color-light !important;
    }
    ::v-deep .el-tree-node__content:hover {
      color: #1890ff;
      background-color: $theme-color-light !important;
    }
    ::v-deep .el-tree-node:focus > .el-tree-node__content {
      background-color: $theme-color-light !important;
    }
    ::v-deep .el-tree--highlight-current .el-tree-node.is-current {
      .el-tree-node__content {
        background-color: $theme-color-light;
      }
    }
    ::v-deep .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
      background-color: $theme-color-light;
    }
  }
}
</style>
