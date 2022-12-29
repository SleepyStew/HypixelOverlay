<template>
  <div class="p-5">
    <div class="text-3xl font-semibold mb-2">
      Settings
    </div>
    <div class="flex items-center flex-col">
      <div class="w-[100%] bg-stone-900 rounded-md p-2 pb-0">
        <div class="text-2xl font-semibold">
          Essential
        </div>
        <div class="mt-4">
          <label class="block text-xl">API Key
            <input type="text" v-model="apikey" @change="updateApiKey" placeholder="exampleKey-c597-4cbe-aaf3-f6d0eb3ddfce"
                   class="bg-[#1c1e20] mt-2 h-min border-2 border-[#333338] border-dashed rounded-md p-2 w-full mb-4 focus:outline-none focus:border-blue-600 focus:border-solid transition"/>
          </label>
          <label class="block text-xl">Client
            <select v-model="client" @change="updateClient" class="bg-[#1c1e20] mt-2 h-min border-2 border-[#333338] border-dashed rounded-md p-2 w-full mb-4 focus:outline-none focus:border-blue-600 focus:border-solid transition">
              <option :value="null" selected disabled hidden>Select client...</option>
              <option value="lunar">Lunar</option>
              <option value="badlion">Badlion</option>
              <option value="vanilla">Vanilla</option>
            </select>
          </label>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "settings",
  data () {
    return {
      apikey: '',
      client: ''
    }
  },
  created () {
    this.apikey = localStorage.getItem('apikey')
    this.client = localStorage.getItem('client')
  },
  methods: {
    updateApiKey () {
      localStorage.setItem('apikey', this.apikey)
    },
    updateClient () {
      localStorage.setItem('client', this.client)
    }
  }
}
</script>

<style scoped>

</style>
