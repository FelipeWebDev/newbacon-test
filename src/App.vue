<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import UserListing from "./components/UserListing.vue";
import UserDetails from "./components/UserDetails.vue";

const components = {
  UserListing,
  UserDetails
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
