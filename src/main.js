import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'video.js/dist/video-js.css';
import App from './App.vue';
import router from './router';
import GrSlider from '@/components/slider';
Vue.component('gr-slider', GrSlider);
Vue.use(ElementUI);
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: process.env.NODE_ENV === 'development' ? 'fOT3G6uPsE5acPKkiG9zWiOmPpHl8w5L' : 'Cz9TO9tbRtzTCpmrLx1xNOjQQCXRsbzM'
})
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
