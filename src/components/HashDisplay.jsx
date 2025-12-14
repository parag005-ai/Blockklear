import React, { useState } from 'react'
import { Copy, Eye, EyeOff, ExternalLink, Hash, Shield, CheckCircle } from 'lucide-react'

const HashDisplay = ({ hashData, blockchainResult, kycData }) => {
  const [showFullHash, setShowFullHash] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const formatHash = (hash) => {
    if (!hash) return 'Not generated'
    if (showFullHash) return hash
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`
  }

  const getExplorerUrl = (txHash, network = 'sepolia') => {
    const explorers = {
      'sepolia': `https://sepolia.etherscan.io/tx/${txHash}`,
      'polygon-amoy': `https://amoy.polygonscan.com/tx/${txHash}`,
      'polygon-mumbai': `https://mumbai.polygonscan.com/tx/${txHash}`,
      'ethereum-goerli': `https://goerli.etherscan.io/tx/${txHash}`,
      'polygon-mainnet': `https://polygonscan.com/tx/${txHash}`,
      'ethereum-mainnet': `https://etherscan.io/tx/${txHash}`
    }
    return explorers[network] || explorers['sepolia']
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <div className="bg-blue-100 p-2 rounded-full">
          <Hash className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">KYC Hash & Blockchain Data</h3>
      </div>

      {/* Hash Generation Section */}
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600" />
            <span>Generated KYC Hash</span>
          </h4>
          
          <div className="bg-white p-4 rounded border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">SHA-256 Hash:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFullHash(!showFullHash)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                >
                  {showFullHash ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span>{showFullHash ? 'Hide' : 'Show'} Full</span>
                </button>
                <button
                  onClick={() => copyToClipboard(hashData?.hash || '')}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
            
            <div className="font-mono text-sm bg-gray-100 p-3 rounded break-all">
              {formatHash(hashData?.hash)}
            </div>
          </div>

          {/* Hash Components */}
          {kycData && (
            <div className="mt-4">
              <details className="bg-blue-50 rounded p-3">
                <summary className="cursor-pointer font-medium text-blue-900">
                  📋 Data Used for Hash Generation (Click to expand)
                </summary>
                <div className="mt-3 text-sm space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Document Type:</span>
                      <p className="text-gray-600">{kycData.documentType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Full Name:</span>
                      <p className="text-gray-600">{kycData.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Document Number:</span>
                      <p className="text-gray-600">{kycData.documentNumber ? '***' + kycData.documentNumber.slice(-4) : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Face Verified:</span>
                      <p className="text-gray-600">{kycData.faceVerified ? '✅ Yes' : '❌ No'}</p>
                    </div>
                    <div>
                      <span className="font-medium">Timestamp:</span>
                      <p className="text-gray-600">{new Date(kycData.timestamp).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium">OCR Confidence:</span>
                      <p className="text-gray-600">{kycData.ocrConfidence}%</p>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>

        {/* Blockchain Storage Section */}
        {blockchainResult && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Blockchain Storage Confirmed</span>
            </h4>
            
            <div className="space-y-3">
              <div className="bg-white p-4 rounded border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Transaction Hash:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs break-all">
                        {blockchainResult.txHash}
                      </code>
                      <button
                        onClick={() => copyToClipboard(blockchainResult.txHash)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Block Number:</span>
                    <p className="text-gray-600 mt-1">{blockchainResult.blockNumber}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Gas Used:</span>
                    <p className="text-gray-600 mt-1">{blockchainResult.gasUsed}</p>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Network:</span>
                    <p className="text-gray-600 mt-1">Sepolia ETH Testnet</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <a
                    href={getExplorerUrl(blockchainResult.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View on Etherscan</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* How to Access Hash */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-3">🔍 How to Access Your Hash</h4>
          <div className="text-sm text-blue-800 space-y-2">
            <p><strong>1. From Smart Contract:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Contract Address: <code className="bg-white px-1 rounded">0x1234...5678</code> (Polygon Mumbai)</li>
              <li>Function: <code className="bg-white px-1 rounded">getKYCHash(address)</code></li>
              <li>Your Address: <code className="bg-white px-1 rounded">{blockchainResult?.userAddress || 'Connect wallet'}</code></li>
            </ul>
            
            <p className="mt-3"><strong>2. From Transaction:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Transaction Hash: <code className="bg-white px-1 rounded">{blockchainResult?.txHash || 'Not available'}</code></li>
              <li>Block Explorer: Polygon Mumbai Scanner</li>
              <li>Event Logs: Look for "KYCStored" event</li>
            </ul>
            
            <p className="mt-3"><strong>3. Verification:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Anyone can verify your KYC status using your wallet address</li>
              <li>Hash proves identity without revealing personal data</li>
              <li>Immutable and tamper-proof on blockchain</li>
            </ul>
          </div>
        </div>

        {/* Download Options */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const data = {
                hash: hashData?.hash,
                txHash: blockchainResult?.txHash,
                blockNumber: blockchainResult?.blockNumber,
                timestamp: new Date().toISOString(),
                network: 'Polygon Mumbai Testnet'
              }
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'kyc-hash-data.json'
              a.click()
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <Hash className="h-4 w-4" />
            <span>Download Hash Data</span>
          </button>
          
          {blockchainResult?.txHash && (
            <a
              href={getExplorerUrl(blockchainResult.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View on Blockchain</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default HashDisplay
