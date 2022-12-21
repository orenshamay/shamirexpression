<template>
  <div>
    <FileInputVue @input="onImageInput" />
    <div class="verification answer" v-if="answer" :class="{'is-not-neutral': isNotNeutral }">
      {{ answer }}
      <span v-if="isNotNeutral">
        -> NOT ALLOWED
      </span>
    </div>
    <div class="verification response" v-if="response">
      {{ response }}
    </div>
    <div class="verification error" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import FileInputVue from './UI/FileInput.vue'
import { verifyImage } from '../api/imageVerification'

function findMax(object) {
  let max = 0
  let result
  for (const [key, value] of Object.entries(object)) {
    console.log(value)
    const prop = value.probability
    if (max < prop) {
      max = prop
      result = value.className
    }
  }
  return result
}

export default {
  components: { FileInputVue },
  data() {
    return {
      response: undefined,
      error: undefined,
      answer: undefined
    }
  },
  computed: {
    isNotNeutral(){
      if(!this.response) return null
      return this.answer !== 'Neutral'
    }
  },
  methods: {
    async onImageInput(files) {
      const image = files[0]
      const formData = new FormData()
      formData.append('image', image)
      try {
        const { data } = await verifyImage(formData)
        this.response = data
        this.answer = findMax(data)
        console.log(this.answer)
      } catch (error) {
        this.error = error
        this.response = undefined
      }
    },
  },
}
</script>

<style lang="scss">
.verification {
  margin-top: 20px;
  &.error {
    color: red;
  }
  &.answer {
    font-size: 50px;
    color: greenyellow;
    &.is-not-neutral {
      color: red;
    }
  }
}
</style>
