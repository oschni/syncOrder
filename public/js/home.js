import 'bulma/css/bulma.min.css'
import fontawesome from '@fortawesome/fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import brands from '@fortawesome/fontawesome-free-brands'

import debug from 'debug'
const logdebug = debug('home:debug')
const logerror = debug('home:error')
const loginfo = debug('home:info')
localStorage.debug += ' home:* '

import io from 'socket.io-client'
const socket = io()

import BulmaHelper from './bulmaHelper'
const bulmaHelper = new BulmaHelper()

import Navbar from './navbar'
import ClearList from './clearList'
import AddOrder from './addOrder'

loginfo('home, sweet home 👀🙀👻')

const syncOrder = (data) => socket.emit('POSTorder', data)
const syncPaied = (data) => socket.emit('POSTpaied', data)
const syncClearList = () => socket.emit('clearList', {})
const addOrder = new AddOrder(syncOrder)

socket.on('reload', () => location.reload())
socket.on('trollProtection', (statusObj) => document.getElementById('trollModal').style.display = '')
socket.on('FAILorder', (data) => alert(data.text))
socket.on('initMeta', (metadata) => metadata.forEach(data => updateMetaField(data)))
socket.on('initPaied', (paied) => paied.forEach(pay => document.getElementById(pay.htmlid).value = pay.paied))
socket.on('pushMeta', (data) => updateMetaField(data))
socket.on('GETpaied', (data) => {
    const x = document.getElementById(data.htmlid)
    x.value = data.paied
})

socket.on('GETorder', (data) => {
    document.getElementById('addOrderModal').classList.remove('is-active')
    document.getElementById('name').classList.remove('is-valid')
    document.getElementById('name').value = ''
    addOrder.resetChosenMeal()
    document.getElementById('chosenMeal').textContent = 'Mahlzeiten'
    document.getElementById('chosenSize').value = 'Normal'
    document.getElementById('chosenSize').textContent = 'Normal'
    addRow(data)
})

socket.on('initOrders', (orders) => {
    logdebug('orders: %O', orders)
    const table = document.getElementById('orderTableBody')
    Array.from(table.rows).forEach((row, idx) => table.deleteRow(idx))
    orders.forEach(order => addRow(order))
})

function updateMetaField(data) {
    const id = data.id
    const text = data.text
    document.getElementById(id).value = text
}

function setSizeLabel(id, text) {
    document.getElementById(id).addEventListener('click', (e) => {
        e.preventDefault()
        document.getElementById('dropdownMenuButton').innerHTML = text
    })
}

function _bindUpdateMetaInfo(e) {
    const id = e.target.id
    e.preventDefault()
    const text = document.getElementById(id).value
    socket.emit('syncMeta', { id: id, text: text })
}

function updateMetaInfo(id) {
    document.getElementById(id).addEventListener('keyup', _bindUpdateMetaInfo, false)
    document.getElementById(id).addEventListener('change', _bindUpdateMetaInfo, false)
}

function addRow(order) {
    const extraTagList = document.createElement('div')
    extraTagList.setAttribute('class', 'tags')
    try {
        const extras = JSON.parse(order.extras)
        extras.forEach((extra) => {
            const tag = document.createElement('span')
            parseFloat(extra.price) > 0
                ? tag.setAttribute('class', 'tag is-success')
                : tag.setAttribute('class', 'tag is-danger')
            tag.textContent = parseFloat(extra.price) > 0
                ? '+' + extra.name
                : '-' + extra.name
            extraTagList.appendChild(tag)
        })
    } catch (error) {
        //no extra specified for this order
        //logerror('could not parse extras: %O', error)
    }
    logdebug(extraTagList)
    const table = document.getElementById('orderTableBody')

    const row = table.insertRow(-1)
    row.setAttribute('scope', 'row')

    const id = row.insertCell(-1)
    const name = row.insertCell(-1)
    const meal = row.insertCell(-1)
    const size = row.insertCell(-1)
    const comment = row.insertCell(-1)
    const paied = row.insertCell(-1)

    logdebug(order)
    // Add some text to the new cells:
    id.textContent = order.tableId
    name.textContent = order.name
    meal.textContent = order.meal
    size.textContent = order.size
    comment.appendChild(extraTagList)
    const htmlid = order.name + order.meal + order.size
    const maxVal = 100
    
    const x = document.createElement('input')
    x.setAttribute('data-name', order.name)
    x.setAttribute('id', htmlid)
    x.setAttribute('class', 'input')
    x.setAttribute('type', 'number')
    x.setAttribute('step', '0.10')
    x.setAttribute('value', '0')
    x.setAttribute('min', '0')
    x.setAttribute('max', maxVal)
    paied.appendChild(x)

    document.getElementById(htmlid).addEventListener('keyup', (e) => {
        e.preventDefault()
        const inputField = document.getElementById(htmlid)
        const paied = inputField.value
        const syncObj = { id: id, htmlid: htmlid, paied: paied }
        syncPaied(syncObj)
    })

    document.getElementById(htmlid).addEventListener('change', (e) => {
        e.preventDefault()
        const inputField = document.getElementById(htmlid)
        const paied = inputField.value

        syncPaied({ id: id, htmlid: htmlid, paied: paied })
    })
}

function initDateValue() {
    const dateControl = document.querySelector('input[type="date"]')
    dateControl.value = new Date().toISOString().substr(0, 10)
}

function initClearListButton() {
    document.getElementById('clearList').addEventListener('click', (e) => {
      e.preventDefault()
      document.getElementById('verifyClearListModal').classList.add('is-active')
    })
}

document.addEventListener('DOMContentLoaded', () => {
  //new PrivacyPolicy()
  new Navbar()
  new ClearList(syncClearList)
  bulmaHelper.initModalDismissButtons('closeOrder', 'addOrderModal')
  bulmaHelper.initModalDismissButtons('closeClearList', 'verifyClearListModal')
  initDateValue()
  initClearListButton()
  addOrder.loadHobbitMenu()

  document.getElementById('btnOpenAddOrder').addEventListener('click', (e) => {
    addOrder.setPrice(0)
    addOrder.resetChosenMeal()
    document.getElementById('chosenMeal').textContent = 'Mahlzeiten'
    document.getElementById('addOrderModal').classList.add('is-active')
  })

  document.getElementById('menulistTrigger').addEventListener('click', (e) => {
    document.getElementById('menulistContainer').classList.toggle('is-active')
  })

  document.getElementById('sizelistTrigger').addEventListener('click', (e) => {
    document.getElementById('sizelistContainer').classList.toggle('is-active')
  })

  document.getElementById('extralistTrigger').addEventListener('click', (e) => {
    document.getElementById('extralistContainer').classList.toggle('is-active')
  })

  updateMetaInfo('inputDate')
  updateMetaInfo('inputName')
  updateMetaInfo('inputCollector')
  updateMetaInfo('inputCollectTime')

})
