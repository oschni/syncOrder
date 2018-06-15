import path from 'path'

let config = {
  app: {
    domain: 'panf.de'
  },
  cookie: {
    secret: 'foobar',
    resave: false,
    saveUninitialized: true
  },
  serialization: {
    tableIdFilestorepath: path.join(__dirname, 'data', 'tableId.txt'),
    ordersFilestorepath: path.join(__dirname, 'data', 'orders.json'),
    metaFilestorepath: path.join(__dirname, 'data', 'meta.json'),
    paiedFilestorepath: path.join(__dirname, 'data', 'paied.json'),
    interval: 1000 * 60 * 5
  },
  socket: {

  }
}

module.exports = config
