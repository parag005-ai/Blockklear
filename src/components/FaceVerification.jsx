import React, { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import { Camera, RotateCcw, CheckCircle, AlertCircle, User, Eye, Shield, X } from 'lucide-react'
import { performFaceRecognition } from '../services/deepLearningFaceRecognition'

const FaceVerification = ({ onCapture, capturedImage, isProcessing, uploadedDocument, onVerificationResult }) => {
  const [isWebcamReady, setIsWebcamReady] = useState(false)
  const [hasPermission, setHasPermission] = useState(null)
  const [error, setError] = useState(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState(null)
  const [showCamera, setShowCamera] = useState(false)
  const webcamRef = useRef(null)

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user'
  }

  const handleUserMedia = useCallback(() => {
    setIsWebcamReady(true)
    setHasPermission(true)
    setError(null)
  }, [])

  const handleUserMediaError = useCallback((error) => {
    console.error('Webcam error:', error)
    setHasPermission(false)

    // Provide more specific error messages
    let errorMessage = 'Camera access denied. Please allow camera access to continue.'

    if (error.name === 'NotAllowedError') {
      errorMessage = 'Camera access was denied. Please click the camera icon in your browser address bar and allow camera access.'
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No camera found. Please ensure your device has a camera connected.'
    } else if (error.name === 'NotReadableError') {
      errorMessage = 'Camera is already in use by another application. Please close other apps using the camera.'
    } else if (error.name === 'OverconstrainedError') {
      errorMessage = 'Camera constraints not supported. Please try with a different camera.'
    } else if (error.name === 'SecurityError') {
      errorMessage = 'Camera access blocked due to security restrictions. Please ensure you\'re using HTTPS or localhost.'
    }

    setError(errorMessage)
  }, [])

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc)
      // Start face verification process
      performFaceVerification(imageSrc)
    }
  }, [onCapture])

  const performFaceVerification = async (capturedFaceImage) => {
    if (!uploadedDocument) {
      setError('No document uploaded for comparison')
      return
    }

    setIsVerifying(true)
    setVerificationResult(null)

    try {
      console.log('Starting face verification...')

      // Simulate face matching process (in real implementation, you'd use a face recognition API)
      const matchResult = await simulateFaceMatching(capturedFaceImage, uploadedDocument)

      setVerificationResult(matchResult)

      if (onVerificationResult) {
        onVerificationResult(matchResult)
      }

    } catch (error) {
      console.error('Face verification failed:', error)
      setVerificationResult({
        success: false,
        confidence: 0,
        message: 'Face verification failed due to technical error'
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const simulateFaceMatching = async (faceImage, documentImage) => {
    console.log('🤖 Starting Advanced Deep Learning Face Recognition...')

    try {
      // Use the advanced deep learning service
      const deepLearningResult = await performFaceRecognition(faceImage, documentImage)

      // 80% threshold for successful verification (industry standard)
      const VERIFICATION_THRESHOLD = 80

      console.log(`🎯 Deep Learning Result: ${deepLearningResult.confidence}% confidence`)
      console.log(`📊 Algorithm: ${deepLearningResult.algorithm}`)
      console.log(`🧠 Model: ${deepLearningResult.model}`)

      if (deepLearningResult.confidence >= VERIFICATION_THRESHOLD) {
        // Verification successful - 80% or higher
        return {
          success: true,
          confidence: deepLearningResult.confidence,
          message: `✅ Deep Learning Verification Successful! Match confidence: ${deepLearningResult.confidence}% (Required: ${VERIFICATION_THRESHOLD}%)`,
          isMatch: true,
          deepLearningData: deepLearningResult.analysis,
          threshold: VERIFICATION_THRESHOLD,
          algorithm: deepLearningResult.algorithm,
          model: deepLearningResult.model,
          processingTime: deepLearningResult.processingTime
        }
      } else {
        // Verification failed - below 80%
        return {
          success: false,
          confidence: deepLearningResult.confidence,
          message: `❌ Deep Learning Verification Failed. Match confidence: ${deepLearningResult.confidence}% (Required: ${VERIFICATION_THRESHOLD}%)`,
          isMatch: false,
          deepLearningData: deepLearningResult.analysis,
          threshold: VERIFICATION_THRESHOLD,
          reason: deepLearningResult.confidence < 50 ?
            'Different person detected by neural network analysis' :
            'Insufficient facial similarity for secure verification',
          algorithm: deepLearningResult.algorithm,
          model: deepLearningResult.model,
          processingTime: deepLearningResult.processingTime
        }
      }
    } catch (error) {
      console.error('Deep learning face recognition failed:', error)
      return {
        success: false,
        confidence: 0,
        message: '❌ Deep Learning Face Recognition System Error. Please try again with better lighting and image quality.',
        isMatch: false,
        error: error.message,
        threshold: 80
      }
    }
  }



  const retake = () => {
    onCapture(null)
    setVerificationResult(null)
    setShowCamera(true)
  }

  const openCamera = async () => {
    console.log('Opening camera...')
    setShowCamera(true)
    setError(null)
    setHasPermission(null)

    // Immediately try to request camera access
    try {
      console.log('Requesting camera permission immediately...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      })

      console.log('Camera permission granted!')
      setHasPermission(true)
      setIsWebcamReady(true)

      // Stop the stream immediately - let Webcam component handle it
      stream.getTracks().forEach(track => track.stop())

    } catch (err) {
      console.error('Camera permission failed:', err)
      handleUserMediaError(err)
    }
  }

  const closeCamera = () => {
    setShowCamera(false)
    setIsWebcamReady(false)
  }

  const testCameraAccess = async () => {
    console.log('Testing camera access...')

    // Check if getUserMedia is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera API not supported in this browser. Please use Chrome, Firefox, Safari, or Edge.')
      return
    }

    try {
      console.log('Requesting camera permission...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      })

      console.log('Camera test successful:', stream)
      console.log('Video tracks:', stream.getVideoTracks())

      setHasPermission(true)
      setError(null)

      // Stop the test stream
      stream.getTracks().forEach(track => {
        console.log('Stopping track:', track)
        track.stop()
      })

      // Small delay before reloading
      setTimeout(() => {
        window.location.reload()
      }, 1000)

    } catch (err) {
      console.error('Camera test failed:', err)
      console.error('Error name:', err.name)
      console.error('Error message:', err.message)
      handleUserMediaError(err)
    }
  }

  const requestCameraDirectly = async () => {
    console.log('Direct camera request...')
    setHasPermission(null)
    setError(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      setHasPermission(true)
      setIsWebcamReady(true)
      console.log('Direct camera access successful')
    } catch (err) {
      console.error('Direct camera request failed:', err)
      handleUserMediaError(err)
    }
  }

  if (hasPermission === false || error) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Camera Access Required</h3>
          <p className="text-gray-600 mb-4">
            {error || 'Please allow camera access to complete face verification.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={testCameraAccess}
              className="btn-primary"
            >
              🧪 Test Camera Access
            </button>
            <button
              onClick={requestCameraDirectly}
              className="btn-secondary"
            >
              🎥 Request Camera Directly
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              🔄 Retry Camera Access
            </button>
          </div>

          {/* Browser Info */}
          <div className="mt-4 text-xs text-gray-500 bg-gray-100 p-3 rounded">
            <strong>Browser Info:</strong><br/>
            User Agent: {navigator.userAgent.substring(0, 100)}...<br/>
            HTTPS: {window.location.protocol === 'https:' ? 'Yes' : 'No'}<br/>
            Localhost: {window.location.hostname === 'localhost' ? 'Yes' : 'No'}<br/>
            getUserMedia: {navigator.mediaDevices?.getUserMedia ? 'Available' : 'Not Available'}
          </div>

          {/* Troubleshooting tips */}
          <div className="mt-6 text-left bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Troubleshooting Tips:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Look for a camera icon in your browser's address bar and click "Allow"</li>
              <li>• Make sure no other applications are using your camera</li>
              <li>• Try refreshing the page and allowing camera access when prompted</li>
              <li>• Check if your browser supports camera access (Chrome, Firefox, Safari, Edge)</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  // Initial state - show "Open Camera" button
  if (!showCamera && !capturedImage) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Face Verification Required</h3>
          <p className="text-gray-600 mb-6">
            We need to verify that your face matches the uploaded document.
            This ensures the security and authenticity of your identity verification.
          </p>

          {uploadedDocument && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Document uploaded and ready for comparison</span>
              </div>
            </div>
          )}

          <button
            onClick={openCamera}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Camera className="h-5 w-5" />
            <span>Open Camera for Face Verification</span>
          </button>

          <div className="mt-6 text-left bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">📋 Verification Process:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 📸 We'll capture your photo using your camera</li>
              <li>• 🔍 Compare your face with the photo in your uploaded document</li>
              <li>• ✅ Verify identity match with high confidence</li>
              <li>• 🛡️ Secure your KYC verification on blockchain</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  if (capturedImage) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Face Verification Results</h3>
          {!isProcessing && !isVerifying && (
            <button
              onClick={retake}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake Photo</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Captured Image */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Captured Photo</h4>
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured face"
                className="w-full rounded-lg border-2 border-gray-200"
              />
              {(isProcessing || isVerifying) && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <span className="text-sm font-medium">
                      {isVerifying ? 'Comparing with document...' : 'Processing image...'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Document Reference */}
          {uploadedDocument && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Document for Comparison</h4>
              <div className="relative">
                <img
                  src={uploadedDocument.preview || URL.createObjectURL(uploadedDocument)}
                  alt="Uploaded document"
                  className="w-full rounded-lg border-2 border-gray-200"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  Reference
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Verification Results */}
        {verificationResult && (
          <div className={`p-6 rounded-lg border-2 ${
            verificationResult.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="text-center mb-6">
              {verificationResult.success ? (
                <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              ) : (
                <div className="bg-red-100 p-4 rounded-full w-fit mx-auto mb-4">
                  <X className="h-12 w-12 text-red-600" />
                </div>
              )}

              <h4 className={`text-xl font-bold mb-3 ${
                verificationResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {verificationResult.success ? '🤖 Deep Learning Verification Successful!' : '🤖 Deep Learning Verification Failed'}
              </h4>

              <p className={`text-lg mb-4 ${
                verificationResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {verificationResult.message}
              </p>
            </div>

            {/* Deep Learning Analysis */}
            {verificationResult.deepLearningData && (
              <div className="bg-white p-4 rounded-lg border mb-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <span>🧠 Deep Learning Analysis</span>
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Algorithm:</span>
                    <p className="text-gray-600">{verificationResult.algorithm || 'FaceNet + DeepFace CNN'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Model:</span>
                    <p className="text-gray-600">{verificationResult.model || 'ResNet-50 + VGGFace2'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Facial Landmarks:</span>
                    <p className="text-gray-600">{verificationResult.deepLearningData.facialLandmarks} detected</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Image Quality:</span>
                    <p className="text-gray-600">{verificationResult.deepLearningData.qualityScore}</p>
                  </div>
                </div>

                {/* Detailed Feature Analysis */}
                <div className="mt-4">
                  <h6 className="font-medium text-gray-900 mb-2">🔍 Feature Matching Analysis:</h6>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">Eye Distance:</span>
                      <p className={`${verificationResult.deepLearningData.eyeDistance?.includes('Match') ? 'text-green-600' : 'text-red-600'}`}>
                        {verificationResult.deepLearningData.eyeDistance}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">Nose Shape:</span>
                      <p className={`${verificationResult.deepLearningData.noseShape?.includes('Match') ? 'text-green-600' : 'text-red-600'}`}>
                        {verificationResult.deepLearningData.noseShape}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">Jaw Line:</span>
                      <p className={`${verificationResult.deepLearningData.jawLine?.includes('Match') ? 'text-green-600' : 'text-red-600'}`}>
                        {verificationResult.deepLearningData.jawLine}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">Face Geometry:</span>
                      <p className={`${verificationResult.deepLearningData.faceGeometry?.includes('Match') ? 'text-green-600' : 'text-red-600'}`}>
                        {verificationResult.deepLearningData.faceGeometry}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">Skin Tone:</span>
                      <p className={`${verificationResult.deepLearningData.skinTone?.includes('Match') ? 'text-green-600' : 'text-red-600'}`}>
                        {verificationResult.deepLearningData.skinTone}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <span className="font-medium">Lighting:</span>
                      <p className="text-gray-600">{verificationResult.deepLearningData.lightingConditions}</p>
                    </div>
                  </div>
                </div>

                {/* Issues/Problems */}
                {verificationResult.deepLearningData.issues && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <h6 className="font-medium text-yellow-900 mb-2">⚠️ Detected Issues:</h6>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      {verificationResult.deepLearningData.issues.map((issue, index) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Final Result */}
            <div className="text-center">
              {verificationResult.success ? (
                <div className="bg-white p-4 rounded-lg border border-green-300">
                  <p className="text-green-700 font-medium mb-2">
                    🎉 Identity confirmed with {verificationResult.confidence}% confidence!
                  </p>
                  <p className="text-green-600 text-sm">
                    Deep learning analysis confirms you are the same person as in the document.
                  </p>
                </div>
              ) : (
                <div className="bg-white p-4 rounded-lg border border-red-300">
                  <p className="text-red-700 font-medium mb-2">
                    🚫 Verification failed with {verificationResult.confidence}% confidence (Required: {verificationResult.threshold}%)
                  </p>
                  <p className="text-red-600 text-sm mb-2">
                    {verificationResult.reason || 'Deep learning analysis indicates different person.'}
                  </p>
                  <p className="text-red-500 text-xs">
                    Please ensure good lighting, face the camera directly, and remove any obstructions.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status indicator */}
        <div className="text-center">
          {isVerifying ? (
            <div className="flex flex-col items-center space-y-2 text-blue-600">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium">🤖 Deep Learning Face Recognition in Progress...</span>
              </div>
              <div className="text-xs text-gray-600 max-w-md">
                Using advanced neural networks (FaceNet + ResNet-50) to analyze facial features and compare with document photo
              </div>
            </div>
          ) : verificationResult ? (
            <div className={`flex items-center justify-center space-x-2 ${
              verificationResult.success ? 'text-green-600' : 'text-red-600'
            }`}>
              {verificationResult.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">
                {verificationResult.success ?
                  `🤖 Deep learning confirmed match: ${verificationResult.confidence}% confidence` :
                  `🤖 Deep learning detected mismatch: ${verificationResult.confidence}% confidence (Required: 80%)`
                }
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">📸 Face captured - initializing deep learning analysis...</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Face Verification Camera</h3>
        <button
          onClick={closeCamera}
          className="btn-secondary flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Close Camera</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Face Verification Instructions:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Look directly at the camera</li>
                <li>Ensure good lighting on your face</li>
                <li>Remove glasses or hats if possible</li>
                <li>Keep your face centered in the frame</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Webcam */}
        <div className="relative">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            {hasPermission === null ? (
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Requesting camera access...</p>
                </div>
              </div>
            ) : (
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                onUserMedia={handleUserMedia}
                onUserMediaError={handleUserMediaError}
                className="w-full"
              />
            )}
          </div>

          {/* Overlay guide */}
          {isWebcamReady && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="relative w-full h-full">
                {/* Face outline guide */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-48 h-64 border-2 border-white border-dashed rounded-full opacity-70"></div>
                </div>
                
                {/* Corner guides */}
                <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white"></div>
              </div>
            </div>
          )}
        </div>

        {/* Capture button */}
        {isWebcamReady && (
          <div className="text-center">
            <button
              onClick={capture}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              <Camera className="h-5 w-5" />
              <span>Capture Photo</span>
            </button>
          </div>
        )}

        {/* Status indicator */}
        <div className="text-center">
          {!isWebcamReady && hasPermission && (
            <div className="flex items-center justify-center space-x-2 text-yellow-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
              <span className="text-sm">Initializing camera...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FaceVerification
