import React, { useState, useRef } from 'react'
import { Camera, X, CheckCircle } from 'lucide-react'

const SimpleCameraTest = () => {
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [isActive, setIsActive] = useState(false)
  const videoRef = useRef(null)

  const startCamera = async () => {
    try {
      console.log('Starting camera...')
      setError(null)
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      })
      
      console.log('Camera started successfully!')
      setStream(mediaStream)
      setIsActive(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      
    } catch (err) {
      console.error('Camera error:', err)
      setError(`Camera failed: ${err.message}`)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsActive(false)
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(videoRef.current, 0, 0)
      
      const imageData = canvas.toDataURL('image/jpeg')
      console.log('Photo captured:', imageData.substring(0, 50) + '...')
      
      // Create download link
      const link = document.createElement('a')
      link.download = 'captured-photo.jpg'
      link.href = imageData
      link.click()
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🎥 Simple Camera Test</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      {!isActive ? (
        <div className="text-center py-8">
          <div className="bg-blue-100 p-4 rounded-full w-fit mx-auto mb-4">
            <Camera className="h-8 w-8 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Test Your Camera</h4>
          <p className="text-gray-600 mb-6">
            Click the button below to test if your camera is working properly.
          </p>
          <button
            onClick={startCamera}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Camera className="h-5 w-5" />
            <span>Start Camera Test</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded-lg border-2 border-gray-200"
            />
            <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
              <CheckCircle className="h-3 w-3" />
              <span>Live</span>
            </div>
          </div>
          
          <div className="flex justify-center space-x-4">
            <button
              onClick={capturePhoto}
              className="btn-primary flex items-center space-x-2"
            >
              <Camera className="h-5 w-5" />
              <span>Capture Photo</span>
            </button>
            <button
              onClick={stopCamera}
              className="btn-secondary flex items-center space-x-2"
            >
              <X className="h-5 w-5" />
              <span>Stop Camera</span>
            </button>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Camera is working correctly!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              If you can see yourself in the video above, your camera is functioning properly.
            </p>
          </div>
        </div>
      )}
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Troubleshooting Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Make sure to allow camera access when prompted</li>
          <li>• Check if other apps are using your camera</li>
          <li>• Try refreshing the page if camera doesn't start</li>
          <li>• Ensure you're using a supported browser (Chrome, Firefox, Safari, Edge)</li>
        </ul>
      </div>
    </div>
  )
}

export default SimpleCameraTest
