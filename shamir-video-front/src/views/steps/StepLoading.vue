<template>
    <div>
        <h1
            class="font-semibold text-lg leading-7 text-center mb-2"
            v-html="$t('FORM_PROGRESS_TITLE')"
        />
        <h3
            class="mb-6 text-gray-600 text-center"
            v-html="$t('FORM_PROGRESS_SUBTITLE')"
        />
        <div class="mt-4 relative">
            <div class="flex justify-center items-center h-full my-40">
                <RadialProgress
                    :progress="progress"
                    :infinite="isInfiniteLoading"
                    :seconds="180"
                    style="transform: scale(1.4)"
                >
                </RadialProgress>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import RadialProgress from '@/components/UI/RadialProgress.vue'

export default {
    components: { RadialProgress },
    computed: {
        ...mapState(['taskInfo']),
        taskProgress() {
            return this.$store.state.taskInfo.progress
        },
        taskStatus() {
            return this.$store.state.taskInfo.status
        },
        isInfiniteLoading() {
            return true
            if (!this.taskProgress) return false
            return !this.taskProgress.toLowerCase().includes('progress')
        },
        progress() {
            this.taskProgress //reactivity
            if (!this.taskProgress) return 0
            const pr = this.taskProgress.toLowerCase()
            // Decoding -> Rendering -> Progress: X% -> Encoding -> Adding audio -> Creating a gif -> Cleaning up -> Done
            if (pr === 'decoding') {
                return 10
            } else if (pr === 'rendering') {
                return 20
            } else if (pr.includes('progress')) {
                // 20 -> 80
                const parsed = pr.replace('progress: ', '').replace('%', '')
                const value = parseInt(parsed)
                return value < 20 ? 20 : value > 80 ? 80 : value
            } else if (pr === 'encoding') {
                return 80
            } else if (pr.includes('audio')) {
                return 85
            } else if (pr.includes('creating')) {
                return 90
            } else if (pr.includes('cleaning')) {
                return 95
            }
            return 100
            // return this.$store.
        },
    },
    async mounted() {
        const data = await this.$store.dispatch('getVideo')
        if (!data) this.$router.push('/')
    },
    watch: {
        taskStatus: {
            handler: function (value, prev) {
                if (value && value === 'SUCCESS') {
                    this.$router.push('/video/1/steps/download')
                }
            },
            deep: true,
        },
    },
}
</script>
