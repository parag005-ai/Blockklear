import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Shield, Wallet, LogOut, AlertTriangle, CheckCircle } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'

const Header = () => {
  const {
    account,
    isConnected,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error,
    chainId,
    getNetworkName,
    isCorrectNetwork,
    switchToTestnet
  } = useWeb3()
  const location = useLocation()
  const [showNetworkWarning, setShowNetworkWarning] = useState(false)

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isActive = (path) => location.pathname === path

  const handleConnectWallet = async () => {
    const success = await connectWallet()
    if (success && !isCorrectNetwork()) {
      setShowNetworkWarning(true)
    }
  }

  const handleSwitchNetwork = async () => {
    const success = await switchToTestnet()
    if (success) {
      setShowNetworkWarning(false)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">BlockKlear</h1>
              <p className="text-xs text-gray-500">Decentralized KYC</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/kyc"
              className={`text-sm font-medium transition-colors ${
                isActive('/kyc') 
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Start KYC
            </Link>
            <Link
              to="/status"
              className={`text-sm font-medium transition-colors ${
                isActive('/status')
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Status
            </Link>
            <Link
              to="/hash"
              className={`text-sm font-medium transition-colors ${
                isActive('/hash')
                  ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Hash Viewer
            </Link>
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  isCorrectNetwork()
                    ? 'bg-green-50 text-green-700'
                    : 'bg-yellow-50 text-yellow-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    isCorrectNetwork() ? 'bg-green-500' : 'bg-yellow-500'
                  }`}></div>
                  <span>{formatAddress(account)}</span>
                </div>

                {!isCorrectNetwork() && (
                  <button
                    onClick={handleSwitchNetwork}
                    className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200 transition-colors"
                    title="Switch to Sepolia Testnet"
                  >
                    Switch Network
                  </button>
                )}

                <button
                  onClick={disconnectWallet}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Disconnect Wallet"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="btn-primary flex items-center space-x-2"
              >
                <Wallet className="h-4 w-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-red-600 hover:text-red-800 underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Network Warning */}
      {isConnected && !isCorrectNetwork() && showNetworkWarning && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 text-yellow-700">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                You're connected to {getNetworkName()}. Please switch to Sepolia Testnet for full functionality.
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSwitchNetwork}
                className="text-xs bg-yellow-200 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-300 transition-colors"
              >
                Switch Network
              </button>
              <button
                onClick={() => setShowNetworkWarning(false)}
                className="text-xs text-yellow-600 hover:text-yellow-800"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
