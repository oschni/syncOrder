import debug from 'debug'
const loginfo = debug('app:info')
const logerror = debug('app:error')
const logdebug = debug('app:debug')

import fs from 'fs'
import path from 'path'

import config from './config'

import express from 'express'
import exphbs from 'express-handlebars'
import handlebars from 'handlebars'
const port = process.env.PORT || 9000
const app = express()

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
  extname: '.hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

handlebars.registerHelper('ifCond', (v1, operator, v2, options) => {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this)
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this)
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this)
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this)
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this)
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this)
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this)
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this)
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this)
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this)
        default:
            return options.inverse(this)
    }
})

app.get('/', (req, res) => {
  res.render('home', {site: 'home'})
})

app.get('/hobbit', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'imgs', 'hobbit.pdf'))
})

app.get('/statistic', (req, res) => {
  res.render('statistic')
})

http.listen(port, () => {
  loginfo('Listening on port %d', port)
})