import io               from 'socket.io-client';
const ioConnection      = io('/syncorder', { secure: true });
window.socket           = ioConnection;
window.io               = ioConnection;

// initialization of i18next
require('./i18n.js');
//require('./sessiontimeout.js');

// to reduce filesize, we only import needed icons from fontawesome
import { library, dom}      from '@fortawesome/fontawesome-svg-core';
import { faTasks }          from '@fortawesome/free-solid-svg-icons/faTasks';

import { FontAwesomeIcon }  from '@fortawesome/vue-fontawesome';

library.add(faTasks);
dom.watch();

import axios        from 'axios';
import Vue          from 'vue';
import BootstrapVue from 'bootstrap-vue';
import VueI18Next   from '@panter/vue-i18next';

Vue.use(VueI18Next);
Vue.use(BootstrapVue);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.prototype.$http         = axios;
Vue.config.productionTip    = false;

window.Vue                  = Vue;
window.axios                = axios;
window.i18n                 = new VueI18Next(i18next);

/*
$(document).ajaxStart(() => {
    NProgress.start();
    $('[data-toggle="tooltip"]').tooltip();
});

$(document).ajaxStop(() => NProgress.done());

$(document).ready(() => {
    //moment.locale(i18next.language);
});
*/
// intercept global XMLHttpRequest so we can check if session is dead
// not only for jQuery but for all XHR
/*let origOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function() {
        if(sessionTimedOut(this)) {
            showTimeout();
        }
    });
    origOpen.apply(this, arguments);
};*/