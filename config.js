import path from 'path'

let config = {}

config.serialization = {}
config.serialization.archivePath = path.join(__dirname, 'data', 'archive', 'archive.json')
config.serialization.tableIdFilestorepath = path.join(__dirname, 'data', 'tableId.txt')
config.serialization.ordersFilestorepath = path.join(__dirname, 'data', 'orders.json')
config.serialization.metaFilestorepath = path.join(__dirname, 'data', 'meta.json')
config.serialization.paiedFilestorepath = path.join(__dirname, 'data', 'paied.json')
config.serialization.interval = 1000  * 60 * 5

config.socket = {}

module.exports = config