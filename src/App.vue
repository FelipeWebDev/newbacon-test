<template>
  <div id="app">
    <UserListing />
  </div>
</template>

<script>
import UserListing from "./components/UserListing.vue";

const components = {
  UserListing,
};

export default {
  components,
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px 50px;
  
  @media (min-width: 1068px) {
    padding: 96px 348px;
  }
}
</style>
