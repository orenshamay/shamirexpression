<template>
  <div>
    <Select
      :options="options"
      :value="value"
      @update:value="onInput" 
    >
      <template v-slot:option="option">
        <span class="flex items-center">
          <img class="mr-2.5 flag" :src="getOptionFlag(option.flag)" alt="" />
          {{ option.label }}
        </span>
      </template>
      <template v-slot:selected-option="selectedOption">
        <span class="flex items-center text-sm">
          <img class="mr-2.5 flag" :src="getOptionFlag(selectedOption.flag)" alt="" />
          {{ selectedOption.label }}
        </span>
      </template>
    </Select>
  </div>
</template>

<script>
import Select from '../UI/Select.vue'

export default {
  components: { Select },
  props: {
    value: {},
    options: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getOptionFlag(flag) {
      if (!flag) return
      if (flag.includes('http')) return flag
      // Vite specific
      const flags = import.meta.globEager('/src/assets/svg/flags/*.svg')
      return flags[`/src/assets/svg/flags/${flag}.svg`].default
    },
    onInput(value){
      console.log('kek')
      this.$emit('update:value', value)
    }
  },
}
</script>


<style lang="scss" scoped>
  .flag {
    width: 28.9px;
    width: 18.93px;
  }
</style>