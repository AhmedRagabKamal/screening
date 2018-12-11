/* eslint-disable */
// eslint-disable-next-line
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import jQuery from 'jquery';
import vSelect from 'vue-select';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VeeValidate from 'vee-validate';
import lodash from 'lodash';
import Toaster from 'v-toaster';
import 'v-toaster/dist/v-toaster.css';
import NProgress from 'nprogress';
import datePicker from 'vue-bootstrap-datetimepicker';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
import IdleVue from 'idle-vue'
import './registerServiceWorker';

window.$ = jQuery;

// app.js
jQuery.extend(true, jQuery.fn.datetimepicker.defaults, {
  icons: {
    time: 'fa fa-clock',
    date: 'fa fa-calendar',
    up: 'fa fa-arrow-up',
    down: 'fa fa-arrow-down',
    previous: 'fa fa-chevron-left',
    next: 'fa fa-chevron-right',
    today: 'fa fa-calendar-check',
    clear: 'fa fa-trash-alt',
    close: 'fa fa-times-circle'
  }
});

Vue.filter('underscore', function (value) {
  if (!value) return '';
  value = value.toString().replace(/_/g, ' ');
  return value.charAt(0).toUpperCase() + value.slice(1)
});

const eventsHub = new Vue();
Vue.use(lodash);
Vue.use(VeeValidate);
Vue.use(BootstrapVue);
Vue.use(Toaster, {
  timeout: 5000
});
Vue.use(NProgress);
Vue.component('v-select', vSelect);
Vue.use(datePicker);
Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 30 * 60 * 1000
});

Vue.config.productionTip = false;

VeeValidate.Validator.extend('verify_password', {
  getMessage: field =>
    `The password must contain at least: 1 uppercase letter, 1 lowercase letter, 1 number, and one special character (E.g. , . _ & ? etc)`,
  validate: value => {
    var strongRegex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return strongRegex.test(value);
  }
});

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start()
  }
  next()
});

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
});


new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
