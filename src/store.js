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

export function addInitialTransactionToStore(initialTransactionList) {
  transactionHistory = initialTransactionList
}

export const netWorthTimeSeries = ref([])

export let balance = 0

let BTC_balance = 0
let ETH_balance = 0
let CAD_balance = 0


const currencies = {
  CAD: CAD_balance,
  BTC: BTC_balance,
  ETH: ETH_balance
}

function applyConversionToBalance(from, to) {
  const conversion = `${from.currency}_${to.currency}`
  currencies[from.currency] -= from.amount
  currencies[to.currency] += to.amount * conversionRates[conversion]
}

export function updateBalance(transaction) {
  if (transaction.type === 'peer') {
    const credit = transaction.direction === 'credit'
    if (credit) {
      currencies[transaction.currency] += transaction.amount
    } else {
      currencies[transaction.currency] -= transaction.amount
    }
  }

  const conversion = transaction.type === 'conversion'
  if (conversion) {
    applyConversionToBalance(transaction.from, transaction.to)
  }
  // balance = CAD_balance + (BTC_balance * BTC_CAD_rate) + (ETH_balance * ETH_CAD_rate)
  balance = currencies.CAD + (currencies.BTC * BTC_CAD_rate) + (currencies.ETH * ETH_CAD_rate)
}