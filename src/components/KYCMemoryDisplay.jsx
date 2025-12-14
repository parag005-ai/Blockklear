import React, { useState, useEffect } from 'react'
import { Database, FileText, User, Clock, CheckCircle, AlertCircle, Eye, Trash2 } from 'lucide-react'
import { getSessionData, getMemoryUsage, clearMemory, getDocuments, getExtractedData } from '../services/kycMemory'

const KYCMemoryDisplay = ({ isOpen, onClose }) => {
  const [sessionData, setSessionData] = useState(null)
  const [memoryUsage, setMemoryUsage] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (isOpen) {
      refreshData()
    }
  }, [isOpen])

  const refreshData = () => {
    setSessionData(getSessionData())
    setMemoryUsage(getMemoryUsage())
  }

  const handleClearMemory = () => {
    if (confirm('Are you sure you want to clear all KYC memory data? This cannot be undone.')) {
      clearMemory()
      refreshData()
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">KYC Memory Storage</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Memory Usage Summary */}
        {memoryUsage && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Session Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Session ID</div>
                <div className="font-mono text-sm text-gray-900">{memoryUsage.sessionId}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Documents</div>
                <div className="text-2xl font-bold text-blue-600">{memoryUsage.totalDocuments}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Total Size</div>
                <div className="text-lg font-semibold text-gray-900">{formatFileSize(memoryUsage.totalSize)}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-sm text-gray-500">Status</div>
                <div className="flex items-center space-x-1">
                  {memoryUsage.status === 'in_progress' ? (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm font-medium capitalize">{memoryUsage.status}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Section */}
        {sessionData && sessionData.documents.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stored Documents</h3>
            <div className="space-y-4">
              {sessionData.documents.map((doc, index) => (
                <div key={doc.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-medium text-gray-900">{doc.fileName}</h4>
                        <p className="text-sm text-gray-500">
                          {formatFileSize(doc.fileSize)} • {doc.fileType} • {formatDate(doc.uploadTime)}
                        </p>
                        
                        {/* OCR Results */}
                        {doc.ocr && (
                          <div className="mt-2">
                            <div className="flex items-center space-x-2">
                              {doc.ocr.success ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className="text-sm font-medium">
                                OCR {doc.ocr.success ? 'Success' : 'Failed'}
                              </span>
                              {doc.ocr.confidence && (
                                <span className="text-sm text-gray-500">
                                  ({Math.round(doc.ocr.confidence * 100)}% confidence)
                                </span>
                              )}
                            </div>
                            
                            {doc.ocr.extractedData && (
                              <div className="mt-2 text-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  {doc.ocr.extractedData.documentType && (
                                    <div>
                                      <span className="text-gray-500">Type:</span>
                                      <span className="ml-1 font-medium">{doc.ocr.extractedData.documentType}</span>
                                    </div>
                                  )}
                                  {doc.ocr.extractedData.fullName && (
                                    <div>
                                      <span className="text-gray-500">Name:</span>
                                      <span className="ml-1 font-medium">{doc.ocr.extractedData.fullName}</span>
                                    </div>
                                  )}
                                  {doc.ocr.extractedData.documentNumber && (
                                    <div>
                                      <span className="text-gray-500">Number:</span>
                                      <span className="ml-1 font-mono text-sm">{doc.ocr.extractedData.documentNumber}</span>
                                    </div>
                                  )}
                                  {doc.ocr.extractedData.dateOfBirth && (
                                    <div>
                                      <span className="text-gray-500">DOB:</span>
                                      <span className="ml-1">{doc.ocr.extractedData.dateOfBirth}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Preview */}
                    {doc.preview && (
                      <img 
                        src={doc.preview} 
                        alt="Document preview" 
                        className="w-16 h-16 object-cover rounded border"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extracted Data Summary */}
        {sessionData && sessionData.extractedData && Object.keys(sessionData.extractedData).length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Consolidated Data</h3>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(sessionData.extractedData).map(([key, value]) => (
                  key !== 'lastUpdated' && value && (
                    <div key={key}>
                      <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="ml-2 font-medium text-gray-900">{value}</span>
                    </div>
                  )
                ))}
              </div>
              {sessionData.extractedData.lastUpdated && (
                <div className="mt-3 pt-3 border-t border-green-200">
                  <span className="text-xs text-gray-500">
                    Last updated: {formatDate(sessionData.extractedData.lastUpdated)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <Eye className="h-4 w-4" />
              <span>{showDetails ? 'Hide' : 'Show'} Raw Data</span>
            </button>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={refreshData}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Refresh
              </button>
              <button
                onClick={handleClearMemory}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Memory</span>
              </button>
            </div>
          </div>

          {/* Raw Data Display */}
          {showDetails && sessionData && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Raw Session Data</h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                {JSON.stringify(sessionData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KYCMemoryDisplay
