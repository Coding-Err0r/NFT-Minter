const fs = require('fs')
const ethers = require('ethers')

const TESTNET_ENDPOINT = "https://data-seed-prebsc-1-s1.binance.org:8545/"
const MAINNET_ENDPOINT = "https://bsc-dataseed2.ninicoin.io/"

const privateKey = fs.readFileSync("secret.txt").toString().trim()
const provider = new ethers.providers.JsonRpcProvider(MAINNET_ENDPOINT)
const signer = new ethers.Wallet(privateKey, provider)

const contractAddress = "0xFE209Da8d1e617C501F40853e3BfCB069b863174"
const abi = fs.readFileSync("./abi.json").toString()
const contractOBJ = new ethers.Contract(contractAddress, abi, signer)

async function getNonce(signer) {
  return (await signer).getTransactionCount()
}

const main = async () => {
  try {
    const url = "https://ipfs.io/ipfs/QmSJWTshQe5wTh2eJxogjwz58v1WJGHzRLegAUxZUMqsDX?filename=mintPassMetadata.json"
    const address = await signer.getAddress()
    const mintCount = 2
    for (let i = 1; i <= mintCount; i++) {
      const nonce = await getNonce(signer)
      let nftTx = await contractOBJ.createCollectibleMinter(address, url, {
        nonce: nonce,
        gasLimit: 600000
      })
      await nftTx.wait()
      console.log(`${i} NFT Minted! ${nftTx.hash}`)
    }
  } catch (err) {
    console.log(err)
  }
}

main()
