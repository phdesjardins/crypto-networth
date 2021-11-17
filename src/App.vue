<script setup>
import LineChartItem from './components/LineChartItem.vue'
import {addInitialTransactionToStore, updateBalance, balance, netWorthTimeSeries, transactionHistory} from "./store";
import {ref} from "vue";

fetchTransactions()

const transactionAreFetched = ref(false)

function fetchTransactions() {
  fetch('https://shakepay.github.io/programming-exercise/web/transaction_history.json')
    .then(response => response.json())
    .then(data => {
      addInitialTransactionToStore(data)
    })
    .then(() => createTimeSeries()).finally(() => {
      transactionAreFetched.value = true

    console.log(netWorthTimeSeries)
  });
}

function createTimeSeries() {
  transactionHistory.forEach(transaction => {
    const date = transaction.createdAt
    const timestamp = Date.parse(date)

    updateBalance(transaction)

    const entry = {x: timestamp, y: balance}
    netWorthTimeSeries.value.push(entry)
  })
}
</script>

<template>
  <div id="chart-container">
    <LineChartItem v-if="transactionAreFetched" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#chart-container {
  height: 70vh;
  width: 80vw;
  margin: auto;
}
</style>
