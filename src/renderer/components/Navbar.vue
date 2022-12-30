<template>
  <div class="bg-[rgba(0,0,0,0.15)] h-12 rounded-t-md navbar px-3 min-w-fit flex items-center">
    <NuxtLink v-if="!settingsPage" to="/settings" class="text-xl mr-3 h-12 hover:cursor-pointer w-min nodrag font-semibold flex items-center justify-center">
      <font-awesome-icon icon="gear" />
    </NuxtLink>
    <NuxtLink v-if="settingsPage" to="/" class="text-xl pr-3 h-12 hover:cursor-pointer w-min nodrag font-semibold flex items-center justify-center">
      <font-awesome-icon icon="house" />
    </NuxtLink>
    <div class="text-2xl font-semibold flex items-center h-12 min-w-fit">
      Hypixel Overlay
      <div class="pl-2 font-light text-gray-400">
        {{ version }}
      </div>
    </div>
    <div class="flex justify-end items-center h-12 w-[100%] gap-4 pr-1">
      <div v-on:click="minimizeApplication" class="text-xl relative bottom-[7px] h-12 hover:cursor-pointer w-min nodrag font-semibold flex items-center justify-center">
        <font-awesome-icon icon="window-minimize"/>
      </div>
      <div v-on:click="closeApplication" class="text-2xl h-12 hover:cursor-pointer w-min nodrag font-semibold flex items-center justify-center">
        <font-awesome-icon icon="xmark"/>
      </div>
    </div>

  </div>
</template>

<script>

const { BrowserWindow } = require('@electron/remote');

export default {
  name: "Navbar",
  data () {
    return {
      settingsPage: this.$route.path === '/settings',
      version: require('../../../package.json').version
    }
  },
  methods: {
    closeApplication() {
      BrowserWindow.getFocusedWindow().close();
    },
    minimizeApplication() {
      BrowserWindow.getFocusedWindow().minimize();
    },
  },
  created () {
    this.$router.afterEach((to, from) => {
      this.settingsPage = to.path === '/settings'
    })
  }
}
</script>

<style scoped>
.navbar {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
.nodrag {
  -webkit-app-region: none;
}
</style>
