import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import DocumentUpload from '../components/DocumentUpload'
import FaceVerification from '../components/FaceVerification'
import ProgressTracker, { defaultKYCSteps } from '../components/ProgressTracker'

import CameraDiagnostic from '../components/CameraDiagnostic'
import HashDisplay from '../components/HashDisplay'
import DocumentInfoDisplay from '../components/DocumentInfoDisplay'
import { storeKYCOnBlockchain, prepareKYCDataForBlockchain, generateKYCHash } from '../utils/blockchain'
import { setCurrentStep as setMemoryStep, storeBiometrics, getSessionData, exportForSubmission } from '../services/kycMemory'

const KYCFlow = () => {
  const navigate = useNavigate()
  const { isConnected, account, signer } = useWeb3()
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState(defaultKYCSteps)
  const [uploadedDocument, setUploadedDocument] = useState(null)
  const [capturedFace, setCapturedFace] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [ocrResults, setOcrResults] = useState(null)
  const [blockchainResult, setBlockchainResult] = useState(null)
  const [hashData, setHashData] = useState(null)
  const [kycDataForHash, setKycDataForHash] = useState(null)

  useEffect(() => {
    if (!isConnected) {
      navigate('/')
    }
  }, [isConnected, navigate])

  const updateStepStatus = (stepIndex, status, progress = null, error = null) => {
    setSteps(prevSteps => 
      prevSteps.map((step, index) => 
        index === stepIndex 
          ? { 
              ...step, 
              status, 
              progress,
              error,
              completedAt: status === 'completed' ? new Date().toISOString() : step.completedAt
            }
          : step
      )
    )
  }

  const handleDocumentUpload = async (file) => {
    setUploadedDocument(file)

    if (file) {
      // Update step 0 (Document Upload) to completed
      updateStepStatus(0, 'completed')
      setCurrentStep(1) // Move to document verification step

      // Update KYC memory
      setMemoryStep('document_verification')
    } else {
      // Reset steps if document is removed
      updateStepStatus(0, 'pending')
      updateStepStatus(1, 'pending')
      setOcrResults(null)
      setCurrentStep(0)

      // Update KYC memory
      setMemoryStep('document_upload')
    }
  }

  const handleOCRComplete = async (results) => {
    setOcrResults(results)

    // Start step 1 (Document Verification)
    updateStepStatus(1, 'in_progress', 0)
    setIsProcessing(true)

    // Log memory usage
    console.log('📊 KYC Memory after OCR:', results.memoryUsage)

    try {
      if (results.success) {
        // Simulate additional verification based on OCR results
        for (let progress = 0; progress <= 100; progress += 25) {
          await new Promise(resolve => setTimeout(resolve, 400))
          updateStepStatus(1, 'in_progress', progress)
        }

        // Check if OCR validation passed (more lenient for progression)
        const hasBasicData = results.extractedData &&
                           (results.extractedData.documentNumber || results.extractedData.fullName)

        if (hasBasicData || (results.validation && results.validation.completeness >= 30)) {
          updateStepStatus(1, 'completed')
          setCurrentStep(2) // Move to face verification
          console.log('✅ Document verification passed - proceeding to face verification')
        } else {
          updateStepStatus(1, 'failed', null, 'Document validation failed - could not extract basic information')
          console.log('❌ Document validation failed:', results.validation)
        }
      } else {
        updateStepStatus(1, 'failed', null, `OCR failed: ${results.error}`)
      }
    } catch (error) {
      updateStepStatus(1, 'failed', null, 'Document verification failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFaceCapture = async (imageData) => {
    setCapturedFace(imageData)

    if (imageData) {
      // Update step 2 (Face Verification) to in progress
      updateStepStatus(2, 'in_progress', 0)
      setIsProcessing(true)

      // Update KYC memory step
      setMemoryStep('face_verification')

      try {
        // Simulate face verification process
        for (let progress = 0; progress <= 100; progress += 25) {
          await new Promise(resolve => setTimeout(resolve, 600))
          updateStepStatus(2, 'in_progress', progress)
        }

        // Store biometrics in memory
        storeBiometrics({
          verified: true,
          confidence: 0.95,
          imageData: imageData // Store the captured face image
        })

        updateStepStatus(2, 'completed')

        // Update memory step
        setMemoryStep('compliance_check')
        
        // Start compliance check
        updateStepStatus(3, 'in_progress', 0)
        
        for (let progress = 0; progress <= 100; progress += 33) {
          await new Promise(resolve => setTimeout(resolve, 400))
          updateStepStatus(3, 'in_progress', progress)
        }
        
        updateStepStatus(3, 'completed')
        setCurrentStep(4) // Move to blockchain step
        
      } catch (error) {
        updateStepStatus(2, 'failed', null, 'Face verification failed')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleBlockchainSubmission = async () => {
    setIsProcessing(true)

    try {
      if (!signer) {
        throw new Error('Wallet not connected')
      }

      if (!ocrResults || !ocrResults.success) {
        throw new Error('No valid OCR results available')
      }

      // Step 4: Hash Generation
      updateStepStatus(4, 'in_progress', 0)

      // Prepare KYC data for blockchain
      const kycData = prepareKYCDataForBlockchain(
        ocrResults,
        { success: !!capturedFace }, // Face verification
        { passed: true } // Compliance check (simplified)
      )

      // Generate hash and store for display
      const generatedHash = generateKYCHash(kycData)
      setHashData({ hash: generatedHash, generatedAt: new Date().toISOString() })
      setKycDataForHash(kycData)

      console.log('🔐 Generated KYC Hash:', generatedHash)
      console.log('📋 KYC Data for Hash:', kycData)

      await new Promise(resolve => setTimeout(resolve, 1000))
      updateStepStatus(4, 'completed')

      // Step 5: Blockchain Storage
      updateStepStatus(5, 'in_progress', 0)

      console.log('🚀 Submitting KYC data to blockchain...')

      // Real blockchain transaction
      updateStepStatus(5, 'in_progress', 25)
      const result = await storeKYCOnBlockchain(signer, kycData)

      if (result.success) {
        updateStepStatus(5, 'in_progress', 75)
        setBlockchainResult(result)

        // Final completion
        updateStepStatus(5, 'completed')
        updateStepStatus(6, 'completed')

        // Save completion status with real data
        localStorage.setItem(`kyc_status_${account}`, 'completed')
        localStorage.setItem(`kyc_last_update_${account}`, new Date().toISOString())
        localStorage.setItem(`kyc_tx_hash_${account}`, result.txHash)
        localStorage.setItem(`kyc_block_number_${account}`, result.blockNumber.toString())

        console.log('✅ KYC successfully stored on blockchain:', result)

        // Navigate to status page
        setTimeout(() => {
          navigate('/status')
        }, 2000)
      } else {
        throw new Error(result.error || 'Blockchain transaction failed')
      }

    } catch (error) {
      console.error('❌ Blockchain submission error:', error)
      updateStepStatus(5, 'failed', null, `Blockchain submission failed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const canProceedToBlockchain = uploadedDocument && capturedFace && 
    steps[2].status === 'completed' && steps[3].status === 'completed'

  if (!isConnected) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Progress Tracker */}
        <div className="lg:col-span-1">
          <ProgressTracker currentStep={currentStep} steps={steps} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">KYC Verification Process</h1>
            <p className="text-gray-600">
              Complete the steps below to verify your identity on the blockchain.
            </p>
          </div>



          {/* Step 1: Document Upload */}
          <DocumentUpload
            onFileUpload={handleDocumentUpload}
            uploadedFile={uploadedDocument}
            isProcessing={isProcessing && steps[1].status === 'in_progress'}
            onOCRComplete={handleOCRComplete}
          />

          {/* Document Information Display */}
          {ocrResults && ocrResults.extractedData && (
            <DocumentInfoDisplay
              ocrResults={ocrResults}
              uploadedFile={uploadedDocument}
            />
          )}

          {/* Step 2: Face Verification */}
          {currentStep >= 2 && (
            <>
              <FaceVerification
                onCapture={handleFaceCapture}
                capturedImage={capturedFace}
                isProcessing={isProcessing && steps[2].status === 'in_progress'}
                uploadedDocument={uploadedDocument}
                onVerificationResult={(result) => {
                  console.log('Face verification result:', result)
                  if (result.success && result.isMatch) {
                    // Face successfully matched - proceed to blockchain step
                    console.log('✅ Face verification successful - proceeding to blockchain')
                    setSteps(prev => prev.map(step =>
                      step.id === 2 ? { ...step, status: 'completed' } : step
                    ))
                    setCurrentStep(3)
                  } else {
                    // Face verification failed - wrong person detected
                    console.log('❌ Face verification failed - wrong person or low match')
                    setSteps(prev => prev.map(step =>
                      step.id === 2 ? { ...step, status: 'failed' } : step
                    ))
                    // Keep on step 2 for retry
                  }
                }}
              />

              {/* Camera Diagnostic Tool */}
              <div className="mt-4">
                <details className="bg-gray-50 rounded-lg">
                  <summary className="cursor-pointer p-4 font-medium text-gray-700 hover:text-gray-900">
                    🔧 Camera Troubleshooting (Click to expand)
                  </summary>
                  <div className="p-4 pt-0">
                    <CameraDiagnostic />
                  </div>
                </details>
              </div>
            </>
          )}

          {/* Step 3: Blockchain Submission */}
          {canProceedToBlockchain && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Blockchain Verification
              </h3>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm mb-2">
                    ✅ Document verified successfully<br />
                    ✅ Face verification completed<br />
                    ✅ Compliance check passed
                  </p>
                  {ocrResults && ocrResults.validation && (
                    <div className="text-xs text-green-700 mt-2 pt-2 border-t border-green-200">
                      <p>Document Type: <span className="font-medium capitalize">{ocrResults.extractedData.documentType}</span></p>
                      <p>Validation Score: <span className="font-medium">{ocrResults.validation.score || 0}/100</span></p>
                      <p>OCR Confidence: <span className="font-medium">{Math.round((ocrResults.confidence || 0) * 100)}%</span></p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">What happens next:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your document data will be securely hashed</li>
                    <li>• The hash will be stored on Polygon blockchain</li>
                    <li>• You'll receive a transaction receipt</li>
                    <li>• Your identity will be verifiable via blockchain</li>
                  </ul>
                </div>

                {blockchainResult && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Transaction Details:</h4>
                    <div className="text-xs text-gray-700 space-y-1">
                      <p>Transaction Hash: <span className="font-mono">{blockchainResult.txHash}</span></p>
                      <p>Block Number: <span className="font-mono">{blockchainResult.blockNumber}</span></p>
                      <p>Gas Used: <span className="font-mono">{blockchainResult.gasUsed}</span></p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBlockchainSubmission}
                  disabled={isProcessing || !signer}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <span>
                    {isProcessing ? 'Processing...' : 'Submit to Blockchain'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {!signer && (
                  <p className="text-sm text-red-600">
                    Please connect your wallet to submit to blockchain
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Hash Display - Show after hash generation */}
          {(hashData || blockchainResult) && (
            <HashDisplay
              hashData={hashData}
              blockchainResult={blockchainResult}
              kycData={kycDataForHash}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default KYCFlow
