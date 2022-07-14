import vueRouter from 'vue-router'
import Vue from 'vue'
import tree from '@/views/tree'
import timeLine from '@/views/timeLine'
import timeLineNew from '@/views/timeLineNew'
Vue.use(vueRouter)

const routes = [
  {
    name: 'tree',
    path: '/tree',
    component: tree
  },
  {
    name: 'timeLine',
    path: '/timeLine',
    component: timeLine
  },
  {
    name: 'timeLineNew',
    path: '/timeLineNew',
    component: timeLineNew
  },
  {
    name: 'pickerPoint',
    path: '/pickerPoint',
    component: () => import('@/views/pickerPoint')
  },
  {
    name: 'lushu',
    path: '/lushu',
    component: () => import('@/views/lushu')
  },
  {
    name: 'videojs',
    path: '/videojs',
    component: () => import('@/views/videojs')
  },
  {
    name: 'xgVideo',
    path: '/xgVideo',
    component: () => import('@/views/xgVideo')
  }
]

function createRoutes() {
  return new vueRouter({
    // mode: 'history',
    routes
  })
}
const router = createRoutes()
export default router
export {
  routes
}

