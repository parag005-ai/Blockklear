
import { ethers } from 'ethers'
import CryptoJS from 'crypto-js'

// Contract ABI for KYCHashStore
export const KYC_CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "bytes32", "name": "_hash", "type": "bytes32"}],
    "name": "storeKYC",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "getKYCHash",
    "outputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "_user", "type": "address"}],
    "name": "hasKYC",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "_user", "type": "address"},
      {"internalType": "bytes32", "name": "_hash", "type": "bytes32"}
    ],
    "name": "verifyKYC",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": true, "internalType": "bytes32", "name": "hash", "type": "bytes32"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "KYCStored",
    "type": "event"
  }
]

// Deployed KYC contract address on Sepolia testnet
export const KYC_CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0xFbA3baAd6E36Ff053901Ab2DC6938678221d6d9b"

// Sepolia ETH testnet configuration
export const SEPOLIA_CONFIG = {
  chainId: '0xaa36a7',
  chainName: 'Sepolia Testnet',
  nativeCurrency: {
    name: 'SepoliaETH',
    symbol: 'SepoliaETH',
    decimals: 18,
  },
  rpcUrls: [import.meta.env.VITE_ETHEREUM_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
}

// Polygon Amoy testnet configuration (backup option)
export const POLYGON_AMOY_CONFIG = {
  chainId: '0x13882',
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'POL',
    symbol: 'POL',
    decimals: 18,
  },
  rpcUrls: [import.meta.env.VITE_POLYGON_RPC_URL],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
}

/**
 * Generate SHA-256 hash from KYC data
 * @param {Object} kycData - The KYC data to hash
 * @returns {string} - The SHA-256 hash
 */
export const generateKYCHash = (kycData) => {
  // Create a normalized data object for consistent hashing
  const normalizedData = {
    documentType: kycData.documentType || '',
    documentNumber: kycData.documentNumber || '',
    fullName: kycData.fullName ? kycData.fullName.toUpperCase().trim() : '',
    dateOfBirth: kycData.dateOfBirth || '',
    expiryDate: kycData.expiryDate || '',
    nationality: kycData.nationality || '',
    gender: kycData.gender || '',
    faceVerified: Boolean(kycData.faceVerified),
    complianceCheck: Boolean(kycData.complianceCheck),
    ocrConfidence: kycData.ocrConfidence || 0,
    validationScore: kycData.validationScore || 0,
    timestamp: kycData.timestamp || new Date().toISOString()
  }

  // Sort keys for consistent hashing
  const sortedKeys = Object.keys(normalizedData).sort()
  const sortedData = {}
  sortedKeys.forEach(key => {
    sortedData[key] = normalizedData[key]
  })

  const dataString = JSON.stringify(sortedData)
  console.log('🔐 Generating hash for data:', dataString)

  return CryptoJS.SHA256(dataString).toString()
}

/**
 * Convert string hash to bytes32 format for Solidity
 * @param {string} hashString - The hash string
 * @returns {string} - The bytes32 formatted hash
 */
export const stringToBytes32 = (hashString) => {
  return '0x' + hashString
}

/**
 * Get contract instance
 * @param {ethers.Signer} signer - The ethers signer
 * @returns {ethers.Contract} - The contract instance
 */
export const getKYCContract = (signer) => {
  return new ethers.Contract(KYC_CONTRACT_ADDRESS, KYC_CONTRACT_ABI, signer)
}

/**
 * Store KYC hash on blockchain with enhanced data
 * @param {ethers.Signer} signer - The ethers signer
 * @param {Object} kycData - Complete KYC data object
 * @returns {Promise<Object>} - Transaction result
 */
