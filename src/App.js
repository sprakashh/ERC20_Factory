import React, { useEffect, useState } from 'react'
import web3 from './web3'
import { default as Web3Modal } from 'web3modal';
import Web3 from 'web3'
import tokenmint from './tokenmint'
import {ethers} from 'ethers'




function App() {
  const [tokenNames, setTokenNames] = useState([])
  const [tokenAddresses, setTokenAddresses] = useState([])
  const [balances, setBalances] = useState([])
  const [transferAddress, setTransferAddress] = useState('')
  const [transferAmount, setTransferAmount] = useState('')
  const [isConnected, setIsConnected] = useState(false)
const providerOptions = {
  options:{
    appName: 'web3 modal',
    infuraId:{5: 'https://goerli.infura.io/v3/e6036dd68c574490a5767904888d6419'}
  }
}

  const connectToMetamask = async () => {
    try{
      let web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
      })
      const web3ModalInstance = await web3Modal.connect();
      const web3ModalProvider =  new ethers.providers.Web3Provider(web3ModalInstance);
      console.log(web3ModalProvider);
      setIsConnected(true)
    }catch(err){
      console.log(err);
    }
   
    }

  async function getDetails() {
    const acc = await web3.eth.getAccounts()
    const tokenAdd = await tokenmint.methods.getTokenAddresses().call()
    setTokenAddresses(tokenAdd)
    const tokennames = await tokenmint.methods.getTokenNames().call()
    setTokenNames(tokennames)
    const balancePromises = tokennames.map(async (token, index) => {
      return await tokenmint.methods.balanceOf(token, acc[0]).call()
    })

    Promise.all(balancePromises).then((bals) => {
      setBalances(bals)
    })
  }

  async function TransferTokens(index) {
    const acc = await web3.eth.getAccounts()
    const tokenAddress = tokenAddresses[index]
    const balance = balances[index]
    await tokenmint.methods
      .transfer(tokenNames[index], transferAddress, transferAmount)
      .send({ from: acc[0] })
      setTransferAddress('')
setTransferAmount('')
  }

  useEffect(() => {
    getDetails()
  }, [balances])



  return (
    <div className="App">
      <div
        style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}
      >
        {isConnected ? (
          <p style={{ color: 'green' }}>Connected to Metamask</p>
        ) : (
          <button
            onClick={connectToMetamask}
            style={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '5px 10px',
            }}
          >
            Connect to Metamask
          </button>
        )}
      </div>
      {tokenNames.map((tokenName, index) => (
        <div
          key={tokenName}
          style={{
            width: '50%',
            backgroundColor: '#eee',
            borderRadius: '5px',
            boxShadow: '0 2px 3px #ccc',
            padding: '20px',
            marginTop: '20px',
          }}
        >
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Token Name: {tokenName}
          </p>
          <p style={{ fontSize: '18px' }}>Balance: {balances[index]}</p>
          <input
            style={{
              width: '90%',
              padding: '10px',
              marginTop: '10px',
              borderRadius: '5px',
            }}
            type="text"
            placeholder="Transfer address"
            onChange={(e) => setTransferAddress(e.target.value)}
          />
          <input
            style={{
              width: '90%',
              padding: '10px',
              marginTop: '10px',
              borderRadius: '5px',
            }}
            type="text"
            placeholder="Transfer amount"
            onChange={(e) => setTransferAmount(e.target.value)}
          />
          <button
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              backgroundColor: '#333',
              color: '#fff',
              borderRadius: '5px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={() => TransferTokens(index)}
          >
            transfer
          </button>
        </div>
      ))}
    </div>
  )
}

export default App
