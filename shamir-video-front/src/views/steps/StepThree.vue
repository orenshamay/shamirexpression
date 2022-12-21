<template>
    <div class="step-page relative">
        <form @submit.prevent="onSubmit">
            <h1 class="font-semibold text-lg leading-7 text-center my-7" v-html="$t('FORM_INPUTS_EXPRESSING_COATING_LABEL')" />
            <ImageInput
                class="w-full mb-3.5"
                v-model:image="v$.form.expressingCoatingImage.$model"
                :errors="v$.form.expressingCoatingImage.$errors"
                :aspectRatio="3/4"
            >
                <template v-slot:label>
                     <div v-html="$t('FORM_INPUTS_EXPRESSING_COATING_PLACEHOLDER')" />
                </template>
            </ImageInput>
            <img src="/static/img/steps/3.jpeg" alt="" />
            <img src="/static/img/stubs/EX_COATING.jpg" id="expressing-img-stub" style="display: none;" alt="">
             <div class="navigation-buttons bottom-0 left-0 p-2" v-if="formMode !== 'update'">
                <Button nativeType="submit" class="w-full mt-4"> {{ $t('FORM_BUTTONS_NEXT') }}</Button>
                <Button type="outlined" @click="previousStep" class="w-full mt-5"
                    >{{ $t('FORM_BUTTONS_PREVIOUS') }}</Button
                >
            </div>
            <div class="navigation-buttons bottom-0 left-0 p-2" v-else>
                <Button nativeType="submit" class="w-full mt-4">{{ $t('FORM_BUTTONS_UPDATE') }}</Button>
                <Button type="outlined" @click="goToStep(4)" class="w-full mt-5"
                    >{{ $t('FORM_BUTTONS_CANCEL') }}</Button
                >
            </div>
        </form>
    </div>
</template>

<script>
import Button from '@/components/UI/Button.vue'
import ImageInput from '@/components/UI/ImageInput.vue'

import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

import { useRouter, useRoute } from 'vue-router'
import useStepsNavigation from '@/composables/useStepsNavigation'

import { getBase64AndBlobImage } from '@/utils/imageUtils'
import CustomImage from '@/utils/models/CustomImage'

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
    name: 'StepThree',
    components: { Button, ImageInput },
    data() {
        return {
            form: {
                expressingCoatingImage: undefined,
            },
        }
    },
    validations() {
        return {
            form: {
                expressingCoatingImage: {
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
    beforeRouteEnter (to, from, next) {
        next(vm => {
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
            if (!this.form.expressingCoatingImage) {
                const { blob, base64}  = await getBase64AndBlobImage('expressing-img-stub')
                this.form.expressingCoatingImage = new CustomImage(blob, base64)
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
