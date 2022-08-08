import Vue from 'vue'
import App from './App.vue'

import vuetify from './plugins/vuetify'
import VueAxios from '@/plugins/axios'
import vueCustomElement from 'vue-custom-element'

import 'document-register-element/build/document-register-element'

Vue.use(vueCustomElement);
Vue.use(VueAxios)

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
Vue.customElement('weather-widget', App)