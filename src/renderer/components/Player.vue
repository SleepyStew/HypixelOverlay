<template>
  <div class="grid grid-cols-[13rem,6rem,12rem,6rem,6rem,10rem,8rem]">
    <div
      :class="'overflow-x-clip text-xl flex items-center justify-center' + (error ? ' text-red-500' : '') + (nicked ? ' text-yellow-500' : '') + (owner === uuid ? ' text-blue-500' : '') + (friends.includes(uuid) && owner !== uuid ? ' text-green-500' : '')">
      <div role="status" class="flex justify-center items-center" v-if="loading">
        <svg aria-hidden="true"
             :class="'mr-2 w-4 h-4 text-gray-300 animate-spin' + (!loadedUUID ? ' fill-green-600' : '') + (loadedUUID ? ' fill-blue-600' : '')"
             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"/>
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"/>
        </svg>
      </div>
      <img :src="'https://mc-heads.net/avatar/' + name"
           :class="'w-5 h-5 min-w-5 min-h-5 mr-2'  + (this.rankColour !== null ? ' ring-2 ' + this.rankColour : '')" alt=""/>
      {{ name }}
    </div>
    <div :class="winsColour(stats.wins) + ' text-xl flex justify-center'" v-if="stats !== null">
      {{ stats.wins || "0" }}
    </div>
    <div class="text-xl flex justify-center" v-if="stats !== null">
      {{ stats.murderer_wins || "0" }}
    </div>
    <div class="text-xl flex justify-center" v-if="stats !== null">
      {{ Math.round((stats.kills / stats.deaths) * 100) / 100 || "-" }}
    </div>
    <div class="text-xl flex justify-center" v-if="stats !== null">
      {{ stats.kills || "0" }}
    </div>
    <div class="text-xl flex justify-center" v-if="stats !== null">
      {{ stats.detective_wins || "0" }}
    </div>
    <div class="text-xl flex justify-center" v-if="stats !== null">
      {{ stats.deaths || "0" }}
    </div>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "Player",
  props: {
    name: String,
    owner: String,
    friends: Array,
  },
  data() {
    return {
      stats: null,
      mmstats: null,
      error: false,
      nicked: false,
      loading: true,
      loadedUUID: false,
      uuid: null,
      rankColour: null,
    }
  },
  methods: {
    winsColour(wins) {
      if (wins >= 20000)
        return 'text-red-500'
      if (wins >= 10000)
        return 'text-green-500'
      if (wins >= 5000)
        return 'text-blue-400'
    },
    getStats() {
      const apiKey = localStorage.getItem('apikey');
      fetch(`https://playerdb.co/api/player/minecraft/${this.name}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            this.loadedUUID = true;
            this.uuid = data.data.player.id;
            return fetch(`https://api.hypixel.net/player?key=${apiKey}&uuid=${data.data.player.id}`);
          } else {
            this.nicked = true;
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            if (data.player == null) {
              this.nicked = true;
            } else {
              this.mmstats = data["player"]["stats"]["MurderMystery"]
              this.stats = data["player"]
              this.getRankColour()
            }
          } else {
            this.error = true;
          }
        })
        .catch(error => {
          console.error(error);
          this.error = true;
          this.loading = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getRankColour() {
      if (this.nicked)
        return this.rankColour = ''

      if (this.stats.monthlyRankColor === "GOLD")
        return this.rankColour = "ring-orange-400"
      if (this.stats.newPackageRank === "MVP_PLUS")
        return this.rankColour = 'ring-cyan-400'
      if (this.stats.newPackageRank === "MVP")
        return this.rankColour = 'ring-cyan-400'
      if (this.stats.newPackageRank === "VIP_PLUS")
        return this.rankColour = 'ring-green-500'
      if (this.stats.newPackageRank === "VIP")
        return this.rankColour = 'ring-green-500'
      this.rankColour = 'ring-gray-500'
    }
  },
  created() {
    this.getStats();
  }
}
</script>

<style scoped>

</style>
