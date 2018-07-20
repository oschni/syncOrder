module.exports = class ClearList {
  constructor(syncClearList) {
    document.getElementById('btnVerifyClearList').addEventListener('click', (e) => {
      e.preventDefault()
      syncClearList()
      document.getElementById('verifyClearListModal').style.display = 'none'
  })
  }
}