import '../globals'

import { library, dom}      from '@fortawesome/fontawesome-svg-core'
import { faFrownOpen }      from '@fortawesome/free-solid-svg-icons/faFrownOpen'
library.add(faFrownOpen)
dom.watch()

import debug                from 'debug';
const log                   = debug(`login:info`)
const logdebug              = debug(`login:debug`)
const logerror              = debug(`login:error`)
window.localStorage.debug   += ` login:* `

socket.on(`connect`, () => log(`Server connects`))
socket.on(`helo`, (data) => log(`Server greets client with data: %o`, data))

import loginPage                from './components/loginPage.vue'
import { EventBus }             from '../event-bus.js'

const app_login = new Vue({
    el:         `#app-login-page`,
    i18n:       i18n,
    components: {
                    loginPage
                },
    data: {
    },
    watch: {
    },
    created: function() {
    },
    mounted: function() {
        this.$el.removeAttribute("hidden")
    },
    methods: {
    },
    computed: {
    }
});
/*
socket.on('clientlist', (data) => {
    EventBus.$emit('clientlist', data);
});*/