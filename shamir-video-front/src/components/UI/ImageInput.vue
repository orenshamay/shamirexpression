<template>
    <div>
        <FileInput
            v-if="!imageResult"
            :accept="acceptTypes"
            :isError="isError"
            :errors="errors"
            @update:value="onFileInput"
        >
            <template v-for="(index, name) in $slots" v-slot:[name]>
                <slot :name="name" />
            </template>
        </FileInput>
        <div v-else class="relative">
            <img
                class="p-4 border rounded-md border-gray-300 w-full"
                :src="imageResult"
                alt=""
                srcset=""
            />
            <div
                class="close bg-primary rounded-full flex justify-center items-center p-2 absolute right-0 top-0"
                style="top: -10px; right: -10px"
                @click="clearResult"
            >
                <img
                    style="fill: white"
                    src="../../assets/svg/close.svg"
                    alt=""
                />
            </div>
        </div>
        <Modal
            :show="showModal"
            @close="showModal = false"
            modalContainerClass="image-input-modal-container rounded-md py-2 px-2 text-white m-0 w-full h-full lg:w-2/5"
        >
            <cropper
                ref="cropper"
                :src="imageSrc"
                :stencil-props="stencilProps"
                :canvas="{
                    minHeight: 0,
                    minWidth: 0,
                    maxHeight: '80vh',
                    maxWidth: '100vw',
                }"
                image-restriction="stencil"
                :auto-zoom="false"
            />
            <div class="flex space-x-3 mt-4" v-if="!validationLoading">
                <Button
                    type="outlined"
                    class="image-input-button w-full"
                    @click="showModal = false"
                >
                    {{ $t('INPUTS_IMAGE_CANCEL') }}
                </Button>
                <Button class="image-input-button w-full" @click="onSave">
                    {{ $t('INPUTS_IMAGE_SAVE') }}
                </Button>
            </div>
            <div class="flex justify-center" v-else>
                <Loading />
            </div>
        </Modal>
        <Modal
            :show="showInvalidModal"
            @close="showInvalidModal = false"
            modalContainerClass="bg-primary rounded-md py-8 px-5 text-white m-4 w-full lg:w-2/5"
        >
            <div>
                <div v-html="$t('VALIDATION_ERRORS_BAD_IMAGE')"></div>
                <Button
                    type="outlined"
                    class="image-input-button w-48 mt-6"
                    @click="showInvalidModal = false"
                >
                    {{ $t('VALIDATION_ERRORS_OK_BAD_IMAGE') }}
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
import FileInput from './FileInput.vue'
import Modal from './Modal.vue'
import Button from './Button.vue'
import Loading from './Loading.vue'
import { toBase64 } from '../../utils/imageUtils'
import { verifyImage } from '@/api/imageVerification'

import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

import CustomImage from '../../utils/models/CustomImage'

export default {
    name: 'ImageInput',
    props: {
        aspectRatio: {},
        isError: {},
        errors: {
            type: Array,
            default: () => [],
        },
        image: {
            type: CustomImage || undefined,
        },
        areOnlyPNG: {
            type: Boolean,
            default: false,
        },
    },
    components: { FileInput, Cropper, Modal, Button, Loading },
    data() {
        return {
            showModal: false,
            showInvalidModal: false,
            imageSrc: null,
            raw: null,
            validationLoading: false,
        }
    },
    computed: {
        imageResult() {
            return this.image?.preview
        },
        acceptTypes() {
            if (this.areOnlyPNG) return 'image/png'
            return 'image/png, image/jpeg'
        },
        stencilProps(){
            const obj = {}
            if (this.aspectRatio) obj.aspectRatio = this.aspectRatio
            return obj
        }
    },
    methods: {
        async onFileInput(files) {
            this.raw = files[0]
            this.imageSrc = await toBase64(files[0])
            this.showModal = true
        },
        async onSave() {
            const formdata = new FormData()
            formdata.append('image', this.raw)
            const { canvas } = this.$refs.cropper.getResult()
            if (canvas) {
                canvas.toBlob((blob) => {
                    const image = new CustomImage(blob, canvas.toDataURL())
                    this.$emit('update:image', image)
                    this.showModal = false
                }, 'image/png')
            }
        },
        clearResult() {
            this.$emit('update:image', undefined)
        },
    },
}
</script>

<style lang="scss" scoped>
.image-input-button {
    padding-left: 0;
    padding-right: 0;
}
</style>
