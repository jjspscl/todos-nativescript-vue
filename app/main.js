import Vue from 'nativescript-vue'
import App from './components/App'
import VueDevtools from 'nativescript-vue-devtools'
import NSVueLifecycleHooks from 'nativescript-vue-lifecycle-hooks'

if(TNS_ENV !== 'production') {
  Vue.use(VueDevtools)
}
import store from './store'



// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')


new Vue({
  store,
  render: h => h('frame', [h(App)])
}).$start()

Vue.use(NSVueLifecycleHooks)
Vue.registerElement(
  'CheckBox',
  () => require('@nstudio/nativescript-checkbox').CheckBox,
  {
    model: {
      prop: 'checked',
      event: 'checkedChange',
    },
  }
);