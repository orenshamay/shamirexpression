import { createStore } from 'vuex'
import { createVideoJob, getVideoJob, getVideoJobFiles } from '@/api/video'
import { getCountries, getLocales, getVideoTemplate } from '@/api/admin'
import CustomImage from '../utils/models/CustomImage'
import Form from '../utils/models/Form'
import Task from '../utils/models/Task'
import sessionStorage from '@/utils/storage/session'
import userStorage from '@/utils/storage/user'
import User from '@/utils/models/User'
import { filter } from '@/utils/badWordsFilter'

const store = createStore({
    state: {
        user: new User(),
        form: new Form(),
        taskId: undefined,
        taskInfo: new Task(),
        languages: [],
        countries: [],
        videoTemplate: {},
        uploadProgress: 0
    },
    mutations: {
        MODIFY_FORM_FIELD(state, field, value) {
            state.form[field] = value
        },
        SET_FORM(state, value) {
            state.form = value
        },
        SET_TASK_ID(state, value) {
            state.taskId = value
        },
        SET_TASK_INFO(state, value) {
            state.taskInfo = value
        },
        SET_USER(state, payload) {
            state.user = payload
        },
        SET_LANGUAGES(state, payload){
            state.languages= payload
        },
        SET_COUNTRIES(state, payload){
            state.countries = payload
        },
        SET_VIDEO_TEMPLATE(state, payload) {
            state.videoTemplate = payload
        },
        SET_UPLOAD_PROGRESS(state, payload){
            state.uploadProgress = payload
        }
    },
    actions: {
        async initApp({ commit }){
            const [languages, countries] = await Promise.all([getLocales(), getCountries()])
            console.log(languages, countries)
            commit('SET_LANGUAGES', languages)
            commit('SET_COUNTRIES', countries)
            return { languages, countries }
        },
        setForm({ commit }, payload) {
            const form = {...(new Form()), ...payload}
            // Clean bad words
            for (const [key, value] of Object.entries(form)) {
                if (!value || value.source) continue 
                else {
                    form[key] = filter.clean(value)
                }
            }
            commit('SET_FORM', form)
            const withoutImages = {...form}
            for (const [key, value] of Object.entries(form)) {
                if (value?.source) {
                    withoutImages[key] = undefined
                }
            }
            sessionStorage.updateField('form', withoutImages)
        },
        async createVideo({ state, commit }, payload) {
            const { langDirection, lang } = payload
            const formData = new FormData()
            for (const [key, value] of Object.entries(state.form)) {
                if (value instanceof CustomImage) {
                    const file = new File(
                        [value.source],
                        `${key}.${value.source.type.split('/')[1]}`
                    )
                    formData.append(
                        key,
                        file,
                        `${key}.${value.source.type.split('/')[1]}`
                    )
                } else formData.append(key, value)
            }
            formData.append('url', state.videoTemplate.template)
            if ( ['rtl', 'right'].includes(langDirection) )
                formData.append('rtl', true)
            if (lang === 'el-GR')
                formData.append('isGreek', true)
            const { data } = await createVideoJob(formData, (ProgressEvent) => {
                const progress = Math.round(
                    (ProgressEvent.loaded / ProgressEvent.total) * 100
                  )
                commit('SET_UPLOAD_PROGRESS', progress)
            })
            const task = Object.assign(new Task(), { id: data.taskId })
            commit('SET_TASK_ID', data.taskId)
            commit('SET_TASK_INFO', task)
            sessionStorage.updateField('task', task)
            return data.taskId
        },
        async getVideo({ state, commit, dispatch }) {
            try {
                if(!state.taskId) {
                    sessionStorage.delete()
                    return null
                }
                const { data } = await getVideoJob(state.taskId)
                const task = Object.assign(state.taskInfo, { id: state.taskId, ...data})
                console.log('getVideo', task, data)
                commit('SET_TASK_INFO', task)
                sessionStorage.updateField('task', task)
                if (data.status !== 'SUCCESS') {
                    setTimeout(() => dispatch('getVideo'), 1000)
                } else {
                    // const files = await getVideoJobFiles(state.taskId)
                    // console.log('files', files)
                    commit('SET_TASK_INFO', task)
                }
                return task
            } catch (error) {
                console.log('[Get Job Info]', error)
                return error
            }
        },
        startNewSession({commit}) {
            const previousSession = sessionStorage.get()
            console.log('previousSession', previousSession)
            if (previousSession?.task?.status === 'SUCCESS') {
                userStorage.updateField('videos', userStorage.get().videos + 1)
                sessionStorage.delete()
                console.log('delete session', sessionStorage.get())
            }
            sessionStorage.init()
            commit('SET_FORM', new Form())
            commit('SET_TASK_ID', undefined)
            commit('SET_TASK_INFO', new Task())
        },
        updateUser({commit}, payload){
            const user = userStorage.get()
            console.log('updateUser', user)
            const updUser = Object.assign(user, payload)
            commit('SET_USER', updUser)
            userStorage.update(updUser)
        },
        async loadVideoTemplateForLocale({commit}, locale) {
            const data = await getVideoTemplate(locale)
            commit('SET_VIDEO_TEMPLATE', data)
            return data
        }
    },
    getters: {
        videoExtention(state){
            return state.videoTemplate.template.split('.').pop()
        }
    }
})

export default store
