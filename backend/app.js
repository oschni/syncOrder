'use strict';

const config                            = require('./config')

import debug                            from 'debug'
const log                               = debug('app:info')
const logerror                          = debug('app:error')
const logdebug                          = debug('app:debug')
log.log                                 = console.log.bind(console)
logdebug.log                            = console.log.bind(console)

import helmet                           from 'helmet'

import express                          from 'express'
import http                             from 'http'
import SocketIO                         from 'socket.io'
import routes                           from './routes'

let app                                 = express()
let server                              = http.createServer(app)
let io                                  = new SocketIO(server)

import hbs                              from 'express-hbs'
import cookieParser                     from 'cookie-parser'
import session                          from 'express-session'
import RedisStore                       from 'connect-redis'
let redis                               = RedisStore(session)

import passport                         from 'passport'

import bodyParser                       from 'body-parser'

import path                             from 'path'

import i18next                          from 'i18next'
import FileSystemBackend                from 'i18next-node-fs-backend'
import i18nextMiddleware                from 'i18next-express-middleware'

i18next
    .use(i18nextMiddleware.LanguageDetector)
    .use(FileSystemBackend)
    .init({
        detection:      {
                            order: ['session', 'cookie', 'header'],
                            lookupCookie: config.cookie.i18n,
                            //cookieDomain: config.foocore.domain,
                            caches: false //['cookie']
                        },
        backend:        {
                            loadPath: path.join(__dirname, '..', 'locales', '{{lng}}', 'translation.json')
                        },
        fallbackLng:    'de',
        preload:        ['en', 'de'],
        debug:          false,
        lng:            'de',
    }, (err, t) => {
        /* loading done */
        if (err) {
            logerror('i18next init failed: %O', err)
        } else {
            log('i18next loaded: %O', i18next.language)
        }
    })

app.use(helmet.hidePoweredBy())
app.use(helmet.noCache())

app.use(express.static(config.http.public))
app.use(i18nextMiddleware.handle(i18next))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended:   true,
    limit:      100000000
}))
app.use(cookieParser())

/* TODO */
const sessionstore = new redis()
/*{
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
    prefix: config.redis.prefix
});
*/
const redissession = session({
    name:               config.cookie.name,
    secret:             config.cookie.secret,
    saveUninitialized:  false,
    resave:             false,
    store:              sessionstore,
    logFn:              logdebug,
    reapInterval:       2000,
    reapSyncFallback :  false,
    cookie:             {
        secure:     true,
        httpOnly:   true,
        maxAge:     config.cookie.maxage
    }
})

app.use(redissession)
app.use(passport.initialize())
app.use(passport.session())

app.engine('hbs', hbs.express4({
    partialsDir:    config.http.partials,
    layoutsDir:     path.join(config.http.views, 'layouts')
}))

app.set('trust proxy', 'loopback')
app.set('view engine', 'hbs')
app.set('views', config.http.views)

// is_authed
app.use(function(req, res, next) {
    log("Route: %s", req.path)
    if(req.path === '/login' || req.path === '/logout') {
        return next()
    }

    if(req.user) {
        i18next.changeLanguage(req.language)
        return next()
    } else {
        return res.redirect('/login')
    }
})

// is_maintenanceMode
app.use(async (req, res, next) => {
    req.system = req.system || {}
    /*
    try {
        const maintenancemode = await configuration.readKeyByKeyname('maintenancemode');
        req.system.maintenancemode = parseInt(maintenancemode.value) === 1;
    } catch (error) {
        logerror('isMaintenanceMode failed: %O', error);
    }*/
    next()
});

// we have to load routes after global middlewares, so they are useable
app.use(routes)

server.listen(config.http.port, () => {
    log('Listening on %s:%d', config.http.listen, config.http.port)
});