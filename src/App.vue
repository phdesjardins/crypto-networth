<script setup>
import {ref} from "vue";
import LineChartItem from './components/LineChartItem.vue'
import services from "./services";
import {
  addInitialTransactionToStore, addBtcRatesToStore, addEthRatesToStore, sanitizeTransactions
} from "./store";

const transactionAreFetched = ref(false)

// initial data fetches

services.getBTCrates().then(r => addBtcRatesToStore(r)).then(() =>{

  services.getETHrates().then(r => addEthRatesToStore(r)).then(() => {
    services.getTransactions()
      .then(r => {addInitialTransactionToStore(r)})
      .then(() => {sanitizeTransactions()})
      .finally(() => { transactionAreFetched.value = true })
  })
})



</script>

<template>
  <div id="chart-container">
    <div id="title">Net worth chart</div>
    <LineChartItem v-if="transactionAreFetched"/>
  </div>
</template>

<style>
#app {
  font-family: Roboto;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#title {
  font-size: 36px;
  font-weight: 600;
  margin-bottom: 16px;
}

#chart-container {
  display: flex;
  flex-direction: column;
  margin: 108px auto 0 auto;
  height: 60vh;
  width: 70vw;
}
</style>
