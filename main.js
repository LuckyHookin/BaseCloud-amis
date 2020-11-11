import Vue from 'vue'
import App from './App'
import bcc from "./common/js/base-cloud-client.js" 

Vue.config.productionTip = false

Vue.prototype.bcc = bcc ;

App.mpType = 'app'
 
const app = new Vue({
    ...App
})
app.$mount()
