import React, { useState, useEffect } from 'react'
import { Camera, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

const CameraDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState({
    hasGetUserMedia: false,
    hasMediaDevices: false,
    isSecureContext: false,
    cameras: [],
    permissions: null,
    testResult: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    runDiagnostics()
  }, [])

  const runDiagnostics = async () => {
    setIsLoading(true)
    const results = {
      hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      hasMediaDevices: !!navigator.mediaDevices,
      isSecureContext: window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost',
      cameras: [],
      permissions: null,
      testResult: null
    }

    try {
      // Check for available cameras
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices()
        results.cameras = devices.filter(device => device.kind === 'videoinput')
      }

      // Check permissions
      if (navigator.permissions) {
        try {
          const permission = await navigator.permissions.query({ name: 'camera' })
          results.permissions = permission.state
        } catch (e) {
          console.log('Permissions API not supported for camera')
        }
      }

      // Test camera access
      if (results.hasGetUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true })
          results.testResult = 'success'
          // Stop the stream immediately
          stream.getTracks().forEach(track => track.stop())
        } catch (error) {
          results.testResult = {
            error: error.name,
            message: error.message
          }
        }
      }
    } catch (error) {
      console.error('Diagnostic error:', error)
    }

    setDiagnostics(results)
    setIsLoading(false)
  }

  const getStatusIcon = (status) => {
    if (status === true || status === 'success' || status === 'granted') {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    } else if (status === false || status === 'denied') {
      return <XCircle className="h-5 w-5 text-red-600" />
    } else {
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />
    }
  }

  if (isLoading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Running camera diagnostics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-6">
        <Camera className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Camera Diagnostic Report</h3>
      </div>

      <div className="space-y-4">
        {/* Browser Support */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">getUserMedia Support</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(diagnostics.hasGetUserMedia)}
            <span className="text-sm">{diagnostics.hasGetUserMedia ? 'Supported' : 'Not Supported'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">MediaDevices API</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(diagnostics.hasMediaDevices)}
            <span className="text-sm">{diagnostics.hasMediaDevices ? 'Available' : 'Not Available'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="font-medium">Secure Context (HTTPS/Localhost)</span>
          <div className="flex items-center space-x-2">
            {getStatusIcon(diagnostics.isSecureContext)}
            <span className="text-sm">{diagnostics.isSecureContext ? 'Secure' : 'Insecure'}</span>
          </div>
        </div>

        {/* Camera Devices */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Available Cameras</span>
            <span className="text-sm text-gray-600">{diagnostics.cameras.length} found</span>
          </div>
          {diagnostics.cameras.length > 0 ? (
            <ul className="text-sm text-gray-600 space-y-1">
              {diagnostics.cameras.map((camera, index) => (
                <li key={index}>• {camera.label || `Camera ${index + 1}`}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No cameras detected</p>
          )}
        </div>

        {/* Permissions */}
        {diagnostics.permissions && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Camera Permission</span>
            <div className="flex items-center space-x-2">
              {getStatusIcon(diagnostics.permissions)}
              <span className="text-sm capitalize">{diagnostics.permissions}</span>
            </div>
          </div>
        )}

        {/* Test Result */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Camera Access Test</span>
            {diagnostics.testResult && (
              <div className="flex items-center space-x-2">
                {getStatusIcon(diagnostics.testResult)}
                <span className="text-sm">
                  {diagnostics.testResult === 'success' ? 'Success' : 'Failed'}
                </span>
              </div>
            )}
          </div>
          {diagnostics.testResult && diagnostics.testResult !== 'success' && (
            <div className="text-sm text-red-600">
              <p><strong>Error:</strong> {diagnostics.testResult.error}</p>
              <p>{diagnostics.testResult.message}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="text-center pt-4">
          <button
            onClick={runDiagnostics}
            className="btn-primary"
          >
            Run Diagnostics Again
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Common Solutions:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Click the camera icon in your browser's address bar and select "Allow"</li>
                <li>• Refresh the page and grant permission when prompted</li>
                <li>• Close other applications that might be using your camera</li>
                <li>• Try a different browser (Chrome, Firefox, Safari, Edge)</li>
                <li>• Ensure your camera drivers are installed and working</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CameraDiagnostic
