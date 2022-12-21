<template>
  <div class="header">
      <router-link to="/">
        <img class="logo" src="/static/img/logo.png" alt="logo">
      </router-link>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.header {
  height: 100px;
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 4px 34px rgba(141, 141, 141, 0.15);
  padding: 23px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  .logo {
      width: 8rem;
  }
}
</style>
