<template>
  <div class="flex items-center flex-col">
    <div class="p-3 pt-2 overflow-clip">
      <div class="grid grid-cols-[13rem,6rem,12rem,6rem,6rem,10rem,8rem]">
        <div class="text-xl font-semibold flex justify-center">
          Name
        </div>
        <div class="text-xl font-semibold flex justify-center drop-shadow-xl">
          Wins
        </div>
        <div class="text-xl font-semibold flex justify-center drop-shadow-xl">
          Murderer Wins
        </div>
        <div class="text-xl font-semibold flex justify-center drop-shadow-xl">
          KDR
        </div>
        <div class="text-xl font-semibold flex justify-center drop-shadow-xl">
          Kills
        </div>
        <div class="text-xl font-semibold flex justify-center drop-shadow-xl">
          Detective Wins
        </div>
        <div class="text-xl font-semibold flex justify-center drop-shadow-xl">
          Deaths
        </div>
      </div>
      <Player v-for="player in playerlist" :name="player" :key="player" :owner="uuid" :friends="friends"></Player>
    </div>
    <div v-if="invalid"
         class="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 w-[80%] dark:text-red-800"
         role="alert">
      <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"
           xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"></path>
      </svg>
      <span class="sr-only">Info</span>
      <div>
        <span class="font-medium">Invalid Configuration!</span> {{ invalidMessage }}
      </div>
    </div>
  </div>

</template>

<script>
import Player from "~/components/Player.vue";

const fileWatcher = require("chokidar");
const fs = require('fs');

export default {
  name: 'IndexPage',
  components: {Player},
  data() {
    return {
      linecount: 0,
      playerlist: [],
      invalid: false,
      invalidMessage: "Please edit your settings by clicking the icon in the top left.",
      uuid: null,
      filewatcher: null,
      friends: [],
    }
  },
  methods: {
    processNewLines(list) {
      if (this.invalid)
        return
      for (let i = 0; i < list.length; i++) {
        if (list[i].startsWith("ONLINE: ")) {
          this.playerlist = list[i].split("ONLINE: ")[1].split(", ");
          this.removeDuplicates();
        }
        if (list[i].includes(":")) {
          continue;
        }
        if (list[i] === "       ") {
          this.playerlist = [];
        }
        if (list[i].includes(" has joined (")) {
          this.playerlist.push(list[i].split(" has joined (")[0]);
          this.removeDuplicates();
        }
        if (list[i].includes(" has quit!")) {
          this.playerlist.splice(this.playerlist.indexOf(list[i].split(" has quit!")[0]), 1);
          this.removeDuplicates();
        }
      }
    },
    removeDuplicates() {
      this.playerlist = [...new Set(this.playerlist)];
    }
  },
  mounted() {

    let logLocation;
    const client = localStorage.getItem('client');
    if (client === null || client === "") {
      this.invalid = true;
      this.invalidMessage = "Please select a client in settings."
    }

    const apiKey = localStorage.getItem('apikey');

    if (apiKey === null || apiKey === "") {
      this.invalid = true;
      this.invalidMessage = "Please enter an API Key in settings."
    } else {
      fetch(`https://api.hypixel.net/key?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.success === false) {
            this.invalid = true;
            this.invalidMessage = "Your API Key is invalid.";
          } else {
            this.uuid = data.record.owner;
            fetch(`https://api.hypixel.net/friends?key=${apiKey}&uuid=${this.uuid}`)
              .then(response => response.json())
              .then(data => {
                for (let i = 0; i < data.records.length; i++) {
                  this.friends.push(data.records[i].uuidReceiver);
                  this.friends.push(data.records[i].uuidSender);
                }
                fetch(`https://playerdb.co/api/player/minecraft/${this.uuid}`)
                  .then(response => response.json())
                  .then(data => {
                    console.log(data.data)
                    this.playerlist.push(data.data.player.username);
                  })
              })
          }
        })
        .catch(error => {
          console.error(error);
          this.invalid = true;
          this.invalidMessage = "Your API Key is invalid.";
        });
    }

    if (this.invalid === true) {
      return
    }

    const username = require('os').userInfo().username;
    if (client === 'vanilla') {
      logLocation = `C:\\Users\\${username}\\AppData\\Roaming\\.minecraft\\logs\\latest.log`;
    } else if (client === 'lunar') {
      logLocation = `C:\\Users\\${username}\\.lunarclient\\offline\\multiver\\logs\\latest.log`;
    } else if (client === 'badlion') {
      const appdata = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + "/.local/share")
      logLocation = appdata + "\\.minecraft\\logs\\blclient\\minecraft\\latest.log";
    }

    const fileContents = fs.readFileSync(logLocation, "binary");

    this.linecount = fileContents.split('\n').length;

    this.filewatcher = fileWatcher.watch(logLocation, {usePolling: true}).on('change', (eventType, filename) => {
      //   // set this.chat to the last 100 lines of the file
      let fileContents = fs.readFileSync(logLocation, "binary");
      const fileContentsArray = fileContents.split('\n');
      //
      if (fileContentsArray.length > this.linecount) {
        const linediff = fileContentsArray.length - this.linecount;
        this.linecount = fileContentsArray.length;
        let newLines;
        fileContents = fileContentsArray.slice(1).slice(-linediff - 1).join("\n");
        if (fileContents.includes("[Render thread\\/INFO\\]")) {
          newLines = fileContents.replaceAll(/§\w/g, "").replaceAll("\r", "").replaceAll(/\[[0-9][0-9]:[0-9][0-9]:[0-9][0-9]\] \[Render thread\/INFO\]: \[System\] /g, "").split("\n").filter((line) => line.startsWith("[CHAT] ")).join("\n").replaceAll("[CHAT] ", "").split("\n");
        } else {
          newLines = fileContents.replaceAll(/§\w/g, "").replaceAll("\r", "").replaceAll(/\[[0-9][0-9]:[0-9][0-9]:[0-9][0-9]\] \[Client thread\/INFO\]: /g, "").split("\n").filter((line) => line.startsWith("[CHAT] ")).join("\n").replaceAll("[CHAT] ", "").split("\n");
        }
        this.processNewLines(newLines);
      }
    });
  },
  beforeDestroy() {
    this.filewatcher.close();
  }
}
</script>
<style>
</style>
