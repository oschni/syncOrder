import '../css/addOrder.css'

import BulmaHelper from './bulmaHelper'
const bulmaHelper = new BulmaHelper()

import debug from 'debug'
const logdebug = debug('addOrder:debug')
const logerror = debug('addOrder:error')
const loginfo = debug('addOrder:info')
localStorage.debug += ' addOrder:* '

module.exports = class addOrder {
  constructor(saveOrderSync) {
    logdebug(saveOrderSync)
    this.syncOrder = saveOrderSync

    this.SIZESMALL = 'Normal'
    this.DISCOUNTSMALL = 0.5
    this.SIZEBIG = 'Groß'
    this.DISCOUNTBIG = 1.0
    this.CHOSEN_EXTRAS_DEFAULT_TEXT = 'Extras, Kommentare'
    this.EXTRAS_TEXT = 'Extras'
    // set elements
    this.mealFilterInput = document.getElementById('mealFilterInput')
    this.extraFilterInput = document.getElementById('extraFilterInput')
    this.mealEntry = document.getElementsByName('mealEntry')
    this.chosenSize = document.getElementById('chosenSize')
    this.chosenMeal = document.getElementById('chosenMeal')
    this.menuListContainer = document.getElementById('menulistContainer')
    this.sizeListContainer = document.getElementById('sizelistContainer')
    this.extraListContainer = document.getElementById('extralistContainer')
    this.menuListContent = document.getElementById('menulistContent')
    this.extraListContent = document.getElementById('extralistContent')
    this.chosenExtras = document.getElementById('chosenExtras')
    this.sizeSmall = document.getElementById('sizeNormal')
    this.sizeBig = document.getElementById('sizeBig')
    this.saveOrder = document.getElementById('saveOrder')
    this.resetExtraTags()

    // add eventlisteners to elems
    this.mealFilterInput.addEventListener('keyup', (e) => {
      const searchValue = e.target.value.toLowerCase()
      Array.from(this.mealEntry).forEach(meal => {
        meal.style.display = (meal.textContent.toLowerCase().indexOf(searchValue) > -1)
          ? ''
          : 'none'
      })
    })

    this.extraFilterInput.addEventListener('keyup', (e) => {
      const searchValue = this.extraFilterInput.value.toLowerCase()
      const extras = document.getElementsByName('extraEntry')
      Array.from(extras).forEach(extra => {
        extra.style.display = (extra.textContent.toLowerCase().indexOf(searchValue) > -1)
          ? ''
          : 'none'
      })
    })
  
    // hide menulist if clicked outside menulist
    document.addEventListener('click', (e) => bulmaHelper.hideOnClickOutside(this.menuListContainer))
    // hide sizelist if clicked outside sizelist
    document.addEventListener('click', (e) => bulmaHelper.hideOnClickOutside(this.sizeListContainer))
    // hide extralist if clicked outside extralist
    document.addEventListener('click', (e) => bulmaHelper.hideOnClickOutside(this.extraListContainer))

    this.sizeSmall.addEventListener('click', (e) => this.handleSizeChange(this.SIZESMALL))
    this.sizeBig.addEventListener('click', (e) => this.handleSizeChange(this.SIZEBIG))
    this.chosenSize.addEventListener('change', (e) => {
      e.preventDefault()
      const size = e.target.textContent
      this.handleSizeChange(size)
    })

    this.extraFilterInput.addEventListener('keyup', (e) => {
      if(e.which === 13) {
        const extralist = this.extraListContent.childNodes
        const filteredList = Array.from(extralist).filter(entry => entry.style && entry.style.display !== 'none')
        if(filteredList.length === 1) {
          const lastEntry = filteredList[0]
          this.addExtraTag(lastEntry)
        } else if(filteredList.length === 0) {
          const input = this.extraFilterInput.value
          if(input.indexOf('-') !== -1 || input.indexOf('ohne') !== -1) {
            this.addExtraTag('is-danger')
          } else {
            this.addExtraTag('is-light')
          }
        }
  
        document.getElementById('extraFilterInput').value = ''
      }
    })

    this.initSaveOrder()
  }

  resetExtraTags() {
    this.extraTags = document.createElement('div')
    this.extraTags.setAttribute('class', 'tags')
    this.extraTags.setAttribute('id', 'extraTags')
  }

  addExtraTag(tagColor, lastEntry) {
    if(this.chosenExtras.textContent === this.CHOSEN_EXTRAS_DEFAULT_TEXT) {
      this.resetExtraTags()
      this.chosenExtras.innerHTML = ''
      this.chosenExtras.appendChild(this.extraTags)
    }

    const tag = document.createElement('span')
    const input = this.extraFilterInput.value
    tag.textContent = input
    tag.setAttribute('class', 'tag '+tagColor)
    if(lastEntry) {
      Object.keys(lastEntry.dataset).forEach(attr => {
        tag.dataset[attr] = lastEntry.dataset[attr]
      })
    }
    tag.dataset.name = input
    tag.dataset.price = '0'
    const deleteMe = document.createElement('button')
    deleteMe.setAttribute('class', 'delete is-small')
    deleteMe.addEventListener('click', (e) => {
      const myPrice = parseFloat(e.target.parentNode.dataset.price) * -1
      this.updatePrice(myPrice)
      e.target.parentNode.parentNode.removeChild(e.target.parentNode)
      if(this.extraTags.childNodes.length === 0) {
        this.chosenExtras.textContent = this.CHOSEN_EXTRAS_DEFAULT_TEXT
      }
    })
    tag.appendChild(deleteMe)
    this.extraTags.appendChild(tag)
  }

  handleSizeChange(SIZE_TEXT_CONTENT) {
    this.chosenSize.value = SIZE_TEXT_CONTENT
    this.chosenSize.textContent = SIZE_TEXT_CONTENT
    this.sizeListContainer.classList.remove('is-active')
    const size = this.chosenSize.textContent

    this.chosenMeal.dataset.price
      ? this.setPrice(parseFloat(price)) // set normal price, meal is only available in one size
      : (size === this.SIZESMALL && this.chosenMeal.dataset.pricesmall)
        ? this.setPrice(parseFloat(this.chosenMeal.dataset.pricesmall) - this.smallLunchDiscount)
        : (size === this.SIZEBIG && this.chosenMeal.dataset.pricebig)
          ? this.setPrice(parseFloat(this.chosenMeal.dataset.pricebig) - this.normalLunchDiscount)
          : this.setPrice(0)

  }

  initSaveOrder() {
    this.saveOrder.addEventListener('click', (e) => {
        e.preventDefault()
        const name = document.getElementById('name').value
            ? document.getElementById('name').value
            : null
        const meal = document.getElementById('chosenMeal').dataset
            ? document.getElementById('chosenMeal').dataset
            : null
        const size = document.getElementById('chosenSize').value
            ? document.getElementById('chosenSize').value
            : null
        const extrasContainer = document.getElementById('extraTags')
            ? document.getElementById('extraTags')
            : null
        const price = document.getElementById('pricePreview').value
            ? document.getElementById('pricePreview').value
            : null

        let extras = null
        if(extrasContainer) {
            extras = Array.from(extrasContainer.childNodes).map((extra) => extra.dataset)
            logdebug(extras)
        }
        if (!name) {
            document.getElementById('name').classList.add('is-danger')
        } else {
            document.getElementById('name').classList.remove('is-danger')
        }

        if (!meal.name) {
            document.getElementById('menulistTrigger').classList.add('is-danger')
        } else {
            document.getElementById('menulistTrigger').classList.remove('is-danger')
        }

        if (!name || !meal.name || !price) return

        this.order = {
            name: name,
            meal: JSON.stringify(meal),
            size: size,
            extras: JSON.stringify(extras),
            price: price
        }

        logdebug('syncing...')
        this.syncOrder(this.order)
    })
  }

  resetChosenMeal() {
    return Object.keys(document.getElementById('chosenMeal').dataset).forEach(attr => delete document.getElementById('chosenMeal').dataset[attr])
  }

  formatPrice(price) {
    return price.toFixed(2).toLocaleString() + '€'
  }

  formatIngredients(meal) {
    return (meal.ingredients[0] !== '') ? ' <span>(' + meal.ingredients.join(', ') + ')</span>' : ''
  }

  isLunchTime() {
    return (new Date().getHours() < 17) ? true : false
  }

  getPriceString(mealObj) {
    let returnString = '<span hidden>'
    if(mealObj.pricesmall) returnString += '  Klein: ' + this.formatPrice(mealObj.pricesmall)
    if(mealObj.pricebig) returnString += ' Groß: ' + this.formatPrice(mealObj.pricebig)
    if(mealObj.price) returnString += ' Preis: ' + this.formatPrice(mealObj.price)

    returnString += '</span>'
    return returnString
  }

  loadHobbitMenu() {
    fetch('/getHobbitMenu')
      .then(res => res.json())
      .then(menudata => {
        this.hobbitmenu = menudata
        Object.keys(menudata).forEach(menuitem => {
          if(menuitem === this.EXTRAS_TEXT) {
              this.hobbitmenu[menuitem].forEach((extra) => {
                const extraitem = document.createElement('a')
                extraitem.setAttribute('class', 'dropdown-item')
                extraitem.setAttribute('name', 'extraEntry')
                extraitem.dataset.category = menuitem
                Object.keys(extra).forEach(attr => {
                  extraitem.dataset[attr] = extra[attr]
                })

                extraitem.innerHTML = extra.name + ' ' + this.getPriceString(extra)

                this.extraListContent.appendChild(extraitem)
              })
              return
          }
          const listheading = document.createElement('h4')
          listheading.setAttribute('class', 'dropdown-header')
          listheading.innerHTML = menuitem
          this.menuListContent.appendChild(listheading)

          this.hobbitmenu[menuitem].forEach(meal => {
            const listitem = document.createElement('a')
            listitem.setAttribute('class', 'dropdown-item tooltip')
            listitem.setAttribute('name', 'mealEntry')
            listitem.dataset.category = menuitem
            Object.keys(meal).forEach(attr => {
              listitem.dataset[attr] = meal[attr]
            })

            listitem.innerHTML += menuitem === 'Pizzen'
              ? meal.number + ' ' + meal.name
              : meal.name
            
            listitem.innerHTML += this.getPriceString(meal)

            const tooltipInfo = document.createElement('span')
            tooltipInfo.setAttribute('class', 'tooltiptext')
            tooltipInfo.innerHTML = this.formatIngredients(meal)
            listitem.appendChild(tooltipInfo)

            menulist.appendChild(listitem)
          })
        })
      })
      .then(() => {
        Array.from(this.mealEntry).forEach(meal => {
          meal.addEventListener('click', (e) => {
            e.preventDefault()
            this.chosenMeal.textContent = e.target.textContent
            this.resetChosenMeal()
            Object.keys(meal.dataset).forEach(attr => {
                this.chosenMeal.dataset[attr] = meal.dataset[attr]
              })
            document.getElementById('menulistContainer').classList.remove('is-active')
            this.smallLunchDiscount = this.isLunchTime() ? this.DISCOUNTSMALL : 0
            this.normalLunchDiscount = this.isLunchTime() ? this.DISCOUNTBIG : 0
            if(e.target.dataset.pricesmall) {
              const size = document.getElementById('chosenSize').textContent
              if(size === 'Normal') {
                this.setPrice(parseFloat(e.target.dataset.pricesmall) - this.smallLunchDiscount)
              } else { // size === 'Groß'
                this.setPrice(parseFloat(e.target.dataset.pricebig) - this.normalLunchDiscount)
              }
            } else {
              this.setPrice(parseFloat(e.target.dataset.price))
            }
          })
        })
      })
      .then(() => {
          const extras = document.getElementsByName('extraEntry')
          Array.from(extras).forEach(extra => {
            extra.addEventListener('click', (e) => {
              e.preventDefault()
              if(document.getElementById('chosenExtras').textContent === 'Extras, Kommentare') {
                document.getElementById('chosenExtras').innerHTML = '<div class="tags" id="extraTags"></div>'
                const tag = document.createElement('span')
                tag.textContent = e.target.textContent
                tag.setAttribute('class', 'tag is-success')
                Object.keys(e.target.dataset).forEach(attr => {
                  tag.dataset[attr] = e.target.dataset[attr]
                })
                const deleteMe = document.createElement('button')
                deleteMe.setAttribute('class', 'delete is-small')
                deleteMe.addEventListener('click', function(e) {
                    const myPrice = parseFloat(this.parentNode.dataset.price) * -1
                    this.updatePrice(myPrice)
                  this.parentNode.parentNode.removeChild(this.parentNode)
                  if(document.getElementById('extraTags').childNodes.length === 0) {
                    document.getElementById('chosenExtras').textContent = 'Extras, Kommentare'
                  }
                })
                tag.appendChild(deleteMe)
                document.getElementById('extraTags').appendChild(tag)
                this.updatePrice(tag.dataset.price)
              } else {
                const tag = document.createElement('span')
                tag.textContent = e.target.textContent
                tag.setAttribute('class', 'tag is-success')
                Object.keys(e.target.dataset).forEach(attr => {
                  tag.dataset[attr] = e.target.dataset[attr]
                })
                const deleteMe = document.createElement('button')
                deleteMe.setAttribute('class', 'delete is-small')
                deleteMe.addEventListener('click', function(e) {
                  const myPrice = parseFloat(this.parentNode.dataset.price) * -1
                  this.updatePrice(myPrice)
                  this.parentNode.parentNode.removeChild(this.parentNode)
                  if(document.getElementById('extraTags').childNodes.length === 0) {
                    document.getElementById('chosenExtras').textContent = 'Extras, Kommentare'
                  }
                })
                tag.appendChild(deleteMe)
                document.getElementById('extraTags').appendChild(tag)
                this.updatePrice(tag.dataset.price)
              }
              //resetChosenExtra()
              document.getElementById('extralistContainer').classList.remove('is-active')
            })
          })
      })
      .catch(reason => logerror('could not fetch hobbit menu data: %o', reason))
  }

  setPrice(price) {
    document.getElementById('pricePreview').value = price.toFixed(2) + '€'
  }

  updatePrice(toAdd) {
    const oldPrice = parseFloat(document.getElementById('pricePreview').value)
    const newPrice = parseFloat(toAdd) + oldPrice
    this.setPrice(newPrice)
  }
}