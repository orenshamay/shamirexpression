import axios from 'axios'

const adminApi = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_URL + '/api',
    timeout: 600000,
})

export async function readLocale(locale = 'en-EN') {
    if (locale === 'en-EN' || locale === 'en') locale = 'en'
    const { data } = await adminApi.get(
        `/content?locale=${locale}`
    )
    const messages = data.data.attributes
    return messages
}

export async function getLocales() {
    const { data } = await adminApi.get('/content?populate[0]=localizations.LanguageFlag&populate[1]=LanguageFlag')
    const { localizations, ...english } = data.data.attributes
    const langsRaw = [...localizations.data, { attributes: english}]
    const locales = langsRaw.map(el => {
            return {
            label: el.attributes.LanguageLabel,
            code: el.attributes.locale,
            flag: import.meta.env.VITE_ADMIN_URL + el.attributes.LanguageFlag?.data?.attributes?.url
        }
    }).sort((a, b) => a.code.localeCompare(b.code))
    return locales
}

export async function getCountries() {
    const { data } = await adminApi.get('/countries?populate=%2A&sort=Label&pagination[page]=1&pagination[pageSize]=100')
    const countries = data.data.map(el => ({
        id: el.id,
        label: el.attributes.Label,
        code: el.attributes.Code,
        flag: import.meta.env.VITE_ADMIN_URL + el.attributes.FlagImage?.data?.attributes?.url
    }))
    return countries
}

export async function getVideoTemplate(locale){
    if (locale === 'en-EN' || locale === 'en') locale = 'en'
    const { data } = await adminApi.get(`/video-template?populate=%2A&locale=${locale}`)
    const template = import.meta.env.VITE_ADMIN_INTERNAL_URL + data.data.attributes.TemplateVideo.data.attributes.url
    const example = import.meta.env.VITE_ADMIN_URL + data.data.attributes.CustomerVideo.data.attributes.url
    const examplePreview = import.meta.env.VITE_ADMIN_URL + data.data.attributes.Preview.data.attributes.url
    return { template, example, examplePreview }
}