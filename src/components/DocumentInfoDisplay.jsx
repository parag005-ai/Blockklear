import React, { useState } from 'react'
import { FileText, User, Calendar, CreditCard, MapPin, Eye, EyeOff, Copy, CheckCircle } from 'lucide-react'

const DocumentInfoDisplay = ({ ocrResults, uploadedFile }) => {
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)
  const [copied, setCopied] = useState('')

  if (!ocrResults || !ocrResults.extractedData) {
    return null
  }

  const { extractedData } = ocrResults

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(field)
      setTimeout(() => setCopied(''), 2000)
    })
  }

  const maskSensitiveData = (data, field) => {
    if (showSensitiveInfo) return data
    
    switch(field) {
      case 'aadhaarNumber':
      case 'panNumber':
      case 'documentNumber':
        return data ? `****-****-${data.slice(-4)}` : 'Not available'
      default:
        return data
    }
  }

  const formatFieldName = (field) => {
    const fieldNames = {
      fullName: 'Full Name',
      dateOfBirth: 'Date of Birth',
      aadhaarNumber: 'Aadhaar Number',
      panNumber: 'PAN Number',
      documentNumber: 'Document Number',
      documentType: 'Document Type',
      gender: 'Gender',
      fatherName: "Father's Name",
      address: 'Address',
      nationality: 'Nationality',
      issueDate: 'Issue Date',
      expiryDate: 'Expiry Date'
    }
    return fieldNames[field] || field.charAt(0).toUpperCase() + field.slice(1)
  }

  const getFieldIcon = (field) => {
    switch(field) {
      case 'fullName':
      case 'fatherName':
        return <User className="h-4 w-4 text-blue-600" />
      case 'dateOfBirth':
      case 'issueDate':
      case 'expiryDate':
        return <Calendar className="h-4 w-4 text-green-600" />
      case 'aadhaarNumber':
      case 'panNumber':
      case 'documentNumber':
        return <CreditCard className="h-4 w-4 text-purple-600" />
      case 'address':
        return <MapPin className="h-4 w-4 text-red-600" />
      case 'documentType':
        return <FileText className="h-4 w-4 text-gray-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  const importantFields = ['fullName', 'dateOfBirth', 'aadhaarNumber', 'panNumber', 'documentNumber']
  const otherFields = Object.keys(extractedData).filter(field => 
    !importantFields.includes(field) && 
    extractedData[field] && 
    field !== 'isValid'
  )

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 p-2 rounded-full">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">📄 Extracted Document Information</h3>
            <p className="text-sm text-gray-600">Information extracted from {uploadedFile?.name}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {showSensitiveInfo ? (
              <>
                <EyeOff className="h-4 w-4" />
                <span>Hide Details</span>
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                <span>Show Full Details</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Document Type Badge */}
      <div className="mb-6">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-blue-900">{extractedData.documentType}</span>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </div>
      </div>

      {/* Important Information */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
          🔍 Primary Information
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {importantFields.map(field => {
            if (!extractedData[field]) return null
            
            return (
              <div key={field} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getFieldIcon(field)}
                    <span className="text-sm font-medium text-gray-700">
                      {formatFieldName(field)}
                    </span>
                  </div>
                  
                  {(field === 'aadhaarNumber' || field === 'panNumber' || field === 'documentNumber') && (
                    <button
                      onClick={() => copyToClipboard(extractedData[field], field)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="font-mono text-sm bg-white p-2 rounded border">
                  {field === 'fullName' || field === 'dateOfBirth' ? 
                    extractedData[field] : 
                    maskSensitiveData(extractedData[field], field)
                  }
                  {copied === field && (
                    <span className="ml-2 text-green-600 text-xs">✓ Copied!</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Additional Information */}
      {otherFields.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2">
            📋 Additional Details
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherFields.map(field => (
              <div key={field} className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center space-x-2 mb-1">
                  {getFieldIcon(field)}
                  <span className="text-sm font-medium text-gray-700">
                    {formatFieldName(field)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 bg-white p-2 rounded border">
                  {extractedData[field]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OCR Quality Information */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">🤖 OCR Processing Details</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Confidence:</span>
            <p className="text-blue-700">{ocrResults.confidence}%</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Processing Time:</span>
            <p className="text-blue-700">{ocrResults.processingTime}ms</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">OCR Engine:</span>
            <p className="text-blue-700">{ocrResults.ocrEngine || 'Tesseract v5.0'}</p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Quality:</span>
            <p className="text-blue-700">{ocrResults.validation?.qualityScore || 'High'}</p>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <div className="bg-yellow-100 p-1 rounded-full">
            <Eye className="h-4 w-4 text-yellow-600" />
          </div>
          <div>
            <h5 className="font-medium text-yellow-900 mb-1">🔒 Privacy & Security</h5>
            <p className="text-sm text-yellow-800">
              Sensitive information is masked by default. This data is processed locally and used only for KYC verification. 
              Click "Show Full Details" to view complete information when needed.
            </p>
          </div>
        </div>
      </div>

      {/* Raw Text Preview */}
      {showSensitiveInfo && ocrResults.fullText && (
        <div className="mt-6">
          <details className="bg-gray-50 rounded-lg">
            <summary className="cursor-pointer p-4 font-medium text-gray-700 hover:text-gray-900">
              📄 Raw Extracted Text (Click to expand)
            </summary>
            <div className="p-4 pt-0">
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto whitespace-pre-wrap">
                {ocrResults.fullText}
              </pre>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}

export default DocumentInfoDisplay
