/**
 * KYC Memory Service
 * Temporary storage for KYC process data including images and OCR results
 */

class KYCMemory {
  constructor() {
    this.data = {
      sessionId: this.generateSessionId(),
      startTime: new Date().toISOString(),
      currentStep: 'document_upload',
      documents: [],
      biometrics: null,
      extractedData: {},
      status: 'in_progress'
    }
    
    console.log('🧠 KYC Memory initialized:', this.data.sessionId)
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return 'kyc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  /**
   * Store document image and OCR data
   */
  storeDocument(file, ocrResults, preview = null) {
    const documentId = 'doc_' + Date.now()
    
    const documentData = {
      id: documentId,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadTime: new Date().toISOString(),
      preview: preview, // Base64 preview image
      file: file, // Store actual file object
      ocr: {
        success: ocrResults.success,
        fullText: ocrResults.fullText || '',
        extractedData: ocrResults.extractedData || null,
        confidence: ocrResults.confidence || 0,
        error: ocrResults.error || null,
        processedAt: new Date().toISOString()
      }
    }

    this.data.documents.push(documentData)
    
    // Update extracted data with latest OCR results
    if (ocrResults.success && ocrResults.extractedData) {
      this.data.extractedData = {
        ...this.data.extractedData,
        ...ocrResults.extractedData,
        lastUpdated: new Date().toISOString()
      }
    }

    console.log('📄 Document stored in memory:', {
      id: documentId,
      fileName: file.name,
      ocrSuccess: ocrResults.success,
      extractedFields: Object.keys(ocrResults.extractedData || {})
    })

    return documentId
  }

  /**
   * Store biometric data
   */
  storeBiometrics(biometricData) {
    this.data.biometrics = {
      ...biometricData,
      capturedAt: new Date().toISOString()
    }

    console.log('👤 Biometrics stored in memory')
  }

  /**
   * Update current step
   */
  setCurrentStep(step) {
    this.data.currentStep = step
    console.log('📍 KYC step updated:', step)
  }

  /**
   * Get all stored documents
   */
  getDocuments() {
    return this.data.documents
  }

  /**
   * Get specific document by ID
   */
  getDocument(documentId) {
    return this.data.documents.find(doc => doc.id === documentId)
  }

  /**
   * Get latest document
   */
  getLatestDocument() {
    return this.data.documents[this.data.documents.length - 1]
  }

  /**
   * Get extracted data summary
   */
  getExtractedData() {
    return this.data.extractedData
  }

  /**
   * Get biometric data
   */
  getBiometrics() {
    return this.data.biometrics
  }

  /**
   * Get complete KYC session data
   */
  getSessionData() {
    return {
      ...this.data,
      // Don't include actual file objects in session data
      documents: this.data.documents.map(doc => ({
        ...doc,
        file: null, // Remove file object
        fileInfo: {
          name: doc.fileName,
          size: doc.fileSize,
          type: doc.fileType
        }
      }))
    }
  }

  /**
   * Update KYC status
   */
  setStatus(status) {
    this.data.status = status
    this.data.lastUpdated = new Date().toISOString()
    console.log('📊 KYC status updated:', status)
  }

  /**
   * Add custom data
   */
  addCustomData(key, value) {
    if (!this.data.customData) {
      this.data.customData = {}
    }
    this.data.customData[key] = value
    console.log('💾 Custom data added:', key)
  }

  /**
   * Get memory usage summary
   */
  getMemoryUsage() {
    const totalDocuments = this.data.documents.length
    const totalSize = this.data.documents.reduce((sum, doc) => sum + doc.fileSize, 0)
    const hasOCRData = this.data.documents.some(doc => doc.ocr.success)
    const hasBiometrics = !!this.data.biometrics

    return {
      sessionId: this.data.sessionId,
      totalDocuments,
      totalSize,
      hasOCRData,
      hasBiometrics,
      currentStep: this.data.currentStep,
      status: this.data.status,
      startTime: this.data.startTime
    }
  }

  /**
   * Clear all data (for privacy)
   */
  clear() {
    const sessionId = this.data.sessionId
    this.data = {
      sessionId: this.generateSessionId(),
      startTime: new Date().toISOString(),
      currentStep: 'document_upload',
      documents: [],
      biometrics: null,
      extractedData: {},
      status: 'cleared'
    }
    
    console.log('🧹 KYC Memory cleared. Previous session:', sessionId)
  }

  /**
   * Export data for submission
   */
  exportForSubmission() {
    return {
      sessionId: this.data.sessionId,
      extractedData: this.data.extractedData,
      biometrics: this.data.biometrics ? {
        verified: this.data.biometrics.verified,
        confidence: this.data.biometrics.confidence,
        capturedAt: this.data.biometrics.capturedAt
      } : null,
      documents: this.data.documents.map(doc => ({
        id: doc.id,
        fileName: doc.fileName,
        fileType: doc.fileType,
        uploadTime: doc.uploadTime,
        ocr: {
          success: doc.ocr.success,
          confidence: doc.ocr.confidence,
          extractedData: doc.ocr.extractedData
        }
      })),
      completedAt: new Date().toISOString(),
      status: 'completed'
    }
  }
}

// Create singleton instance
const kycMemory = new KYCMemory()

// Export functions
export const storeDocument = (file, ocrResults, preview) => 
  kycMemory.storeDocument(file, ocrResults, preview)

export const storeBiometrics = (biometricData) => 
  kycMemory.storeBiometrics(biometricData)

export const setCurrentStep = (step) => 
  kycMemory.setCurrentStep(step)

export const getDocuments = () => 
  kycMemory.getDocuments()

export const getDocument = (id) => 
  kycMemory.getDocument(id)

export const getLatestDocument = () => 
  kycMemory.getLatestDocument()

export const getExtractedData = () => 
  kycMemory.getExtractedData()

export const getBiometrics = () => 
  kycMemory.getBiometrics()

export const getSessionData = () => 
  kycMemory.getSessionData()

export const setStatus = (status) => 
  kycMemory.setStatus(status)

export const addCustomData = (key, value) => 
  kycMemory.addCustomData(key, value)

export const getMemoryUsage = () => 
  kycMemory.getMemoryUsage()

export const clearMemory = () => 
  kycMemory.clear()

export const exportForSubmission = () => 
  kycMemory.exportForSubmission()

export default kycMemory
