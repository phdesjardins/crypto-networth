import {ref} from "vue";

export let transactionHistory

export const netWorthTimeSeries = ref([])

let historicBtcRates = null
let historicEthRates = null

let netWorthBalance = 0

let BTC_balance = 0
let ETH_balance = 0
let CAD_balance = 0

const currencies = {
  CAD: CAD_balance,
  BTC: BTC_balance,
  ETH: ETH_balance
}

/////////////////////// exported functions ////////////////////////

export function addInitialTransactionToStore(initialTransactionList) {
  // store and sort transactions
  transactionHistory = initialTransactionList.sort(compareTransactions)

  // sanitize each transaction
  transactionHistory.forEach(transaction => {
    updateBalance(transaction)
    updateTimeSeries(transaction)
  })
}

export function addBtcRatesToStore(historicRates) {
  historicBtcRates = historicRates.map(rate => {
    return { midMarketRate: rate.midMarketRate, date: Date.parse(rate.createdAt)}
  })
}

export function addEthRatesToStore(historicRates) {
  historicEthRates = historicRates.map(rate => {
    return { midMarketRate: rate.midMarketRate, date: Date.parse(rate.createdAt)}
  })
}

/////////////////////// local store.js functions ////////////////////////

function updateTimeSeries(transaction) {
  // create an entry for the line chart with the transaction date the current netWorthBalance
  const date = transaction.createdAt
  const timestamp = Date.parse(date)
  const entry = {x: timestamp, y: netWorthBalance}
  netWorthTimeSeries.value.push(entry)
}

function applyConversionToBalance(from, to) {
  currencies[from.currency] -= from.amount
  currencies[to.currency] += to.amount
}

function getConversationRate(date) {
  const btcRate = historicBtcRates.find(e => e.date >= date)
  const ethRate = historicEthRates.find(e => e.date >= date)
  return {
    BTC_CAD_rate: btcRate.midMarketRate,
    ETH_CAD_rate: ethRate.midMarketRate
  }
}

function updateBalance(transaction) {
  const rates = getConversationRate(Date.parse(transaction.createdAt))
  const { BTC_CAD_rate, ETH_CAD_rate } = rates

  if (transaction.type === 'external account' || transaction.type === 'peer') {
    transaction.direction === 'credit' ?
      currencies[transaction.currency] += transaction.amount :
      currencies[transaction.currency] -= transaction.amount
  }
  else applyConversionToBalance(transaction.from, transaction.to)

  netWorthBalance = currencies.CAD + (currencies.BTC * BTC_CAD_rate) + (currencies.ETH * ETH_CAD_rate)
}

function compareTransactions(a, b) {
  const timestampA = Date.parse(a.createdAt)
  const timestampB = Date.parse(b.createdAt)
  if ( timestampA < timestampB ){
    return -1;
  }
  if ( timestampA > timestampB ){
    return 1;
  }
  return 0;
}