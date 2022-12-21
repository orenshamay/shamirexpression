<template>
    <div class="step-page">
        <form @submit.prevent="onSubmit">
            <TextInput
                v-model:value="v$.form.storeName.$model"
                :errors="v$.form.storeName.$errors"
                :placeholder="$t('FORM_INPUTS_STORE_NAME_PLACEHOLDER')"
            >
                <template v-slot:label> <div v-html="$t('FORM_INPUTS_STORE_NAME_LABEL')" /> </template>
                <template v-slot:description>
                    <div v-html="$t('FORM_INPUTS_STORE_NAME_DESCRIPTION')" />
                </template>
            </TextInput>
            <TextInput
                v-model:value="v$.form.storeAddress.$model"
                :errors="v$.form.storeAddress.$errors"
                :placeholder="$t('FORM_INPUTS_STORE_ADDRESS_PLACEHOLDER')"
            >
                <template v-slot:label> <div v-html="$t('FORM_INPUTS_STORE_ADDRESS_LABEL')" /> </template>
                <template v-slot:description>
                    <div v-html="$t('FORM_INPUTS_STORE_ADDRESS_DESCRIPTION')" />
                </template>
            </TextInput>
            <TextInput
                v-model:value="v$.form.storePhone.$model"
                :errors="v$.form.storePhone.$errors"
                :placeholder="$t('FORM_INPUTS_STORE_PHONE_PLACEHOLDER')"
            >
                <template v-slot:label> <div v-html="$t('FORM_INPUTS_STORE_PHONE_LABEL')" /> </template>
                <template v-slot:description>
                    <div v-html="$t('FORM_INPUTS_STORE_PHONE_DESCRIPTION')" />
                </template>
            </TextInput>
             <TextInput
                v-model:value="v$.form.storeContacts.$model"
                :errors="v$.form.storeContacts.$errors"
                :placeholder="$t('FORM_INPUTS_STORE_CONTACTS_PLACEHOLDER')"
            >
                <template v-slot:label> <div v-html="$t('FORM_INPUTS_STORE_CONTACTS_LABEL')" /> </template>
                <template v-slot:description>
                    <div v-html="$t('FORM_INPUTS_STORE_CONTACTS_DESCRIPTION')" />
                </template>
            </TextInput>
            <p class="text-black text-base mb-2.5" v-html="$t('FORM_INPUTS_STORE_LOGO_LABEL')" />
            <ImageInput
                class="w-full"
                v-model:image="v$.form.storeLogo.$model"
                :errors="v$.form.storeLogo.$errors"
                :areOnlyPNG="true"
            >
                <template v-slot:label>
                    <div v-html="$t('FORM_INPUTS_STORE_LOGO_PLACEHOLDER')" />
                </template>
            </ImageInput>

            <Button
                v-if="formMode !== 'update'"
                nativeType="submit"
                :disabled="v$.form.$anyError"
                class="w-full my-6"
            >
                {{ $t('FORM_BUTTONS_NEXT') }}
            </Button>
             <div class="my-6" v-else>
                <Button nativeType="submit" class="w-full mt-4">{{ $t('FORM_BUTTONS_UPDATE') }}</Button>
                <Button type="outlined" @click="goToStep(4)" class="w-full mt-5"
                    >{{ $t('FORM_BUTTONS_CANCEL') }}</Button
                >
            </div>
        </form>
        <img src="/static/img/steps/1.jpeg" alt="" />
    </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'

import TextInput from '@/components/UI/TextInput.vue'
import Button from '@/components/UI/Button.vue'
import ImageInput from '@/components/UI/ImageInput.vue'

import useVuelidate from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import { badWords } from '@/utils/validations'
import Form from '@/utils/models/Form'
import useStepsNavigation from '@/composables/useStepsNavigation'

export default {
    setup() {
        const router = useRouter()
        const route = useRoute()
        const [nextStep, previousStep, goToStep] = useStepsNavigation(router, route)
        return { v$: useVuelidate(), nextStep, previousStep, goToStep  }
    },
    name: 'StepOne',
    components: { TextInput, Button, ImageInput },
    data() {
        return {
            form: {
                ...(new Form())
            },
        }
    },
    validations() {
        return {
            form: {
                storeName: {
                    required: helpers.withMessage(this.$t('VALIDATION_ERRORS_REQUIRED'), required),
                    badWords: helpers.withMessage(this.$t('VALIDATION_ERRORS_BAD_WORDS'), badWords)
                },
                storeAddress: {
                    required: helpers.withMessage(this.$t('VALIDATION_ERRORS_REQUIRED'), required),
                    badWords: helpers.withMessage(this.$t('VALIDATION_ERRORS_BAD_WORDS'), badWords)
                },
                storePhone: {
                    required: helpers.withMessage(this.$t('VALIDATION_ERRORS_REQUIRED'), required),
                    min: helpers.withMessage(this.$t('VALIDATION_ERRORS_MIN_LENGETH'), minLength(6)),
                    badWords: helpers.withMessage(this.$t('VALIDATION_ERRORS_BAD_WORDS'), badWords)
                },
                storeContacts: {
                    required: helpers.withMessage(this.$t('VALIDATION_ERRORS_REQUIRED'), required),
                    badWords: helpers.withMessage(this.$t('VALIDATION_ERRORS_BAD_WORDS'), badWords)
                },
                storeLogo: {
                    // required
                },
            },
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.form = vm.$store.state.form
        })
        return
    },
    computed: {
        formMode() {
            return this.$route.query.mode
        },
    },
    methods: {
        onSubmit() {
            this.v$.$touch()
            if (this.v$.$invalid) {
                return
            }
            const payload = {
                ...this.$store.state.form,
                ...this.form,
            }
            this.$store.dispatch('setForm', payload)
            if (this.formMode === 'update') {
                this.goToStep(4)
            } else
                this.nextStep()
        },
    },
}
</script>
