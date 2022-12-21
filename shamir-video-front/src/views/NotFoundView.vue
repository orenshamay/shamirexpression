<script setup>
import Button from '@/components/UI/Button.vue';
</script>

<template>
    <div>
        <h1 class="font-bold text-xl leading-7 text-center my-7" v-html="$t('404.TITLE')" />
        <h3 class="font-semibold text-lg leading-7 text-center my-7" v-html="$t('404.TEXT')" />
        <router-link to="/">
            <Button class="w-full">{{ $t('404.BUTTON')}}</Button>
        </router-link>
    </div>
</template>