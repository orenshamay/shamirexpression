<template>
    <div class="video-wrap">
        <div v-if="!isVideoAvailable" class="video-preview" @click="isVideoAvailable = true">
            <slot />
            <div class="play-overlay">
             <img class="play" src="../../assets/svg/play.svg" alt="">
            </div>
        </div>
        <video v-else controls autoplay>
            <source v-for="(source, idx) in sources" :key="idx" :src="source.src" :type="source.type">
        </video>
    </div>
</template>

<script>

export default {
    name: "VideoInPlace",
    props: {
        sources: {
            type: Array,
            default: () => []
        },
        previewImage: {}
    },
    data() {
        return {
            isVideoAvailable: false
        }
    }
}
</script>

<style lang="scss" scoped>
.video-wrap {
    width: 100%;
}

.video-preview {
    position: relative;
    .preview {
        width: 100%;
        height: 100%;
    }
    
}

.play-overlay {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
}
</style>