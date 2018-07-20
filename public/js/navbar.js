module.exports = class Navbar {
  constructor() {
    // Get all "navbar-burger" elements
    const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0)
    if(navbarBurgers.length > 0) {
        navbarBurgers.forEach((el) => {
            el.addEventListener('click', () => {
                const target = el.dataset.target
                const targetNode = document.getElementById(target)

                el.classList.toggle('is-active')
                targetNode.classList.toggle('is-active')
            })
        })
    }
  }
}