<template>
  <div class="bg-[rgba(0,0,0,0.25)] h-[100vh] w-[100vw] rounded-md overflow-clip select-none">
    <Navbar />
    <nuxt />
  </div>
</template>

<script>

import Navbar from "~/components/Navbar.vue";

export default {
  name: 'DefaultLayout',
  components: {Navbar},
}
</script>

<style>
body {
  margin: 0 !important;
  color: white;
  overflow: clip;
}
</style>
