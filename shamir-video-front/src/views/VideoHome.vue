<template>
    <div>
        <h1
            class="font-semibold text-lg leading-7 text-center my-7"
            v-html="$t('VIDEO_HOME_PAGE_TITLE')"
        />
        <vue-markdown class="mb-6 text-gray-600" :source="$t('VIDEO_HOME_PAGE_TEXT')" />
        <Button
            class="mb-4 w-full"
            @click="showModal = true"
            v-html="$t('VIDEO_HOME_PAGE_MAKE_VIDEO')"
        />
        <p class="mb-2" v-html="$t('VIDEO_HOME_PAGE_PREVIEW_LABEL')" />
        <div class="video-variant my-3.5">
            <VideoInPlace
                :sources="[{ src: videoTemplate.example, type: 'video/mp4' }]"
            >
                <img
                    :src="videoTemplate.examplePreview"
                    alt="Shamir Glacier Expression"
                />
            </VideoInPlace>
        </div>
        <Modal
            :show="showModal"
            @close="showModal = false"
            class="policyModal"
            modalContainerClass="policy-container bg-primary rounded-md py-8 px-5 text-white m-4 w-full lg:w-2/5"
        >
            <div class="policy-container">
                <vue-markdown class="text-left mb-8 font-semibold leading-5" :source="$t('VIDEO_HOME_PAGE_POPUP_TEXT')" />
                <Button
                    class="mb-4 bg-white text-primary w-full"
                    type="outlined"
                    @click="onConfirmed"
                    v-html="$t('VIDEO_HOME_PAGE_POPUP_CONFIRM')"
                />
                <Button
                    class="w-full"
                    border="white"
                    @click="showModal = false"
                    v-html="$t('VIDEO_HOME_PAGE_POPUP_CANCEL')"
                />
            </div>
        </Modal>
    </div>
</template>

<script>
import Button from '@/components/UI/Button.vue'
import Modal from '../components/UI/Modal.vue'
import VideoInPlace from '../components/app/VideoInPlace.vue'
import { mapState } from 'vuex'
import VueMarkdown from 'vue-markdown-render'

export default {
    components: { Button, Modal, VideoInPlace, VueMarkdown },
    data() {
        return {
            showModal: false,
        }
    },
    computed: {
        ...mapState(['videoTemplate'])
    },
    methods: {
        onConfirmed() {
            this.$store.dispatch('startNewSession')
            this.$router.push(`/video/${this.$route.params.videoId}/steps/1`)
        },
    },
}
</script>

<style lang="scss" scoped></style>
