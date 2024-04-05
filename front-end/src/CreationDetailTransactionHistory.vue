<template>
  <div class="transaction-history initial-link-styling">
    <h2>History</h2>

    <div v-for="(tx, i) in creation.history" :key="`${creation.slug}-tx-${tx.txid}-${i}`">
      {{ getCestDateFromBlocktime(tx.blockTime) }}:
      <a :href="getAddressUrl(tx.sender)" target="_blank" rel="noopener noreferrer">{{
        getShortAddress(tx.sender)
      }}</a>
      to
      <a :href="getAddressUrl(tx.recipient)" target="_blank" rel="noopener noreferrer">{{
        getShortAddress(tx.recipient)
      }}</a>
      (tx
      <a :href="getTransactionUrl(tx.txid)" target="_blank" rel="noopener noreferrer">{{
        getShortHash(tx.txid)
      }}</a
      >)
    </div>
  </div>
</template>

<script setup>
defineProps(['creation'])

const getCestDateFromBlocktime = (blocktime) => {
  const date = new Date(blocktime * 1000)
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
}

const getShortAddress = (address) => {
  return `${address.slice(0, 7)}...${address.slice(-3)}`
}

const getTransactionUrl = (h) => {
  return `https://www.blockchain.com/explorer/transactions/btc/${h}`
}

const getAddressUrl = (address) => {
  return `https://www.blockchain.com/explorer/addresses/btc/${address}`
}

const getShortHash = (hash) => hash.slice(0, 7)
</script>

<style>
.transaction-history {
  margin-top: 4rem;
}

.transaction-history div {
  margin-bottom: 6px;
}
</style>
