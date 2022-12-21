<template>
    <div class="steps-view py-8">
        <Steps :steps="5" :active="currentStep" class="w-full mb-6"></Steps>
        <router-view/>
    </div>
</template>

<script>
import Steps from '@/components/UI/Steps.vue'

export default {
    components: { Steps },
    computed: {
        currentStep(){
            return this.$route.meta.step
        }
    }
}
</script>