<script setup>
import Button from '@/components/UI/Button.vue';
</script>

<template>
    <div>
        <h1 class="font-bold text-xl leading-7 text-center my-7" v-html="$t('LIMITS_TITLE')" />
        <p class="mb-6 text-gray-600" v-html="$t('LIMITS_TEXT')" />
         <router-link to="/">
            <Button class="w-full">{{ $t('LIMITS_BUTTON')}}</Button>
        </router-link>
    </div>
</template>