export const storeKYCOnBlockchain = async (signer, kycData) => {
  try {
    // Generate hash from the complete KYC data
    const hash = generateKYCHash(kycData)
    const contract = getKYCContract(signer)
    const bytes32Hash = stringToBytes32(hash)

    console.log('🔗 Storing KYC data on blockchain:', {
      hash: hash,
      bytes32Hash: bytes32Hash,
      documentType: kycData.documentType,
      hasDocumentNumber: !!kycData.documentNumber,
      hasFullName: !!kycData.fullName,
      ocrConfidence: kycData.ocrConfidence,
      validationScore: kycData.validationScore
    })

    // Estimate gas
    const gasEstimate = await contract.storeKYC.estimateGas(bytes32Hash)

    // Send transaction
    const tx = await contract.storeKYC(bytes32Hash, {
      gasLimit: gasEstimate * 120n / 100n // Add 20% buffer using BigInt
    })

    console.log('📤 Transaction sent:', tx.hash)

    // Wait for confirmation
    const receipt = await tx.wait()
    console.log('✅ Transaction confirmed:', receipt)

    return {
      success: true,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      hash: hash,
      kycData: {
        documentType: kycData.documentType,
        documentNumber: kycData.documentNumber ? '***' + kycData.documentNumber.slice(-4) : '',
        fullName: kycData.fullName ? kycData.fullName.split(' ')[0] + ' ***' : '',
        timestamp: kycData.timestamp
      }
    }
  } catch (error) {
    console.error('❌ Error storing KYC on blockchain:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * Prepare KYC data for blockchain submission
 * @param {Object} ocrResults - OCR results from document processing
 * @param {Object} faceVerification - Face verification results
 * @param {Object} complianceCheck - Compliance check results
 * @returns {Object} - Prepared KYC data
 */
export const prepareKYCDataForBlockchain = (ocrResults, faceVerification = {}, complianceCheck = {}) => {
  const kycData = {
    // Document data from OCR
    documentType: ocrResults.extractedData?.documentType || '',
    documentNumber: ocrResults.extractedData?.documentNumber || '',
    fullName: ocrResults.extractedData?.fullName || '',
    dateOfBirth: ocrResults.extractedData?.dateOfBirth || '',
    expiryDate: ocrResults.extractedData?.expiryDate || '',
    nationality: ocrResults.extractedData?.nationality || '',
    gender: ocrResults.extractedData?.gender || '',

    // Verification results
    faceVerified: faceVerification.success || false,
    complianceCheck: complianceCheck.passed || false,

    // Quality metrics
    ocrConfidence: ocrResults.confidence || 0,
    validationScore: ocrResults.validation?.score || 0,

    // Metadata
    timestamp: new Date().toISOString(),
    processingTime: ocrResults.processingTime || 0
  }

  console.log('📋 Prepared KYC data for blockchain:', {
    ...kycData,
    documentNumber: kycData.documentNumber ? '***' + kycData.documentNumber.slice(-4) : '',
    fullName: kycData.fullName ? kycData.fullName.split(' ')[0] + ' ***' : ''
  })

  return kycData
}

/**
 * Check if user has KYC verification
 * @param {ethers.Provider} provider - The ethers provider
 * @param {string} userAddress - The user's address
 * @returns {Promise<boolean>} - Whether user has KYC
 */
export const checkKYCStatus = async (provider, userAddress) => {
  try {
    const contract = new ethers.Contract(KYC_CONTRACT_ADDRESS, KYC_CONTRACT_ABI, provider)
    return await contract.hasKYC(userAddress)
  } catch (error) {
    console.error('Error checking KYC status:', error)
    return false
  }
}

/**
 * Get KYC hash for user
 * @param {ethers.Provider} provider - The ethers provider
 * @param {string} userAddress - The user's address
 * @returns {Promise<string>} - The KYC hash
 */
export const getKYCHash = async (provider, userAddress) => {
  try {
    const contract = new ethers.Contract(KYC_CONTRACT_ADDRESS, KYC_CONTRACT_ABI, provider)
    const hash = await contract.getKYCHash(userAddress)
    return hash
  } catch (error) {
    console.error('Error getting KYC hash:', error)
    return null
  }
}

/**
 * Verify KYC hash matches stored hash
 * @param {ethers.Provider} provider - The ethers provider
 * @param {string} userAddress - The user's address
 * @param {string} hashToVerify - The hash to verify
 * @returns {Promise<boolean>} - Whether hash matches
 */
export const verifyKYCHash = async (provider, userAddress, hashToVerify) => {
  try {
    const contract = new ethers.Contract(KYC_CONTRACT_ADDRESS, KYC_CONTRACT_ABI, provider)
    const bytes32Hash = stringToBytes32(hashToVerify)
    return await contract.verifyKYC(userAddress, bytes32Hash)
  } catch (error) {
    console.error('Error verifying KYC hash:', error)
    return false
  }
}

/**
 * Switch to Sepolia testnet
 * @returns {Promise<boolean>} - Whether switch was successful
 */
export const switchToSepolia = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: SEPOLIA_CONFIG.chainId }],
    })
    return true
  } catch (switchError) {
    // Chain not added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [SEPOLIA_CONFIG],
        })
        return true
      } catch (addError) {
        console.error('Error adding network:', addError)
        return false
      }
    }
    console.error('Error switching network:', switchError)
    return false
  }
}

/**
 * Switch to Polygon Amoy testnet (backup option)
 * @returns {Promise<boolean>} - Whether switch was successful
 */
export const switchToPolygonAmoy = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask not installed')
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: POLYGON_AMOY_CONFIG.chainId }],
    })
    return true
  } catch (switchError) {
    // Chain not added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [POLYGON_AMOY_CONFIG],
        })
        return true
      } catch (addError) {
        console.error('Error adding network:', addError)
        return false
      }
    }
    console.error('Error switching network:', switchError)
    return false
  }
}


