import React, { createContext, useContext, useState, useEffect } from 'react'
import { ethers } from 'ethers'

const Web3Context = createContext()

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState(null)
  const [error, setError] = useState(null)

  // Check if wallet is already connected
  useEffect(() => {
    checkConnection()
    setupEventListeners()

    return () => {
      removeEventListeners()
    }
  }, [])

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })

        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const network = await provider.getNetwork()

          setProvider(provider)
          setSigner(signer)
          setAccount(accounts[0])
          setChainId(Number(network.chainId))
          setError(null)
        }
      } catch (error) {
        console.error('Error checking connection:', error)
        setError(error.message)
      }
    }
  }

  const setupEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
      window.ethereum.on('disconnect', handleDisconnect)
    }
  }

  const removeEventListeners = () => {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
      window.ethereum.removeListener('disconnect', handleDisconnect)
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to continue.')
      return false
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

      if (accounts.length === 0) {
        throw new Error('No accounts found. Please check your MetaMask.')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const network = await provider.getNetwork()

      setProvider(provider)
      setSigner(signer)
      setAccount(address)
      setChainId(Number(network.chainId))

      console.log('Wallet connected successfully:', {
        address,
        chainId: Number(network.chainId),
        network: network.name
      })

      return true

    } catch (error) {
      console.error('Error connecting wallet:', error)

      if (error.code === 4001) {
        setError('Connection rejected. Please approve the connection in MetaMask.')
      } else if (error.code === -32002) {
        setError('Connection request pending. Please check MetaMask.')
      } else {
        setError(`Failed to connect wallet: ${error.message}`)
      }

      return false
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setChainId(null)
    setError(null)

    console.log('Wallet disconnected')
  }

  const handleAccountsChanged = (accounts) => {
    console.log('Accounts changed:', accounts)
    if (accounts.length === 0) {
      disconnectWallet()
    } else {
      setAccount(accounts[0])
      // Refresh provider and signer with new account
      if (window.ethereum) {
        checkConnection()
      }
    }
  }

  const handleChainChanged = (chainId) => {
    console.log('Chain changed:', chainId)
    setChainId(parseInt(chainId, 16))
    // Refresh the connection to get updated network info
    if (account) {
      checkConnection()
    }
  }

  const handleDisconnect = () => {
    console.log('Wallet disconnected')
    disconnectWallet()
  }

  const switchToTestnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia testnet (11155111)
      })
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0xaa36a7',
            chainName: 'Sepolia Testnet',
            nativeCurrency: {
              name: 'SepoliaETH',
              symbol: 'SepoliaETH',
              decimals: 18,
            },
            rpcUrls: [import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'],
            blockExplorerUrls: ['https://sepolia.etherscan.io/'],
          }],
        })
      }
    }
  }

  const isCorrectNetwork = () => {
    return chainId === 11155111 // Sepolia testnet
  }

  const getNetworkName = () => {
    switch (chainId) {
      case 11155111:
        return 'Sepolia Testnet'
      case 80002:
        return 'Polygon Amoy'
      case 80001:
        return 'Polygon Mumbai'
      case 1:
        return 'Ethereum Mainnet'
      default:
        return `Unknown Network (${chainId})`
    }
  }

  const value = {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    switchToTestnet,
    getNetworkName,
    isCorrectNetwork,
    isConnected: !!account,
  }

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  )
}




