const TRANSACTIONS_URL = 'https://shakepay.github.io/programming-exercise/web/transaction_history.json'
const CAD_TO_BTC_RATES = 'https://shakepay.github.io/programming-exercise/web/rates_CAD_BTC.json'
const CAD_TO_ETH_RATES = 'https://shakepay.github.io/programming-exercise/web/rates_CAD_ETH.json'

export default {
  async getTransactions() {
    return fetch(TRANSACTIONS_URL)
      .then(response => response.json())
      .then(data => {
        return data
      })
  },

  //CAD to BTC historic rates
  async getBTCrates() {
    return fetch(CAD_TO_BTC_RATES)
      .then(response => response.json())
      .then(data => {
        return data
      })
  },

  //CAD to ETH historic rates
  async getETHrates() {
    return fetch(CAD_TO_ETH_RATES)
      .then(response => response.json())
      .then(data => {
        return data
      })
}
}