import React, { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, Download, ExternalLink } from 'lucide-react'

const MetaMaskStatus = () => {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
  const [isMetaMaskConnected, setIsMetaMaskConnected] = useState(false)
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    checkMetaMaskStatus()
  }, [])

  const checkMetaMaskStatus = async () => {
    if (typeof window.ethereum !== 'undefined') {
      setIsMetaMaskInstalled(true)
      
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' })
        setAccounts(accounts)
        setIsMetaMaskConnected(accounts.length > 0)
      } catch (error) {
        console.error('Error checking MetaMask accounts:', error)
      }
    } else {
      setIsMetaMaskInstalled(false)
    }
  }

  if (!isMetaMaskInstalled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800 mb-1">
              MetaMask Not Detected
            </h3>
            <p className="text-sm text-red-700 mb-3">
              MetaMask is required to use this application. Please install MetaMask to continue.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Install MetaMask</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <button
                onClick={checkMetaMaskStatus}
                className="text-sm text-red-600 hover:text-red-800 underline"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-green-800 mb-1">
            MetaMask Detected
          </h3>
          <p className="text-sm text-green-700">
            {isMetaMaskConnected 
              ? `Connected with ${accounts.length} account(s)`
              : 'MetaMask is installed but not connected. Click "Connect Wallet" to continue.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default MetaMaskStatus
