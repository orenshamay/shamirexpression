import sessionStorage from '@/utils/storage/session'
import userStorage from '@/utils/storage/user'
import { TASK_FINISHED, TASK_PENDING } from '@/consts/task'

export const processSessionFlow = (to, from, next) => {
    if(to.fullPath.includes('steps')) {
        // 1
        if (!sessionStorage.get()) {
            return next('/')
        }

        // 2
        if (userStorage.get().videos >= 3  && !to.fullPath.includes('limits')) {
            return next('/limits')
        }

        // 3
        if (sessionStorage.get().task.status === TASK_PENDING && !to.fullPath.includes('steps/5')) {
            return next('/video/1/steps/5')
        }

        // 4
        if (sessionStorage.get().task.status === TASK_FINISHED && !to.fullPath.includes('steps/download')) {
            return next('/video/1/steps/download')
        }
    }
    return next()
}

export const processSessionForm = (store) =>  {
    const session = sessionStorage.get()
    if (!session) return
    const sessionFrom = session.form
    store.dispatch('setForm', sessionFrom)
    store.commit('SET_TASK_ID', session.task.id)
    store.commit('SET_TASK_INFO', session.task)
}
