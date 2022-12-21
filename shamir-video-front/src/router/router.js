import { createRouter, createWebHistory } from 'vue-router'
import { processSessionFlow } from './sessionFlow'

import Playground from '../views/Playground.vue'
import HomePage from '../views/HomePage.vue'
import VideoHome from '@/views/VideoHome.vue'
import StepsView from '@/views/StepsView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import LimitsView from '@/views/LimitsView.vue'

import StepOne from '@/views/steps/StepOne.vue'
import StepTwo from '@/views/steps/StepTwo.vue'
import StepThree from '@/views/steps/StepThree.vue'
import StepReview from '@/views/steps/StepReview.vue'
import StepLoading from '@/views/steps/StepLoading.vue'
import StepDownload from '@/views/steps/StepDownload.vue'

const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage,
    },
    {
        path: '/playground',
        name: 'Playground',
        component: Playground,
    },
    {
        path: '/video/:videoId',
        name: 'VideoHome',
        component: VideoHome,
    },
    {
        path: '/video/:videoId/steps',
        component: StepsView,
        children: [
            {
                path: '1',
                meta: {
                    step: 1,
                },
                component: StepOne,
            },
            {
                path: '2',
                meta: {
                    step: 2,
                },
                component: StepTwo,
            },
            {
                path: '3',
                meta: {
                    step: 3,
                },
                component: StepThree,
            },
            {
                path: '4',
                meta: {
                    step: 4,
                },
                component: StepReview,
            },
            {
                path: '5',
                meta: {
                    step: 5,
                },
                component: StepLoading,
            },
            {
                path: 'download',
                meta: {
                    step: 5,
                },
                component: StepDownload,
            },
        ],     
    },
    {
        path: '/limits',
        component: LimitsView, 
    },
    { 
        path: '/:catchAll(.*)', 
        component: NotFoundView,
        name: 'NotFound'
      }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

console.log('import.meta.env.BASE_URL', import.meta.env.BASE_URL)

// navigation guards
router.beforeEach(async (to, from, next) => {
    // verify sessions stuff
    return processSessionFlow(to, from, next)
})

export default router
