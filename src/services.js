const TRANSACTIONS_URL = 'https://shakepay.github.io/programming-exercise/web/transaction_history.json'

export default {
  async getTransactions() {
    return fetch(TRANSACTIONS_URL)
      .then(response => response.json())
      .then(data => {
        return data
      })

  }
}