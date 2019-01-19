import i18next                          from 'i18next'
window.i18next                          = i18next

import i18nextBrowserLanguageDetector   from'i18next-browser-languagedetector'
import enTranslation                    from '../../../locales/en/translation.json'
import deTranslation                    from '../../../locales/de/translation.json'

import debug                            from 'debug'
const logerror                          = debug(`i18n:error`)
const loginfo                           = debug(`i18n:info`)
const logdebug                          = debug(`i18n:debug`)
window.localStorage.debug               += ` i18n:* `

/*
function updateLngSelector() {
    if(i18next.language === `de-DE`) {
        $('#lngSelected').html(`Deutsch`)
    } else if(i18next.language === `en-EN`) {
        $('#lngSelected').html(`English`)
    }
}
*/

window.i18next
    .use(i18nextBrowserLanguageDetector)
    .init({
        detection: {
            order:          [`cookie`, `header`],
            lookupCookie:   `pfanf.stonith.org-i18n`,
            cookieDomain:   `panf.stonith.org`,
            caches:         [`cookie`],
        },
        fallbackLng:    `de-DE`,
        preload:        [`de-DE`, `en-EN`],
        debug:          true,
        resources:      {
                            en: { translation: enTranslation },
                            de: { translation: deTranslation }
                        }
    }, (err, t) => {
        if(err) {
            logerror(`i18next initialization failed`)
        } else {
            //updateLngSelector()
            loginfo(`Localization %s loaded`, window.i18next.language)
        }
    });

window.i18next.on(`languageChanged`, () => {
    //updateLngSelector()
    location.reload()
});

/*
$(document).ready(() => {
    $(`#lngGerman`).on(`click`, () => window.i18next.changeLanguage(`de-DE`))
    $(`#lngEnglish`).on(`click`, () => window.i18next.changeLanguage(`en-EN`))
});
*/