import Axios from 'axios'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const findOwnerByTxHash = async (txHash) => {
  console.log('txHash', txHash)
  let currentTxHash = txHash

  for (;;) {
    try {
      await sleep(200)
      const { owner, voutHash } = await getOwnerOrVoutHash(currentTxHash)
      if (owner) return owner
      currentTxHash = voutHash
    } catch (error) {
      console.error(error)
    }
  }
}

const getOwnerOrVoutHash = async (txHash) => {
  // const client = new CovalentClient('cqt_rQC77Kvj9pCJyt87R8VHhRM6CW93')
  // const resp = await client.TransactionService.getTransaction('btc-mainnet', txHash)
  // console.log("🚀 ~ getOwnerOrVoutHash ~ resp:", resp)
  const url = `https://blockstream.info/api/tx/${txHash}`
  const response = await Axios.get(url)

  console.log('🚀 ~ getOwnerOrVoutHash ~ response:', response)
  const { vout } = response.data
  const spentTx = vout.find(({ spent }) => spent)
  if (spentTx) return { voutHash: spentTx.spentTxId }
  return { owner: vout[0].scriptpubkey_address }
}
