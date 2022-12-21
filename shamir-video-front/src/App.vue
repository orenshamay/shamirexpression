<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import Header from './components/app/Header.vue'
</script>

<template>
  <div class="container view-as-mobile">
    <Header />
    <div class="px-4">
      <router-view />
    </div>
  </div>
</template>

<style></style>
