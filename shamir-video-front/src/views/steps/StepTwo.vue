<template>
    <div class="step-page relative">
        <form @submit.prevent="onSubmit">
            <h1 class="font-semibold text-lg leading-7 text-center my-7" v-html="$t('FORM_INPUTS_STANDART_COATING_LABEL')" />
            <ImageInput
                v-model:image="v$.form.standardCoatingImage.$model"
                :errors="v$.form.standardCoatingImage.$errors"
                class="w-full mb-3.5"
                :aspectRatio="3/4"
            >
                <template v-slot:label>
                    <div v-html="$t('FORM_INPUTS_STANDART_COATING_PLACEHOLDER')" />
                </template>
            </ImageInput>
            <img src="/static/img/steps/2.jpeg" alt="" />
            <img src="/static/img/stubs/STANDARD.jpg" id="standard-img-stub" style="display: none;" alt="">
            <div class="navigation-buttons bottom-0 left-0 p-4" v-if="formMode !== 'update'">
                <Button nativeType="submit" class="w-full mt-4"> {{ $t('FORM_BUTTONS_NEXT') }}</Button>
                <Button
                    type="outlined"
                    @click="previousStep"
                    class="w-full mt-5"
                    >{{ $t('FORM_BUTTONS_PREVIOUS') }}</Button
                >
            </div>
            <div class="navigation-buttons bottom-0 left-0 p-4" v-else>
                <Button nativeType="submit" class="w-full mt-4">{{ $t('FORM_BUTTONS_UPDATE') }}</Button>
                <Button type="outlined" @click="goToStep(4)" class="w-full mt-5"
                    > {{ $t('FORM_BUTTONS_CANCEL') }}
                    </Button
                >
            </div>
        </form>
    </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'

import Button from '@/components/UI/Button.vue'
import ImageInput from '@/components/UI/ImageInput.vue'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { getBase64AndBlobImage } from '@/utils/imageUtils'
import CustomImage from '@/utils/models/CustomImage'

import useStepsNavigation from '@/composables/useStepsNavigation'

export default {
    setup() {
        const router = useRouter()
        const route = useRoute()
        const [nextStep, previousStep, goToStep] = useStepsNavigation(
            router,
            route
        )
        return { v$: useVuelidate(), nextStep, previousStep, goToStep }
    },
    name: 'StepOne',
    components: { Button, ImageInput },
    data() {
        return {
            form: {
                t: undefined,
            },
        }
    },
    validations() {
        return {
            form: {
                standardCoatingImage: {
                    // required,
                },
            },
        }
    },
    computed: {
        formMode() {
            return this.$route.query.mode
        },
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.form = vm.$store.state.form
        })
        return
    },
    methods: {
        async onSubmit() {
            this.v$.$touch()
            if (this.v$.$invalid) {
                return
            }
            if (!this.form.standardCoatingImage) {
                const { blob, base64}  = await getBase64AndBlobImage('standard-img-stub')
                this.form.standardCoatingImage = new CustomImage(blob, base64)
            }
            const payload = {
                ...this.$store.state.form,
                ...this.form,
            }
            this.$store.commit('SET_FORM', payload)
            if (this.formMode === 'update')
                this.goToStep(4)
            else this.nextStep()
        },
    },
}
</script>
