import debug from 'debug'
const loginfo = debug('app:info')
const logerror = debug('app:error')
const logdebug = debug('app:debug')

import fs from 'fs'
import path from 'path'

import config from './config'
import hobbitMenu from './lib/hobbitMenu'
import davinciMenu from './lib/davinciMenu'

import express from 'express'
import session from 'express-session'
const i18next = require('i18next')
const i18nextExpressMiddleware = require('i18next-express-middleware')
const Backend = require('i18next-node-fs-backend')
const exphbs = require('express-handlebars')

i18next
  .use(Backend)
  .use(i18nextExpressMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: __dirname + '/src/locales/{{lng}}/translation.json',
      addPath: __dirname + '/src/locales/{{lng}}/translation.missing.json'
    },
    fallbackLng: 'de',
    preload: ['en', 'de'],
    saveMissing: true,
    detection: {
      order: ['session', 'cookie', 'querystring'],
    }
  }, function(err, t) {
    if(err) {
      logerror('i18next init failed: %O', err)
    } else {
      logdebug('i18next language loaded... translated... %s', i18next.t('language'))
    }
  })

const port = process.env.PORT || 9000
const app = express()
app.use(session({
  secret: config.cookie.secret,
  resave: config.cookie.resave,
  saveUninitialized: config.cookie.saveUninitialized
}))
app.use(i18nextExpressMiddleware.handle(i18next))

global.tableId = fs.readFileSync(config.serialization.tableIdFilestorepath, 'utf-8') || 1
global.orders = JSON.parse(fs.readFileSync(config.serialization.ordersFilestorepath, 'utf-8')) || []
global.meta = JSON.parse(fs.readFileSync(config.serialization.metaFilestorepath, 'utf-8')) || []
global.paied = JSON.parse(fs.readFileSync(config.serialization.paiedFilestorepath, 'utf-8')) || []

const http = require('http').Server(app)
const socket = require('./lib/socketConnection')
socket.hobbitIO(http)
socket.setConfig(config)

const serializeJson = require('./lib/serializeJson')
serializeJson.setConfig(config)

setInterval(function() {
  serializeJson.sync(global.tableId, global.orders, global.meta, global.paied)
}, config.serialization.interval)

const hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: [
    'views/partials/'
  ],
  extname: '.hbs',
  helpers: {
    t: (key, options) => getLangT(key, options)
  }
})

function getLangT(key, options) {
  return renderT(key, options)
}

let renderT = i18next.t

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('*', (req, res, next) => {
  renderT = req.t
  next()
})
/**
 * Path-Routes
 */
app.get('/', (req, res) => res.render('home'))
app.get('/hobbit', (req, res) => res.render('hobbit'))
app.get('/davinci', (req, res) => res.render('davinci'))

/**
 * XHR-Routes
 */
app.get('/getHobbitMenu', hobbitMenu.getMenu)
app.get('/getDaVinciMenu', davinciMenu.getMenu)

http.listen(port, () => {
  loginfo('Listening on port %d', port)
})

