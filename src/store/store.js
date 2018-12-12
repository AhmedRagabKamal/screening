import Vue from 'vue';
import Vuex from 'vuex';
import ScreeningStore from './screening-store/screening-store';

Vue.use(Vuex);

export default new Vuex.Store({  
  modules: {
    screening: ScreeningStore,
  },
});