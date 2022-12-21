import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store'
import { i18n, loadLocale, getBrowserLanguage } from './i18n'
import './assets/styles/index.css'
import './assets/styles/public.scss'

import { initAmplitude } from './utils/amplitude'
import { initSentry } from './utils/sentry'
import userStorage from './utils/storage/user'
import { processSessionForm } from './router/sessionFlow'
import vClickOutside from "click-outside-vue3"


const app = createApp(App)

if (import.meta.env.MODE === 'production') {
    initAmplitude()
    initSentry(app, router)
}

app.use(router)
app.use(store)
app.use(i18n)
app.use(vClickOutside)

async function initApp() {
    try {
        userStorage.init({ language: getBrowserLanguage() ?? 'en-EN' })
        processSessionForm(store)
        const locale =
            userStorage.get().language ?? getBrowserLanguage ?? 'en-EN'
        await Promise.all([
            store.dispatch('initApp'),
            loadLocale(i18n, locale, store),
        ])
    } catch (error) {
        console.log('PIZDA_RULYU', error)
    }
    app.mount('#app')
}

initApp()

console.log('ENV', import.meta.env)
