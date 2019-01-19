import config       from '../../config'

import express      from 'express'
const router        = express.Router()

import debug	    from 'debug'
const log           = debug('auth:info')
const logerror      = debug('auth:error')
const logdebug      = debug('auth:debug')
log.log             = console.log.bind(console)
logdebug.log        = console.log.bind(console)

const i18next       = require('i18next');

router.get('/login', (req, res) => {
    log("Login called")
    let classString = ''
    if(req.session.AuthFailed === 1) {
        classString = 'animated shake'
    } else {
        classString = ''
    }

    const renderOpts = {
        layout:         false,
        layout:         'default',
        pagetitle:      i18next.t('login.pagetitle'),
        authfailed:     classString,
        authfailedmsg:  req.session.AuthFailedMsg
    }

    res.render('login', renderOpts)
})

router.post('/login', (req, res, next) => {
    
    // lowercase username so no mixed upper and lowercase are possible
    req.body.username = req.body.username.toLowerCase()
})

router.get('/logout', (req, res) => {
    log('User logs out')
    req.logout()
    req.session.AuthFailed = 0
    req.session.destroy((err) => {
        if(err) {
            logerror('/logout: %O', err)
        }

        res.clearCookie(config.cookie.name)
        res.redirect('/login')
    })
})

export default router;