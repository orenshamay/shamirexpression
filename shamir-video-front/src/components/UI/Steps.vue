<template>
  <div class="steps">
    <div class="w-full">
      <div class="">
        <div class="flex items-center">
          <template v-for="(step, idx) in steps" :key="idx">
            <div class="flex items-center text-purple-500 relative">
              <div
                :class="getNodeClasses(idx)"
              >
                {{ idx + 1 }}
              </div>
            </div>
            <div
              v-if="idx + 1 < steps"
              :class="getEdgeClasses(idx)"
            ></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Steps',
  props: {
    steps: {
      type: Number,
      default: 5,
    },
    active: {
      type: Number,
      default: 0,
    },
  },
  data() {
      return {
          activeNodeClasses: ['flex','items-center','justify-center','rounded-full','transition','duration-500','ease-in-out','h-8','w-8','py-3','bg-primary','text-white text-base','font-semibold','border-2 border-primary'],
          defaultNodeClasses: ['flex','items-center','justify-center','rounded-full','transition','duration-500','ease-in-out','h-8','w-8','py-3','bg-white','text-gray-600','text-base','font-semibold','border-2 border-gray-200'],
          activeEdgeClasses: ['flex-auto','border-t-2','transition','duration-500','ease-in-out','border-primary'],
          defaultEdgeClasses: ['flex-auto','border-t-2','transition','duration-500','ease-in-out','border-gray-200']
      }
  },
  methods: {
    onStepClick(idx) {
      this.$emit('click', idx)
    },
    getNodeClasses(idx){
        if(idx < this.active) return this.activeNodeClasses
        return this.defaultNodeClasses
    },
    getEdgeClasses(idx){
        if(idx < this.active) return this.activeEdgeClasses
        return this.defaultEdgeClasses
    }
  },
}
</script>

<style lang="scss" scoped>
.steps {
  display: flex;
  @media (max-width: 768) {
    width: 100%;
    justify-content: space-evenly;
  }
}
.step {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  &__circle {
    width: 32px;
    height: 32px;
    border-radius: 100%;
    border: 1px solid rgba(0, 0, 0, 0.08);
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    // @include font(
    //   --step-circle-font,
    //   var(--font-normal),
    //   var(--font-sm),
    //   var(--h4-line-height),
    //   'Inter'
    // );
  }
  &__label {
    margin-left: 8px;
    // @include font(
    //   --step-label-font,
    //   var(--font-normal),
    //   var(--font-sm),
    //   var(--h4-line-height),
    //   'Inter'
    // );
    font-family: 'Inter', sans-serif;
    @media (max-width: 768px) {
      margin-left: 0;
    }
  }
  &:not(:first-child) {
    margin-left: var(--spacer-lg);
    // @media (max-width: $mobile-max) {
    //   margin-left: var(--spacer-xs);
    // }
  }
  &.is-active & {
    &__label {
      font-weight: var(--font-semibold);
    }
  }
  &.is-disabled {
    opacity: 0.4;
  }
  // &.is-passed {
  // }
}
</style>
