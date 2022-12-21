<template>
  <div class="text-input py-3">
    <label class="block text-sm font-normal mb-2 text-left" :for="inputId">
      <div class="text-black text-base">
        <slot name="label" />
      </div>
      <div class="text-sm text-gray-500 font-light leading-4"><slot name="description" /></div>
    </label>
    <input
      :value="value"
      @input="onInput"
      class="
        appearance-none
        border border-gray-300
        rounded
        w-full
        py-2
        px-3
        text-gray-800
        mb-1
        leading-tight
        focus:outline-none focus:shadow-outline
        focus:border-gray-500
      "
      :id="inputId"
      :type="type"
      :placeholder="placeholder"
    />
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
const props = {
  inputId: {
    type: String,
    default: 'input',
  },
  type: {
    type: String,
    default: 'text',
  },
  placeholder: {
    type: String,
  },
  isError: {
    type: Boolean,
    default: false,
  },
  value: {},
  errors: {
    type: Array,
    default: () => []
  }
}


export default {
  props,
  methods: {
    onInput($event) {
      console.log('input text', $event.target.value)
      $event.preventDefault()
      this.$emit('update:value', $event.target.value)
    },
  },
}
</script>
