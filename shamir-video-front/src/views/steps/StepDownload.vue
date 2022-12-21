<template>
    <div>
        <h1 class="font-semibold text-lg leading-7 text-center mb-2" v-html="$t('FORM_DOWNLOAD_TITLE')" />
        <h3 class="mb-6 text-gray-600 text-center" v-html="$t('FORM_DOWNLOAD_SUBTITLE')" />
        <!-- @click.prevent="onDownload" -->
        <a :href="videoDownloadUrl" :name="`${taskId}.mp4`" :download="downloadAttribute" class="relative max-h-60 block overflow-hidden rounded-md">
            <img src="/static/img/steps/5.jpeg" class="w-full h-full" alt="" />
            <div
                class="absolute left-0 top-0 h-full w-full flex items-center justify-center flex-col bg-black bg-opacity-40"
            >
                <img src="../../assets/svg/download.svg" alt="" />
                <p class="text-white font-semibold text-3xl mt-5" v-html="$t('FORM_DOWNLOAD_DOWNLOAD')" />
            </div>
        </a>
        <p class="my-4 text-gray-500" v-html="$t('FORM_DOWNLOAD_WARNING')" />
        <router-link to="/">
            <Button class="w-full my-2">{{ $t('FORM_DOWNLOAD_MAKE_NEW') }}</Button>
        </router-link>
        <div class="my-8 flex justify-between">
            <a class="text-center block">
                <img
                    src="/static/img/share/mail.png"
                    class="share-option__img"
                    alt=""
                />
                <p class="share-option__name">Mail</p>
            </a>
            <a class="text-center block">
                <img
                    src="/static/img/share/whatsapp.png"
                    class="share-option__img"
                    alt=""
                />
                <p class="share-option__name">WhatsApp</p>
            </a>
            <a class="text-center block">
                <img
                    src="/static/img/share/instagram.png"
                    class="share-option__img"
                    alt=""
                />
                <p class="share-option__name">Instagram</p>
            </a>
            <a class="text-center block">
                <img
                    src="/static/img/share/facebook.png"
                    class="share-option__img"
                    alt=""
                />
                <p class="share-option__name">Facebook</p>
            </a>
            <a class="text-center block">
                <img
                    src="/static/img/share/messenger.png"
                    class="share-option__img"
                    alt=""
                />
                <p class="share-option__name">Messenger</p>
            </a>
        </div>
        <div class="py-2.5 px-4 bg-primary bg-opacity-10 text-primary" v-html="$t('FORM_DOWNLOAD_WARNING2')" />
    </div>
</template>

<script>
const download = (url, taskId, ext) => {
    if (!url) {
      throw new Error("Resource URL not provided! You need to provide one");
    }

    const name = `${taskId}.${ext}`

    getVideoJobFiles(taskId, ext)
      .then(response => response.blob())
      .then(blob => {

        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobURL;
        a.style = "display: none";

        if (name && name.length) a.download = name;
        document.body.appendChild(a);
        a.click();
      })
      .catch(() => setError(true));
  };

import { mapState, mapGetters } from "vuex"
import Button from "@/components/UI/Button.vue";
import { getVideoJobFiles } from "@/api/video";

export default {
    components: { Button },
    computed: {
        ...mapState(['taskId']),
        ...mapGetters(['videoExtention']),
        videoDownloadUrl(){
            return `${import.meta.env.VITE_API_URL}/${this.taskId}/ShamirGlacierExpression.${this.videoExtention}`
        },
        downloadAttribute(){
            return `ShamirGlacierExpression.${this.videoExtention}`
        }
    },
    methods: {
        onDownload(){
            download(this.videoDownloadUrl, this.taskId, this.videoExtention)
        }
    }
}
</script>

<style lang="scss" scoped>
.share-option {
    &__name {
        font-size: 8px;
        color: #545759;
        margin-top: 5.25px;
    }
    &__img {
        width: 41px;
        height: 41px;
    }
}
</style>
