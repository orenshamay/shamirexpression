<template>
  <div class="inline-block relative w-64">
    <vSelect
      :id="selectId"
      :modelValue="value"
      :options="options"
      :clearable="clearable"
      :placeholder="placeholder"
      @option:selecting="onInput"
      class="select"
    >
      <template #open-indicator="{ attributes }">
        <span v-bind="attributes">
          <img src="../../assets/svg/chevron.svg" alt="" />
        </span>
      </template>
      <template v-slot:option="option">
        <slot name="option" v-bind="option" />
      </template>
      <template v-slot:selected-option="selectedOption">
        <slot name="selected-option" v-bind="selectedOption" />
      </template>
    </vSelect>
  </div>
</template>

<script>
import vSelect from 'vue-select'

export default {
  name: 'Select',
  components: {
    vSelect,
  },
  props: {
    selectId: {},
    value: {},
    options: {
      type: Array,
      default: () => []
    },
    clearable: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: 'Select'
    }
  },
  methods: {
    onInput(value) {
      console.log('v-select')
      this.$emit('update:value', value)
    },
  },
}
</script>

<style lang="scss">
@import 'vue-select/src/scss/vue-select.scss';

.select {
  .vs {
    &__dropdown {
      &-toggle {
        border-color: #e5e5e5;
        padding: 0 0 8px 0;
      }
      &-menu {
        border-color: #e5e5e5;
      }
      &-option {
        &--highlight {
          background-color: #ff0000;
        }
      }
    }
    &__selected {
      // margin: 5px;
      margin: 8px 4px 0px 4px;
    }
    &__search {
      margin: 8px 0 0 0;
    }
    &__actions {
      padding: 8px 12px 0 3px;
    }
  }
}
</style>
