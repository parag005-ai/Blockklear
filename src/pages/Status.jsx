import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Download, ExternalLink, Copy, QrCode, Shield, Clock } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import QRCode from 'qrcode'

const Status = () => {
  const { isConnected, account } = useWeb3()
  const [kycStatus, setKycStatus] = useState('not_started')
  const [lastUpdate, setLastUpdate] = useState(null)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [txHash, setTxHash] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isConnected && account) {
      const savedStatus = localStorage.getItem(`kyc_status_${account}`)
      const savedUpdate = localStorage.getItem(`kyc_last_update_${account}`)
      
      if (savedStatus) {
        setKycStatus(savedStatus)
        setLastUpdate(savedUpdate)
        
        // Generate mock transaction hash for demo
        if (savedStatus === 'completed') {
          const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`
          setTxHash(mockTxHash)
          generateQRCode(mockTxHash)
        }
      }
    }
  }, [isConnected, account])

  const generateQRCode = async (hash) => {
    try {
      const verificationUrl = `https://mumbai.polygonscan.com/tx/${hash}`
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      })
      setQrCodeUrl(qrDataUrl)
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.download = `blockklear-kyc-verification-${account?.slice(0, 8)}.png`
      link.href = qrCodeUrl
      link.click()
    }
  }

  const formatAddress = (address) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatTxHash = (hash) => {
    if (!hash) return ''
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="card max-w-md mx-auto">
          <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Connect Wallet to View Status
          </h2>
          <p className="text-gray-600 mb-6">
            Please connect your MetaMask wallet to view your KYC verification status.
          </p>
          <Link to="/" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (kycStatus === 'not_started') {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="card max-w-md mx-auto">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No KYC Verification Found
          </h2>
          <p className="text-gray-600 mb-6">
            You haven't started the KYC verification process yet.
          </p>
          <Link to="/kyc" className="btn-primary">
            Start KYC Verification
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          KYC Verification Status
        </h1>
        <p className="text-gray-600">
          View your blockchain-verified identity status
        </p>
      </div>

      {/* Status Overview */}
      <div className="card bg-green-50 border-green-200 border-2">
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-green-900 mb-1">
              ✅ KYC Verification Completed
            </h2>
            <p className="text-green-700">
              Your identity has been successfully verified and stored on the blockchain.
            </p>
            {lastUpdate && (
              <p className="text-sm text-green-600 mt-2">
                Completed on: {new Date(lastUpdate).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Verification Details */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Verification Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Wallet Address</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {formatAddress(account)}
                </code>
                <button
                  onClick={() => copyToClipboard(account)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Copy full address"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Transaction Hash</label>
              <div className="flex items-center space-x-2 mt-1">
                <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {formatTxHash(txHash)}
                </code>
                <button
                  onClick={() => copyToClipboard(txHash)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Copy transaction hash"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Network</label>
              <p className="text-sm text-gray-600 mt-1">Sepolia ETH Testnet</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Verification Status</label>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <a
              href={`https://mumbai.polygonscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-2 w-full justify-center"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on Blockchain Explorer</span>
            </a>
          </div>
        </div>

        {/* QR Code */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Verification QR Code
          </h3>
          
          {qrCodeUrl ? (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg border inline-block">
                <img
                  src={qrCodeUrl}
                  alt="KYC Verification QR Code"
                  className="w-48 h-48"
                />
              </div>
              
              <p className="text-sm text-gray-600">
                Scan this QR code to verify your KYC status on the blockchain
              </p>
              
              <button
                onClick={downloadQRCode}
                className="btn-secondary flex items-center space-x-2 mx-auto"
              >
                <Download className="h-4 w-4" />
                <span>Download QR Code</span>
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Generating QR code...</p>
            </div>
          )}
        </div>
      </div>

      {/* Copy notification */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Copied to clipboard!
        </div>
      )}
    </div>
  )
}

export default Status
