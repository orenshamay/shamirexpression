<template>
  <div
    class="file-input"
    @drop="handleDrop"
    @dragover.prevent.stop=""
    @dragenter.prevent.stop=""
    @dragleave.prevent.stop=""
  >
    <label
      class="
        w-full
        flex flex-col
        items-center
        justify-center
        px-4
        py-7
        text-gray-800
        rounded-sm
        tracking-wide
        border border-gray-800 border-dashed
        cursor-pointer
        hover:text-gray-500
      "
    >
      <img src="../../assets/svg/uploadImage.svg" />
      <span class="mt-2 text-xs leading-normal text-gray-500 text-center w-6/12">
        <slot name="label">{{ $t('INPUTS_FILE_LABEL') }}</slot></span
      >
      <!-- Click to upload/Take a picture -->
      <input
        type="file"
        class="hidden"
        ref="fileInput"
        :accept="accept"
        @input="handleInputChange"
      />
    </label>
    <div v-if="isError || errors.length > 0" class="text-red-500 text-sm text-left">
      <slot name="error">
        <p v-for="(error, idx) in errors" :key="idx">
          * {{ error.$message }}
        </p>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isError: {},
    errors: {
      type: Array,
      default: () => []
    },
    accept: {
      type: String
    }
  },
  data() {
    return {
      id: null,
      fileList: [],
    }
  },
  methods: {
    handleInputChange() {
      this.filelist = [...this.$refs.fileInput.files]
      this.$emit('update:value', this.filelist)
    },
    handleDrop($event) {
      this.$refs.fileInput.files = $event.dataTransfer.files
      this.isDragEntered = false
      this.handleInputChange()
      $event.preventDefault()
    },
  },
  mounted() {
    this.id = this._uid
  },
}
</script>

<style lang="scss" scoped></style>
