<template>
  <div class="text-xs-center" v-show="enabled">
    <!-- <md-spinner :md-size="50" md-indeterminate> </md-spinner> -->
     <!-- <div class="text-xs-center"> -->
    <v-progress-circular
      indeterminate
      color="primary"
    ></v-progress-circular>
    <!-- <md-progress-spinner :md-size="50" class="md-accent spinner" md-mode="indeterminate"></md-progress-spinner> -->
  </div>
</template>

<script>
import { eventBus } from '@/main.js'

export default {
  name: 'PageLoader',
  data () {
    return {
      enabled: false,
      eventBus: eventBus,
      waitingList: []
    }
  },
  mounted () {
    eventBus.$on('changeLoader', (signal, actionName) => {
      /* eslint-disable */
      /**
       * The logic is thus:
       * There's an array waitingList in which actions get pushed if they arrive with a signal of true.
       * As soon as action arrives with a signal of false, the action is removed from waitingList,
       * if it is in waitingList.
       * At the end of each such event, we check the length of waitingList. If it is empty,
       * we hide the loader by making enabled false. Otherwise, we set enabled to true to show it.
       * 
       */
      // console.log('PAGE LOADER', actionName)     
      if (signal) {
        this.waitingList.push(actionName)
      } else {
        let index = this.waitingList.indexOf(actionName)
        if (index > -1) {
          this.waitingList.splice(index, 1)
        }
      }

      if (this.waitingList.length === 0) {
        this.enabled = false
      } else {
        this.enabled = true        
      }
    })
  }
}
</script>

<style>
</style>