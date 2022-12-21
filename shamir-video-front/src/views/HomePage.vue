<template>
    <div v-if="isLoading">
        <Loading class="center-page" />
    </div>
    <div v-else>
        <h1
            class="font-semibold text-lg leading-7 text-center my-7"
            v-html="$t('HOME_PAGE_TITLE')"
        />
        <vue-markdown class="mb-6 text-gray-600" :source="$t('HOME_PAGE_TEXT')" />
        <label
            for=""
            class="font-semibold text-lg leading-7"
            v-html="$t('HOME_PAGE_LANGUAGE_LABEL')"
        />
        <FlagOptionsSelect
            :value="language"
            @update:value="onLanguageChange"
            :options="languageOptions"
            class="mt-3.5 mb-6"
        />
        <label
            for=""
            class="font-semibold text-lg leading-7"
            v-html="$t('HOME_PAGE_COUNTRY_LABEL')"
        />
        <FlagOptionsSelect
            :value="country"
            @update:value="onCountryChange"
            :options="countryOptions"
            class="mt-3.5 mb-6"
        />
        <Button class="w-full" v-html="$t('HOME_PAGE_NEXT')" @click="onSubmit" />
        <!-- DO NOT DELETE -->
        <!-- <label for="" class="font-semibold text-lg leading-7"
      >Choose the video you like to personalized</label
    >
    <router-link to="/video/1">
      <div class="video-variant my-3.5">
        <img src="/static/img/videoPreviews/1.jpeg" alt="Shamir Glacier Expression" />
        <div class="video-variant--inner">Shamir Glacier Expression</div>
      </div>
    </router-link>
    <router-link to="/video/2">
      <div class="video-variant my-3.5">
        <img src="/static/img/videoPreviews/2.jpeg" alt="Shamir Glacier Expression" />
        <div class="video-variant--inner">Shamir Glacier UV IR</div>
      </div>
    </router-link>
    <router-link to="/video/3">
      <div class="video-variant my-3.5">
        <img src="/static/img/videoPreviews/3.jpeg" alt="Shamir Glacier Expression" />
        <div class="video-variant--inner">Shamir Anti-Fog</div>
      </div>
    </router-link> -->
    </div>
</template>

<script>
import FlagOptionsSelect from '@/components/forms/FlagOptionsSelect.vue'
import Button from '@/components/UI/Button.vue'
import Loading from '@/components/UI/Loading.vue'
import { sendAmplitudeData } from '@/utils/amplitude'
import { loadLocale, i18n } from '@/i18n'
import userStorage from '@/utils/storage/user'
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import VueMarkdown from 'vue-markdown-render'

export default {
    setup() {
        const store = useStore()
        const countryOptions = computed(() => store.state.countries)
        const languageOptions = computed(() => store.state.languages)
        const language = ref(languageOptions.value[0])
        const country = ref(countryOptions.value[0])
        if (userStorage.get().language)
            language.value = languageOptions.value.find(
                (el) => el.code === userStorage.get().language
            ) ?? languageOptions.value[0]
        if (userStorage.get().country)
            country.value = countryOptions.value.find(
                (el) => el.code === userStorage.get().country
            )
        return {
            sendAmplitudeData,
            country,
            language,
            countryOptions,
            languageOptions,
        }
    },
    components: { FlagOptionsSelect, Button, Loading, VueMarkdown },
    data() {
        return {
            isLoading: false
        }
    },
    methods: {
        async onLanguageChange(language) {
            this.isLoading = true
            this.language = language
            sendAmplitudeData('select-language', { language: language.code })
            await loadLocale(i18n, language.code, this.$store)
            this.$store.dispatch('updateUser', { language: language.code })
            this.isLoading = false
        },
        async onCountryChange(country) {
            this.country = country
            sendAmplitudeData('select-country', { country: country.code })
            this.$store.dispatch('updateUser', { country: country.code })
        },
        onSubmit(){
            this.onLanguageChange(this.language)
            this.onCountryChange(this.country)
            this.$router.push('/video/1')
        }
    },
}
</script>

<style lang="scss" scoped></style>
