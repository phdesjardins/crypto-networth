import {ref} from "vue";

export let transactionHistory

export const netWorthTimeSeries = ref([])
export const CADworthTimeSeries = ref([])
export const BTCworthTimeSeries = ref([])
export const ETHworthTimeSeries = ref([])

let historicBtcRates = null
let historicEthRates = null

let netWorthBalance = 0
let BTCnetWorthBalance = 0
let ETHnetWorthBalance = 0


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
  transactionHistory = initialTransactionList.sort(compareTransactions)
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

export function sanitizeTransactions() {
  transactionHistory.forEach(transaction => {
    updateBalance(transaction)
    updateTimeSeries(transaction)
  })
}

export function updateTimeSeries(transaction) {
  const date = transaction.createdAt
  const timestamp = Date.parse(date)
  netWorthTimeSeries.value.push({x: timestamp, y: netWorthBalance})
  BTCworthTimeSeries.value.push({x: timestamp, y: BTCnetWorthBalance})
  ETHworthTimeSeries.value.push({x: timestamp, y: ETHnetWorthBalance})
}

export function updateBalance(transaction) {
  const rates = getConversationRate(Date.parse(transaction.createdAt))
  const { BTC_CAD_rate, ETH_CAD_rate } = rates
  if (transaction.direction === 'credit' || transaction.direction === 'debit') {
    const credit = transaction.direction === 'credit'
    if (credit) {
      currencies[transaction.currency] += transaction.amount
    } else {
      currencies[transaction.currency] -= transaction.amount
    }
  }
  else if (transaction.type === 'conversion') {
    applyConversionToBalance(transaction.from, transaction.to)
  }
  // balance = CAD_balance + (BTC_balance * BTC_CAD_rate) + (ETH_balance * ETH_CAD_rate)
  BTCnetWorthBalance = currencies.BTC * BTC_CAD_rate
  ETHnetWorthBalance = currencies.ETH * ETH_CAD_rate
  netWorthBalance = currencies.CAD + (currencies.BTC * BTC_CAD_rate) + (currencies.ETH * ETH_CAD_rate)

}

/////////////////////// local functions ////////////////////////

function applyConversionToBalance(from, to) {
  currencies[from.currency] -= from.amount
  currencies[to.currency] += to.amount
}

function getConversationRate(date) {
  //takes ms timestamp as a param
  const btcRate = historicBtcRates.find(e => e.date >= date)
  const ethRate = historicEthRates.find(e => e.date >= date)
  return {
    BTC_CAD_rate: btcRate.midMarketRate,
    ETH_CAD_rate: ethRate.midMarketRate
  }
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