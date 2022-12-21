<template>
    <form @submit.prevent="onSubmit">
        <div class="text-right mb-6">
            <p
                class="font-normal text-left text-black mb-3"
                v-html="$t('FORM_REVIEW_TITLE')"
            />
            <router-link
                :to="`/video/1/steps/1?mode=update`"
                class="underline text-sm text-blue-400"
            >
                {{ $t('FORM_BUTTONS_UPDATE_FORM') }}
            </router-link>
            <div class="border border-gray-300 rounded-md text-left p-4 mt-2">
                <p class="text-black leading-normal">
                    {{
                        $t('FORM_REVIEW_STORE_TITLE', { name: form.storeName })
                    }}
                </p>
                <p class="text-gray-500 text-sm">
                    {{ $t('FORM_REVIEW_STORE_SUBTITLE') }}
                </p>
                <div class="mt-4">
                    <div class="py-2.5 border-b border-gray-300 flex">
                        <img
                            src="../../assets/svg/market.svg"
                            class="mr-2.5"
                            alt=""
                        />
                        <span>{{
                            $t('FORM_REVIEW_STORE_NAME', {
                                name: form.storeName,
                            })
                        }}</span>
                    </div>
                    <div class="py-2.5 border-b border-gray-300 flex">
                        <img
                            src="../../assets/svg/address.svg"
                            class="mr-2.5"
                            alt=""
                        />
                        <span>{{ form.storeAddress }}</span>
                    </div>
                    <div class="pt-2.5 flex">
                        <img
                            src="../../assets/svg/phone.svg"
                            class="mr-2.5"
                            alt=""
                        />
                        <span>{{ form.storePhone }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="text-right mb-6">
            <p class="font-normal text-left text-black mb-3">
                {{ $t('FORM_REVIEW_LOGO') }}
            </p>
            <router-link
                :to="`/video/1/steps/1?mode=update`"
                class="underline text-sm text-blue-400"
                >{{ $t('FORM_BUTTONS_UPDATE_FORM') }}</router-link
            >
            <img
                v-if="form.storeLogo"
                class="rounded-md border border-gray-300 mt-2"
                :src="form.storeLogo.preview"
            />
        </div>
        <div class="text-right mb-6">
            <p class="font-normal text-left text-black mb-3">
                {{ $t('FORM_REVIEW_STD_COATING') }}:
            </p>
            <router-link
                :to="`/video/1/steps/2?mode=update`"
                class="underline text-sm text-blue-400"
                >{{ $t('FORM_BUTTONS_UPDATE_FORM') }}</router-link
            >
            <img
                v-if="form.standardCoatingImage"
                class="rounded-md border border-gray-300 mt-2"
                :src="form.standardCoatingImage.preview"
            />
        </div>
        <div class="text-right mb-6">
            <p class="font-normal text-left text-black mb-3">
                {{ $t('FORM_REVIEW_EXPRESSION_COATING') }}
            </p>
            <router-link
                :to="`/video/1/steps/3?mode=update`"
                class="underline text-sm text-blue-400"
                >{{ $t('FORM_BUTTONS_UPDATE_FORM') }}</router-link
            >
            <img
                v-if="form.expressingCoatingImage"
                class="rounded-md border border-gray-300 mt-2"
                :src="form.expressingCoatingImage.preview"
            />
        </div>
        <template v-if="!isLoading">
            <Button
                :disabled="isConfirmDisabled || isLoading"
                nativeType="submit"
                class="w-full"
                >{{ $t('FORM_REVIEW_CONFIRM') }}</Button
            >
            <p class="text-red-500 text-sm text-left mt-4" v-if="isConfirmDisabled">
                {{ $t('VALIDATION_ERRORS_NOT_ALL_FIELDS_FILLED') }}
            </p>
        </template>
        <div v-else class="flex justify-center">
            <LinearProgress :progress="uploadProgress" class="w-full" />
        </div>
    </form>
</template>

<script>
import { mapState } from 'vuex'
import Button from '@/components/UI/Button.vue'
import Loading from '@/components/UI/Loading.vue'
import LinearProgress from '@/components/UI/LinearProgress.vue'
import { useRouter, useRoute } from 'vue-router'
import useStepsNavigation from '@/composables/useStepsNavigation'

export default {
    name: 'StepReview',
    setup() {
        const router = useRouter()
        const route = useRoute()
        const [nextStep, previousStep, goToStep] = useStepsNavigation(
            router,
            route
        )
        return { nextStep, previousStep, goToStep }
    },
    components: { Button, LinearProgress },
    computed: {
        ...mapState(['form', 'uploadProgress']),
        isConfirmDisabled() {
            console.log('isConfirmDisabled', Object.entries(this.form))
            return Object.entries(this.form).some(([key, value]) => !value && key !== 'storeLogo' )
        },
    },
    data() {
        return {
            isLoading: false,
        }
    },
    methods: {
        async onSubmit() {
            this.isLoading = true
            await this.$store.dispatch('createVideo', { langDirection: this.$t('LanguageDirection'), lang: this.$t('locale') })
            this.isLoading = false
            this.nextStep()
        },
    },
}
</script>
