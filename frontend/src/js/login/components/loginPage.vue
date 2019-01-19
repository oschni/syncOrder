<template>
    <div class="mx-auto w-25 mt-3">
        <b-img src="imgs/pizza-slice-rounded.svg" width="128" height="128" center fluid></b-img>
        <b-form @submit="login" class="mt-2">
            <b-form-group id="inputEmail"
                    :label="$t(`login.email`)"
                    label-for="inputEmail">
                <b-form-input id="inputEmail"
                        type="email"
                        v-model="email"
                        required
                        :placeholder="$t(`login.email`)">
                </b-form-input>
            </b-form-group>
            <b-form-group id="inputPassword"
                    :label="$t(`login.password`)"
                    label-for="inputPassword">
                <b-form-input id="inputPassword"
                        type="password"
                        v-model="password"
                        required
                        :placeholder="$t(`login.password`)">
                </b-form-input>
            </b-form-group>
            <b-button :size="'lg'" :variant="'primary'">{{$t(`defaults.login`)}}</b-button> <b-button :variant="'link'" @click.prevent="register">{{$t(`defaults.register`)}}</b-button>
        </b-form>
    </div>
</template>

<script>
import debug                    from 'debug'
const log                       = debug(`loginPage:info`)
const logdebug                  = debug(`loginPage:debug`)
const logerror                  = debug(`loginPage:error`)
window.localStorage.debug       += ` loginPage:* `

import { EventBus }             from '../../event-bus.js'

export default {
    name: 'loginPage',
    components: {
                },
    props: {
    },
    data: function() {
        return {
            email:      null,
            password:   null
        }
    },
    watch: {
    },
    created: function() {
    },
    mounted: function() {
    },
    methods: {
        register: function() {

        },
        login: function() {

        }
    },
    computed: {
    }
}
</script>

<style>
</style>