const socket = io()

fetch('/getStatisticData')
    .then(res => res.json())
    .then(res => console.log(res))
    .catch(err => console.error(err))

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded')
})