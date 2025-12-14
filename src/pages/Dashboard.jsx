import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Shield, CheckCircle, Clock, AlertCircle, ArrowRight, Wallet, Camera } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import MetaMaskStatus from '../components/MetaMaskStatus'
import SimpleCameraTest from '../components/SimpleCameraTest'

const Dashboard = () => {
  const { isConnected, account } = useWeb3()
  const [kycStatus, setKycStatus] = useState('not_started') // not_started, in_progress, completed, failed
  const [lastUpdate, setLastUpdate] = useState(null)

  // Mock KYC status - in real app this would come from backend
  useEffect(() => {
    if (isConnected) {
      // Simulate checking KYC status from localStorage or backend
      const savedStatus = localStorage.getItem(`kyc_status_${account}`)
      if (savedStatus) {
        setKycStatus(savedStatus)
        setLastUpdate(localStorage.getItem(`kyc_last_update_${account}`))
      }
    }
  }, [isConnected, account])

  const getStatusInfo = () => {
    switch (kycStatus) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          title: 'KYC Verified',
          description: 'Your identity has been successfully verified and stored on blockchain.',
          action: 'View Details',
          actionLink: '/status'
        }
      case 'in_progress':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          title: 'KYC In Progress',
          description: 'Your KYC verification is currently being processed.',
          action: 'Continue Process',
          actionLink: '/kyc'
        }
      case 'failed':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          title: 'KYC Failed',
          description: 'Your KYC verification was unsuccessful. Please try again.',
          action: 'Retry KYC',
          actionLink: '/kyc'
        }
      default:
        return {
          icon: Shield,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          title: 'Start KYC Verification',
          description: 'Begin your decentralized identity verification process.',
          action: 'Start KYC',
          actionLink: '/kyc'
        }
    }
  }

  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-200 max-w-md mx-auto">
            <Wallet className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">
              Please connect your MetaMask wallet to access the BlockKlear KYC platform.
            </p>
            <p className="text-sm text-gray-500">
              Your wallet is required to securely store your KYC verification hash on the blockchain.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to BlockKlear
        </h1>
        <p className="text-lg text-gray-600">
          Decentralized, Verifiable, Trustless Identity Verification
        </p>
      </div>

      {/* MetaMask Status */}
      <MetaMaskStatus />

      {/* KYC Status Card */}
      <div className={`card ${statusInfo.bgColor} ${statusInfo.borderColor} border-2`}>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-full ${statusInfo.bgColor}`}>
            <StatusIcon className={`h-8 w-8 ${statusInfo.color}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {statusInfo.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {statusInfo.description}
            </p>
            {lastUpdate && (
              <p className="text-sm text-gray-500 mb-4">
                Last updated: {new Date(lastUpdate).toLocaleString()}
              </p>
            )}
            <Link
              to={statusInfo.actionLink}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>{statusInfo.action}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
          <p className="text-sm text-gray-600">
            Your personal data is processed securely and only a hash is stored on blockchain.
          </p>
        </div>

        <div className="card text-center">
          <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Verifiable</h3>
          <p className="text-sm text-gray-600">
            Your KYC status is publicly verifiable on the blockchain without exposing personal data.
          </p>
        </div>

        <div className="card text-center">
          <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto mb-4">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Fast Process</h3>
          <p className="text-sm text-gray-600">
            Complete your KYC verification in minutes with our streamlined process.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">How It Works</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Upload Documents</h4>
              <p className="text-sm text-gray-600">Upload your government-issued ID for verification</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Face Verification</h4>
              <p className="text-sm text-gray-600">Complete biometric verification using your camera</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Blockchain Storage</h4>
              <p className="text-sm text-gray-600">Your verification hash is stored securely on blockchain</p>
            </div>
          </div>
        </div>
      </div>

      {/* Camera Test Section */}
      <div className="mt-8">
        <details className="bg-gray-50 rounded-lg">
          <summary className="cursor-pointer p-4 font-medium text-gray-700 hover:text-gray-900 flex items-center space-x-2">
            <Camera className="h-5 w-5" />
            <span>🎥 Test Your Camera (Click to expand)</span>
          </summary>
          <div className="p-4 pt-0">
            <SimpleCameraTest />
          </div>
        </details>
      </div>
    </div>
  )
}

export default Dashboard
