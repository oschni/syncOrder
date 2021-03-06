import moment from 'moment'
import debug from 'debug'
const loginfo = debug ('socketHobbit:info')
const logerror = debug('socketHobbit:error')
const logdebug = debug('socketHobbit:debug')

const serializeJson = require('../serializeJson')

module.exports.setConfig = function(conf) {
    serializeJson.setConfig(conf)
}

module.exports.hobbitIO = function hobbitIO(http) {
    const io = require('socket.io')(http)
    io.on('connection', (socket) => {
        loginfo('a user connected')
        socket.emit('initOrders', global.orders)
        socket.emit('initMeta', global.meta)
        socket.emit('initPaied', global.paied)
        socket.on('disconnect', () => {
            loginfo('user disconnected')
        })

        socket.on('clearList', () => {
            const format = 'HH:mm'
            const before = new moment('10:00', format)
            const after = new moment('13:30', format)
            const now = new moment()
            const listClearable = !now.isBetween(before, after)
            logdebug('clearList @%s', now.format(format))
            if(listClearable) {
              logdebug('resetting state...')
              global.tableId = 1
              global.orders = []
              global.meta = []
              global.paied = []
              serializeJson.sync(global.tableId, global.orders, global.meta, global.paied)
              io.sockets.emit('reload', { receivers: 'everyone' })
            } else {
              logdebug('we are in order process...')
              socket.emit('trollProtection', {task: 'clearList', reason: 'invalid time'})
            }
        })

        socket.on('POSTpaied', (data) => {
            global.paied.push(data)
            logdebug(data)
            io.emit('GETpaied', data)
        })

        socket.on('POSTorder', (data) => {
            let abortAddOrder = false
            global.orders.forEach(order => {
                if(order.name === data.name) {
                    logdebug(data.name, ' steht schon auf der liste!')
                    abortAddOrder = true
                }
            })

            if(abortAddOrder) {
                socket.emit('FAILorder', {text: 'Dein Name wurde schon gewählt, bitte sei kreativ für deine Pizza.'})
            } else {
                data.tableId = global.tableId++
                orders.push(data)
                const mealObj = JSON.parse(data.meal)
                data.meal = mealObj.number + ' ' + mealObj.name
                io.emit('GETorder', data)
            }
        })

        socket.on('syncMeta', (data) => {
            global.meta.push(data)
            logdebug(data)
            io.emit('pushMeta', data)
        })
    })
}
