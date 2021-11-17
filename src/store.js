import {ref} from "vue";

const conversionRates = {
  "CAD_BTC": 0.00001317,
  "BTC_CAD": 75912.37,
  "CAD_ETH": 0.000187382641577002,
  "ETH_CAD": 5336.67,
  "USD_BTC": 0.00001655,
  "BTC_USD": 60409,
  "USD_ETH": 0.000235469473148827,
  "ETH_USD": 4246.83,
  "BTC_ETH": 14.22475106685633,
  "ETH_BTC": 0.0703,
  "CAD_USD": 0.79,
  "USD_CAD": 1.25
}

const BTC_CAD_rate = conversionRates['BTC_CAD']
const ETH_CAD_rate = conversionRates['ETH_CAD']

export let transactionHistory

export const netWorthTimeSeries = ref([])

export let netWorthBalance = 0
let BTC_balance = 0
let ETH_balance = 0
let CAD_balance = 0


const currencies = {
  CAD: CAD_balance,
  BTC: BTC_balance,
  ETH: ETH_balance
}

/////////////////////// functions ////////////////////////

export function addInitialTransactionToStore(initialTransactionList) {
  transactionHistory = initialTransactionList.sort(compare)
}

function compare(a, b) {
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

export function updateTimeSeries(transaction) {
  const date = transaction.createdAt
  const timestamp = Date.parse(date)
  const entry = {x: timestamp, y: netWorthBalance}
  netWorthTimeSeries.value.push(entry)
}

function applyConversionToBalance(from, to) {
  currencies[from.currency] -= from.amount
  currencies[to.currency] += to.amount
}

export function updateBalance(transaction) {
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
  netWorthBalance = currencies.CAD + (currencies.BTC * BTC_CAD_rate) + (currencies.ETH * ETH_CAD_rate)
}