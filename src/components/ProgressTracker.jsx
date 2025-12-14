import React from 'react'
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react'

const ProgressTracker = ({ currentStep, steps, className = '' }) => {
  const getStepIcon = (step, index) => {
    const stepNumber = index + 1
    
    if (step.status === 'completed') {
      return <CheckCircle className="h-6 w-6 text-green-600" />
    } else if (step.status === 'in_progress') {
      return (
        <div className="relative">
          <Circle className="h-6 w-6 text-blue-600" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      )
    } else if (step.status === 'failed') {
      return <AlertCircle className="h-6 w-6 text-red-600" />
    } else {
      return (
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-500">{stepNumber}</span>
        </div>
      )
    }
  }

  const getStepColor = (step) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-600'
      case 'in_progress':
        return 'text-blue-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-500'
    }
  }

  const getConnectorColor = (currentIndex) => {
    if (currentIndex >= steps.length - 1) return ''
    
    const currentStep = steps[currentIndex]
    const nextStep = steps[currentIndex + 1]
    
    if (currentStep.status === 'completed') {
      return 'bg-green-600'
    } else if (currentStep.status === 'in_progress' && nextStep.status === 'pending') {
      return 'bg-gradient-to-r from-blue-600 to-gray-300'
    } else {
      return 'bg-gray-300'
    }
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">KYC Progress</h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Step content */}
            <div className="flex items-start space-x-4">
              {/* Icon */}
              <div className="flex-shrink-0 relative z-10">
                {getStepIcon(step, index)}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-medium ${getStepColor(step)}`}>
                    {step.title}
                  </h4>
                  {step.status === 'in_progress' && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-xs text-blue-600">Processing...</span>
                    </div>
                  )}
                  {step.status === 'completed' && step.completedAt && (
                    <span className="text-xs text-gray-500">
                      {new Date(step.completedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {step.description}
                </p>
                
                {step.status === 'failed' && step.error && (
                  <p className="text-sm text-red-600 mt-1">
                    Error: {step.error}
                  </p>
                )}
                
                {step.status === 'in_progress' && step.progress && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{step.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${step.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="absolute left-3 top-8 w-0.5 h-6 -ml-px">
                <div className={`w-full h-full ${getConnectorColor(index)}`}></div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Overall progress */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Overall Progress</span>
          <span>
            {steps.filter(step => step.status === 'completed').length} of {steps.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${(steps.filter(step => step.status === 'completed').length / steps.length) * 100}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}

// Default KYC steps
export const defaultKYCSteps = [
  {
    title: 'Document Upload',
    description: 'Upload your government-issued ID document',
    status: 'pending'
  },
  {
    title: 'Document Verification',
    description: 'OCR extraction and document validation',
    status: 'pending'
  },
  {
    title: 'Face Verification',
    description: 'Biometric face matching with document photo',
    status: 'pending'
  },
  {
    title: 'Compliance Check',
    description: 'PEP/AML screening and compliance verification',
    status: 'pending'
  },
  {
    title: 'Hash Generation',
    description: 'Generate verification hash from validated data',
    status: 'pending'
  },
  {
    title: 'Blockchain Storage',
    description: 'Store verification hash on blockchain',
    status: 'pending'
  },
  {
    title: 'KYC Complete',
    description: 'Identity verification completed successfully',
    status: 'pending'
  }
]

export default ProgressTracker
