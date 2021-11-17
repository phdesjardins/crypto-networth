<script setup>
import LineChartItem from './components/LineChartItem.vue'
import {
  addInitialTransactionToStore,
  updateBalance,
  transactionHistory,
  updateTimeSeries
} from "./store";
import {ref} from "vue";

const transactionAreFetched = ref(false)

fetchTransactions()

function fetchTransactions() {
  fetch('https://shakepay.github.io/programming-exercise/web/transaction_history.json')
    .then(response => response.json())
    .then(data => {
      addInitialTransactionToStore(data)
    })
    .then(() => sanitizeTransactions()).finally(() => {
      transactionAreFetched.value = true
  });
}

function sanitizeTransactions() {
  transactionHistory.forEach(transaction => {
    updateBalance(transaction)
    updateTimeSeries(transaction)
  })
}
</script>

<template>
  <div id="chart-container">
    <div id="title">Net worth chart</div>
    <LineChartItem v-if="transactionAreFetched" />
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
