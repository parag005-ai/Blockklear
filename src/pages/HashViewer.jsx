import React, { useState, useEffect } from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { getKYCHash, verifyKYCHash } from '../utils/blockchain'
import { Hash, Search, Shield, ExternalLink, Copy, CheckCircle, XCircle } from 'lucide-react'

const HashViewer = () => {
  const { account, provider, isConnected } = useWeb3()
  const [searchAddress, setSearchAddress] = useState('')
  const [hashResult, setHashResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [verificationHash, setVerificationHash] = useState('')
  const [verificationResult, setVerificationResult] = useState(null)

  useEffect(() => {
    if (account) {
      setSearchAddress(account)
      lookupHash(account)
    }
  }, [account])

  const lookupHash = async (address) => {
    if (!address || !provider) return

    setIsLoading(true)
    setError(null)
    setHashResult(null)

    try {
      const hash = await getKYCHash(provider, address)
      
      if (hash && hash !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
        setHashResult({
          address: address,
          hash: hash,
          hasKYC: true,
          retrievedAt: new Date().toISOString()
        })
      } else {
        setHashResult({
          address: address,
          hash: null,
          hasKYC: false,
          retrievedAt: new Date().toISOString()
        })
      }
    } catch (err) {
      console.error('Error looking up hash:', err)
      setError(`Failed to lookup hash: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyHash = async () => {
    if (!verificationHash || !searchAddress || !provider) return

    setIsLoading(true)
    setVerificationResult(null)

    try {
      const isValid = await verifyKYCHash(provider, searchAddress, verificationHash)
      setVerificationResult({
        isValid,
        hash: verificationHash,
        address: searchAddress,
        verifiedAt: new Date().toISOString()
      })
    } catch (err) {
      console.error('Error verifying hash:', err)
      setError(`Failed to verify hash: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const formatHash = (hash) => {
    if (!hash) return 'No hash found'
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 10)}`
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
            <Hash className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Hash Viewer</h1>
          <p className="text-gray-600">
            Look up and verify KYC hashes stored on the blockchain
          </p>
        </div>

        {/* Search Section */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🔍 Lookup KYC Hash</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Address
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={searchAddress}
                  onChange={(e) => setSearchAddress(e.target.value)}
                  placeholder="0x1234567890abcdef..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => lookupHash(searchAddress)}
                  disabled={!searchAddress || isLoading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <Search className="h-4 w-4" />
                  <span>{isLoading ? 'Searching...' : 'Lookup'}</span>
                </button>
              </div>
            </div>

            {isConnected && (
              <button
                onClick={() => {
                  setSearchAddress(account)
                  lookupHash(account)
                }}
                className="btn-secondary flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Lookup My KYC</span>
              </button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-2 text-red-800">
              <XCircle className="h-5 w-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}

        {hashResult && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Hash Lookup Results</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Address:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-sm bg-white px-2 py-1 rounded border break-all">
                        {hashResult.address}
                      </code>
                      <button
                        onClick={() => copyToClipboard(hashResult.address)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-700">KYC Status:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      {hashResult.hasKYC ? (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1 text-red-600">
                          <XCircle className="h-4 w-4" />
                          <span className="text-sm font-medium">Not Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {hashResult.hasKYC && hashResult.hash && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-700">Stored Hash:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <code className="text-sm bg-white px-2 py-1 rounded border break-all flex-1">
                        {hashResult.hash}
                      </code>
                      <button
                        onClick={() => copyToClipboard(hashResult.hash)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hash Verification Section */}
        {hashResult?.hasKYC && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔐 Verify Hash</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hash to Verify
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={verificationHash}
                    onChange={(e) => setVerificationHash(e.target.value)}
                    placeholder="Enter hash to verify against stored hash..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={verifyHash}
                    disabled={!verificationHash || isLoading}
                    className="btn-primary disabled:opacity-50"
                  >
                    Verify
                  </button>
                </div>
              </div>

              {verificationResult && (
                <div className={`p-4 rounded-lg border ${
                  verificationResult.isValid 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {verificationResult.isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      verificationResult.isValid ? 'text-green-900' : 'text-red-900'
                    }`}>
                      {verificationResult.isValid ? 'Hash Verified!' : 'Hash Mismatch'}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${
                    verificationResult.isValid ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {verificationResult.isValid 
                      ? 'The provided hash matches the stored KYC hash on the blockchain.'
                      : 'The provided hash does not match the stored KYC hash.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* How to Use Section */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 How to Use</h3>
          
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium text-gray-900">1. Lookup KYC Hash:</h4>
              <p>Enter any wallet address to check if they have completed KYC verification and view their stored hash.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">2. Verify Hash:</h4>
              <p>If someone claims to have a specific KYC hash, you can verify it against what's actually stored on the blockchain.</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">3. Privacy & Security:</h4>
              <p>Hashes are cryptographic representations of KYC data. They prove verification without revealing personal information.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HashViewer
