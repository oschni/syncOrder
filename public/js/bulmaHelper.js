module.exports = class bulmaHelper {
  initModalDismissButtons(elemName, modalId) {
    const closeModalButtons = document.getElementsByName(elemName)
    Array.from(closeModalButtons).forEach(elem => {
      elem.addEventListener('click', (e) => {
        document.getElementById(modalId).classList.remove('is-active')
      })
    })
  }

  isVisible(elem) {
    return !!elem && !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length )
  }
  
  hideOnClickOutside(element) {
    const outsideClickListener = event => {
      if(!element.contains(event.target)) { // or use: event.target.closest(selector) === null
        if(this.isVisible(element)) {
          element.classList.remove('is-active')
          removeClickListener()
        }
      }
    }

    const removeClickListener = () => document.removeEventListener('click', outsideClickListener)
    document.addEventListener('click', outsideClickListener)
  }
}