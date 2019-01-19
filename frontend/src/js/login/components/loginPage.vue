<template>
    <div>
        foobar baz
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
        }
    },
    watch: {
    },
    created: function() {
    },
    mounted: function() {
    },
    methods: {
    },
    computed: {
    }
}
</script>

<style>
</style>