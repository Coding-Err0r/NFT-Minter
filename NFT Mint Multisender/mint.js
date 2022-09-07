const fs = require('fs')
const ethers = require('ethers')
const csv = require('csv-parser')

const csvData = []
const TESTNET_ENDPOINT = "https://data-seed-prebsc-1-s1.binance.org:8545/"
const MAINNET_ENDPOINT = "https://bsc-dataseed2.ninicoin.io/"

const privateKey = fs.readFileSync("secret.txt").toString().trim()
const provider = new ethers.providers.JsonRpcProvider(MAINNET_ENDPOINT)
const signer = new ethers.Wallet(privateKey, provider)

const contractAddress = "0xFE209Da8d1e617C501F40853e3BfCB069b863174"
const abi = fs.readFileSync("./abi.json").toString()
const contractOBJ = new ethers.Contract(contractAddress, abi, signer)

const main = async () => {
  try {
    const fromAddress = await signer.getAddress()
    for (const { address, tokenID } of csvData) {
      let Tx = await contractOBJ["safeTransferFrom(address,address,uint256)"](fromAddress, address, tokenID)
      await Tx.wait()
      console.log(`Done - ${Tx.hash}`)
    }
  } catch (err) {
    console.log(err)
  }
}

fs.createReadStream('./data.csv')
  .pipe(csv())
  .on('data', (data) => csvData.push(data))
  .on('end', main);
