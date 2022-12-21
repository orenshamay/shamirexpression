import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import { readLocale } from '@/api/admin'
import { setBadWordsLanugage } from '@/utils/badWordsFilter'

export const SUPPORT_LOCALES = ['en']

export function setupI18n(options = { locale: 'en-EN' }) {
    const i18n = createI18n(options)
    console.log('setup', i18n)
    setI18nLanguage(i18n, options.locale)
    return i18n
}

export function setI18nLanguage(i18n, locale, direction) {
    if (i18n.mode === 'legacy') {
        i18n.global.locale = locale
    } else {
        i18n.global.locale.value = locale
    }
    const htmlEl = document.querySelector('html')
    htmlEl.setAttribute('lang', locale)
    htmlEl.setAttribute('dir', direction)
}

export async function loadLocaleMessages(i18n, locale) {
    return new Promise(async (resolve, reject) => {
        // load locale messages with dynamic import
        // const messages = await import(
        //   /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
        // )
        let messages
        try {
            messages = await readLocale(locale)
        } catch (error) {
            locale = 'en-EN'
            try {
                messages = await readLocale(locale)
            } catch (error) {
                messages = await import(
                    /* webpackChunkName: "locale-[request]" */ `./locales/${locale}.json`
                )
            }
        }
        // set locale and locale message
        i18n.global.setLocaleMessage(locale, messages)
        const dir = messages?.LanguageDirection === 'right' ? 'rtl' : 'ltr'
        const badWords = messages?.ForbiddenWords?.replace(/\s/g, '')?.split(',') ?? []
        nextTick(() => {
            resolve({ messages, dir, badWords })
        })
    })
}

export const i18n = setupI18n({
    locale: 'en-EN',
    warnHtmlInMessage: 'off',
    // availableLocales: ['en-EN', 'ru-RU']
})

export async function loadLocale(i18n, locale, store) {
    const { dir, badWords } = await loadLocaleMessages(i18n, locale)
    await store.dispatch('loadVideoTemplateForLocale', locale)
    console.log('bad words', badWords)
    setBadWordsLanugage(locale, badWords)
    setI18nLanguage(i18n, locale, dir)
    return
}

export function getBrowserLanguage() {
    const browserLanguage = navigator.language || navigator.userLanguage
    if (!browserLanguage) return
    const lower = browserLanguage.slice(0, 3).toLowerCase() // 'en-en' -> 'en-EN'
    const upper = browserLanguage.slice(3, 5).toUpperCase()
    return lower + upper
}
