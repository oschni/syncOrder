<template>
    <div class="mx-auto w-25 mt-3">
        <b-img src="imgs/pizza-slice-rounded.svg" width="128" height="128" center fluid></b-img>
        <b-form @submit="login" class="mt-2">
            <b-form-group id="inputEmail"
                    label="Email address:"
                    label-for="inputEmail">
                <b-form-input id="inputEmail"
                        type="email"
                        v-model="email"
                        required
                        placeholder="E-Mail Adresse">
                </b-form-input>
            </b-form-group>
            <b-form-group id="inputPassword"
                    label="Password:"
                    label-for="inputPassword">
                <b-form-input id="inputPassword"
                        type="password"
                        v-model="password"
                        required
                        placeholder="Password">
                </b-form-input>
            </b-form-group>
            <b-button :size="'lg'" :variant="'primary'">Login</b-button> <b-button :variant="'link'" @click.prevent="register">Register</b-button>
        </b-form>
    </div>
        <!--<form class="form-signin" method="post" action="/login">
            <h2 class="form-signin-heading">{{$t(`login.headline`)}}</h2>
            <label for="UserNameTextField" class="sr-only">{{$(`login.email`)}}</label>
            <input type="text" id="UserNameTextField" name="username" maxlength=64 class="form-control" placeholder="$t(`login.email`)}}" required="" autofocus="">
            <label for="PasswordTextField" class="sr-only">{{$t(`login.password`)}}</label>
            <input type="password" id="PasswordTextField" name="password" class="form-control" placeholder="$t(`login.password`)}}" required="">
            <button class="btn btn-lg btn-primary btn-block" type="submit" value="Login" name="login">{{$t(`defaults.login`)}}</button>

            <!-- AUTH FAILED MSG -->
            <!--    <br>
                <div class="alert alert-danger alert-dismissible" role="alert">
                <strong>Ooops!</strong> {{authfailedmsg}}
                </div>-->
            <!-- // AUTH FAILED MSG -->
        <!--</form>-->
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