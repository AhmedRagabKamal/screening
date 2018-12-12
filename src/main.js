/* eslint-disable */
// eslint-disable-next-line
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
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
import axios from './global-axios';
import datePicker from 'vue-bootstrap-datetimepicker';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
import IdleVue from 'idle-vue'
import './registerServiceWorker';

window.$ = jQuery;

axios.defaults.headers.common.Authorization = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjdjZmQxODA3N2Q5NjJjMWZhZWVlMWJkYWU0NjVlZGFiM2EwMTg3MDY1NjY3YzBlNjI5M2EwZGZmNzI3NmE1NmU5ZmYwYjJkOWUzOWE5YzM2In0.eyJhdWQiOiIxNiIsImp0aSI6IjdjZmQxODA3N2Q5NjJjMWZhZWVlMWJkYWU0NjVlZGFiM2EwMTg3MDY1NjY3YzBlNjI5M2EwZGZmNzI3NmE1NmU5ZmYwYjJkOWUzOWE5YzM2IiwiaWF0IjoxNTQ0NTIzOTY5LCJuYmYiOjE1NDQ1MjM5NjksImV4cCI6MTU0NTgxOTk2OCwic3ViIjoiMSIsInNjb3BlcyI6W119.ZXR5lI306Iq90WM5GxulXKIttnykidosWjmkcb0Wy-annK75QD52tnJsaItWAM8z8dEmzIvT7Pr2dEL0U4K-koJ95qb-2ty0lN0FOsAnF5Z8wSmAWCxMWbQzRyoFjTCWG5iBo-xl4tlikjky947RuVtpVav_mHakIi_h_bVebVqRn3KIlrap6dQV8D0qxN0cZ8aSmzZNiDXFMKEiVP6xfccDZH01VubI61zg4qy9r2WympT-ql6-qR8FmgrQ2D40HIbsQRKFuPVQrnwelGyIFnBMIc4ozS6W4oM14xRipXeHPiZ99Y8m-jGgBMvERXQCHMIx-thH7_Fyi6rki7k4j3LpYTunelIgyJ3a9T6AG3Pd7D6etfSs_YCVWU0474PZ8HFNYBQfBWoFabFw_Ve1fmacmnXtiJE_pslhvAG1Pa6o4gAOI-4tB5-MTJY5bnyWNM7neDga1T9rEQZ4d4lYLKJMHDtACA9a-OktOO-GtQNJkfa0PU6ZrIHMR6jZD4WH8FpvMZxxKNwxdATP3piiXh4W-Yn_Nv5CtVaNv-Ntb4GWP37YnlaFvPF-H-TYHkJjj3cEdLCDcU2n8_CKtziyMujsRkqN-7rYfg21Xy7d4xEtE-fK9mpChFRciqzK1AkqYMGDmapQwUf0a9vt90fZUy2WUdImWN19s7ckot_BhII';

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
  store,
  render: h => h(App),
}).$mount('#app');
