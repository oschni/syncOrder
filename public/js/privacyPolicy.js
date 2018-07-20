
import BulmaHelper from './bulmaHelper'

class PrivacyPolicyModal {
  constructor() {
    this.bulmaHelper = new BulmaHelper()
    this.bulmaHelper.initModalDismissButtons('closePrivacyPolicy', 'privacyPolicyModal')
    document.getElementById('btnOpenPrivacyPolicy').addEventListener('click', (e) => {
      document.getElementById('privacyPolicyModal').classList.add('is-active')
    })
  }
}

export let privacyModal = new PrivacyPolicyModal()