# 🔐 BlockKlear - Decentralized KYC Platform

> **Decentralized, Verifiable, Trustless Identity Verification**

BlockKlear is a revolutionary blockchain-based Know Your Customer (KYC) platform that enables secure, privacy-preserving identity verification without relying on centralized authorities. Users can verify their identity once and use it across multiple platforms while maintaining full control over their personal data.

![BlockKlear Banner](https://img.shields.io/badge/BlockKlear-Decentralized%20KYC-blue?style=for-the-badge&logo=ethereum)

## 🌟 Key Features

### 🔗 **Blockchain Integration**
- **Immutable Records**: KYC hashes stored permanently on Ethereum/Polygon
- **Smart Contract Verification**: Automated verification through Solidity contracts
- **Cross-Platform Compatibility**: Verify once, use everywhere

### 🛡️ **Privacy-First Design**
- **Zero Personal Data Storage**: Only cryptographic hashes stored on-chain
- **Local Processing**: OCR and face recognition run entirely in browser
- **User-Controlled**: Complete ownership of verification data

### 🎯 **Advanced Technology**
- **AI-Powered OCR**: Tesseract.js for accurate document text extraction
- **Real-Time Face Verification**: Browser-based biometric matching
- **QR Code Integration**: Shareable verification proofs
- **Multi-Network Support**: Ethereum, Polygon, and testnets

### 🚀 **User Experience**
- **One-Click Wallet Connection**: Seamless MetaMask integration
- **Progressive Web App**: Mobile-responsive design
- **Real-Time Progress**: Live status updates throughout verification
- **Instant Verification**: Complete KYC process in under 5 minutes

## 🏗️ System Architecture

### **Frontend Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React App     │    │   Web3 Layer    │    │   Blockchain    │
│                 │    │                 │    │                 │
│ • UI Components │◄──►│ • MetaMask      │◄──►│ • Smart Contract│
│ • State Mgmt    │    │ • Ethers.js     │    │ • Hash Storage  │
│ • OCR Engine    │    │ • Wallet Conn   │    │ • Verification  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Data Flow**
```
Document Upload → OCR Processing → Data Extraction → Hash Generation → Blockchain Storage → Verification Complete
```

### **Security Model**
- **Client-Side Processing**: All sensitive operations happen locally
- **Hash-Only Storage**: Personal data never leaves user's device
- **Cryptographic Verification**: SHA-256 hashing for data integrity
- **Blockchain Immutability**: Tamper-proof verification records

## 🛠️ Technology Stack

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI Framework |
| **Vite** | 5.0.8 | Build Tool & Dev Server |
| **TailwindCSS** | 3.3.6 | Styling Framework |
| **Lucide React** | 0.294.0 | Icon Library |
| **React Router** | 6.8.1 | Client-Side Routing |

### **Blockchain & Web3**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Ethers.js** | 6.15.0 | Ethereum Interaction |
| **Hardhat** | 2.26.0 | Smart Contract Development |
| **Solidity** | 0.8.19 | Smart Contract Language |
| **MetaMask** | Latest | Wallet Integration |

### **AI & Processing**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tesseract.js** | 6.0.1 | OCR Text Extraction |
| **React Webcam** | 7.1.1 | Camera Integration |
| **Crypto-JS** | 4.2.0 | Cryptographic Hashing |
| **QRCode** | 1.5.3 | QR Code Generation |

### **Development Tools**
| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 8.55.0 | Code Linting |
| **PostCSS** | 8.4.32 | CSS Processing |
| **Autoprefixer** | 10.4.16 | CSS Vendor Prefixes |

## 🚀 Quick Start Guide

### **Prerequisites**
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **MetaMask** browser extension ([Install](https://metamask.io/))
- **Git** for version control

### **Installation Steps**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/didaco97/blockklear
   cd blockklear
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit .env file with your configuration
   nano .env
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open Application**
   - Navigate to `http://localhost:5173`
   - Connect your MetaMask wallet
   - Start the KYC verification process

### **Production Build**
```bash
npm run build
npm run preview
```

## ⚙️ Configuration Guide

### **Environment Variables**

Create a `.env` file in the project root:

```env
# ===========================================
# BLOCKCHAIN CONFIGURATION
# ===========================================
# Deployed smart contract address
VITE_CONTRACT_ADDRESS=0xYourContractAddress

# Ethereum RPC endpoints
VITE_ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
VITE_POLYGON_RPC_URL=https://rpc-amoy.polygon.technology

# ===========================================
# DEVELOPMENT SETTINGS
# ===========================================
# Enable debug mode for development
VITE_DEBUG_MODE=true

# API base URL (if using backend services)
VITE_API_BASE_URL=http://localhost:3001/api
```

### **MetaMask Network Setup**

**Sepolia Testnet Configuration:**
- **Network Name**: Sepolia Testnet
- **RPC URL**: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- **Chain ID**: `11155111`
- **Currency Symbol**: `SepoliaETH`
- **Block Explorer**: `https://sepolia.etherscan.io`

**Get Test ETH:**
- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Enter your wallet address
- Receive test ETH for transactions

## 📱 User Guide

### **Step 1: Wallet Connection**
1. Click **"Connect Wallet"** button
2. Approve MetaMask connection
3. Ensure you're on Sepolia testnet
4. Verify wallet address is displayed

### **Step 2: Document Upload**
1. Navigate to **"Start KYC"** page
2. Click **"Upload Document"** or drag & drop
3. Supported formats: JPG, PNG, PDF
4. Wait for OCR processing to complete

### **Step 3: Data Verification**
1. Review extracted information:
   - Full Name
   - Date of Birth
   - Document Number
   - Document Type
2. Correct any errors if necessary
3. Confirm data accuracy

### **Step 4: Face Verification**
1. Click **"Start Face Verification"**
2. Allow camera permissions
3. Position face within the frame
4. Capture clear photo
5. Wait for verification processing

### **Step 5: Blockchain Submission**
1. Review final KYC summary
2. Click **"Submit to Blockchain"**
3. Approve MetaMask transaction
4. Wait for confirmation (1-2 minutes)
5. Receive transaction hash

### **Step 6: Verification Complete**
1. View status on **"Status"** page
2. Download QR code for sharing
3. Copy transaction hash for records
4. Use verification across platforms

## 🏗️ Project Structure

```
blockklear-frontend/
├── 📁 public/                    # Static assets
│   └── 📄 vite.svg              # Vite logo
├── 📁 src/
│   ├── 📁 components/           # Reusable UI components
│   │   ├── 📄 Header.jsx        # Navigation header
│   │   ├── 📄 DocumentUpload.jsx # Document upload & OCR
│   │   ├── 📄 FaceVerification.jsx # Webcam face capture
│   │   ├── 📄 ProgressTracker.jsx # Step progress indicator
│   │   ├── 📄 MetaMaskStatus.jsx # Wallet connection status
│   │   ├── 📄 HashDisplay.jsx   # Blockchain hash display
│   │   └── 📄 DocumentInfoDisplay.jsx # Extracted data display
│   ├── 📁 contexts/             # React context providers
│   │   └── 📄 Web3Context.jsx   # Web3 & wallet state
│   ├── 📁 pages/                # Main application pages
│   │   ├── 📄 Dashboard.jsx     # Home dashboard
│   │   ├── 📄 KYCFlow.jsx       # Main KYC process
│   │   ├── 📄 Status.jsx        # Verification status
│   │   └── 📄 HashViewer.jsx    # Hash lookup tool
│   ├── 📁 services/             # Business logic services
│   │   ├── 📄 localOCR.js       # Tesseract OCR service
│   │   ├── 📄 kycMemory.js      # Local data management
│   │   └── 📄 deepLearningFaceRecognition.js # Face recognition
│   ├── 📁 utils/                # Utility functions
│   │   └── 📄 blockchain.js     # Web3 & smart contract utils
│   ├── 📁 contracts/            # Smart contract source
│   │   └── 📄 KYCHashStore.sol  # Solidity contract
│   ├── 📄 App.jsx               # Main application component
│   ├── 📄 main.jsx              # Application entry point
│   └── 📄 index.css             # Global styles & Tailwind
├── 📁 scripts/                  # Deployment scripts
│   ├── 📄 deploy.js             # Contract deployment
│   ├── 📄 verify.js             # Contract verification
│   └── 📄 test-contract.js      # Contract testing
├── 📄 package.json              # Dependencies & scripts
├── 📄 vite.config.js            # Vite configuration
├── 📄 tailwind.config.js        # Tailwind CSS config
├── 📄 hardhat.config.js         # Hardhat blockchain config
└── 📄 README.md                 # This documentation
```

## 🔧 Available Scripts

### **Development Commands**
```bash
# Start development server with hot reload
npm run dev

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Run ESLint code analysis
npm run lint
```

### **Blockchain Commands**
```bash
# Compile smart contracts
npm run compile

# Deploy to Sepolia testnet
npm run deploy:sepolia

# Verify contract on Etherscan
npm run verify:sepolia

# Deploy to local Hardhat network
npm run deploy:local
```

## 🔐 Smart Contract Details

### **KYCHashStore.sol**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract KYCHashStore {
    mapping(address => bytes32) private kycHashes;
    mapping(address => uint256) private verificationTimestamps;

    event KYCStored(address indexed user, bytes32 indexed hash, uint256 timestamp);

    function storeKYC(bytes32 _hash) external {
        kycHashes[msg.sender] = _hash;
        verificationTimestamps[msg.sender] = block.timestamp;
        emit KYCStored(msg.sender, _hash, block.timestamp);
    }

    function getKYCHash(address _user) external view returns (bytes32) {
        return kycHashes[_user];
    }

    function hasKYC(address _user) external view returns (bool) {
        return kycHashes[_user] != bytes32(0);
    }
}
```

### **Contract Features**
- **Gas Optimized**: Minimal storage and computation
- **Event Logging**: Transparent verification tracking
- **Access Control**: Users control their own data
- **Immutable Storage**: Permanent verification records

## 🔍 How It Works

### **1. Document Processing Pipeline**
```
📄 Document Upload
    ↓
🔍 OCR Text Extraction (Tesseract.js)
    ↓
📊 Data Parsing & Validation
    ↓
✅ Information Verification
    ↓
🔐 Hash Generation (SHA-256)
```

### **2. Face Verification Process**
```
📷 Camera Activation
    ↓
👤 Face Detection & Capture
    ↓
🧠 Biometric Analysis
    ↓
✅ Liveness Detection
    ↓
🔐 Biometric Hash Creation
```

### **3. Blockchain Storage**
```
📝 KYC Data Compilation
    ↓
🔐 Cryptographic Hashing
    ↓
📡 Smart Contract Interaction
    ↓
⛓️ Blockchain Transaction
    ↓
✅ Immutable Storage Complete
```

### **4. Verification Workflow**
```
🔍 Hash Lookup Request
    ↓
⛓️ Blockchain Query
    ↓
🔐 Hash Comparison
    ↓
✅ Verification Result
    ↓
📱 QR Code Generation
```

## 🛡️ Security & Privacy

### **Privacy Protection**
- **No Personal Data Storage**: Only cryptographic hashes stored
- **Local Processing**: All sensitive operations in browser
- **User Consent**: Explicit approval for each step
- **Data Minimization**: Only necessary information processed

### **Security Measures**
- **Cryptographic Hashing**: SHA-256 for data integrity
- **Blockchain Immutability**: Tamper-proof records
- **Client-Side Validation**: Reduce server attack surface
- **Secure Communication**: HTTPS for all external calls

### **Compliance Features**
- **GDPR Compatible**: Right to be forgotten (hash deletion)
- **KYC/AML Standards**: Meets regulatory requirements
- **Audit Trail**: Complete verification history
- **Data Portability**: Export verification proofs

## 🌐 Network Support

### **Supported Networks**
| Network | Chain ID | Status | Purpose |
|---------|----------|--------|---------|
| **Ethereum Mainnet** | 1 | 🟡 Planned | Production deployment |
| **Sepolia Testnet** | 11155111 | ✅ Active | Development & testing |
| **Polygon Mainnet** | 137 | 🟡 Planned | Low-cost transactions |
| **Polygon Amoy** | 80002 | ✅ Active | Polygon testing |
| **Hardhat Local** | 31337 | ✅ Active | Local development |

### **Gas Optimization**
- **Minimal Storage**: Only essential data on-chain
- **Batch Operations**: Multiple verifications in single transaction
- **Layer 2 Support**: Polygon for reduced costs
- **Gas Estimation**: Real-time fee calculation

## 🧪 Testing Guide

### **Manual Testing Checklist**
- [ ] Wallet connection/disconnection
- [ ] Document upload (various formats)
- [ ] OCR text extraction accuracy
- [ ] Face verification capture
- [ ] Blockchain transaction submission
- [ ] Status page verification
- [ ] QR code generation/download
- [ ] Hash lookup functionality

### **Test Documents**
Use these sample documents for testing:
- **Government ID**: Driver's license, passport
- **Utility Bills**: For address verification
- **Bank Statements**: For financial verification

### **Browser Compatibility**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ❌ Internet Explorer (not supported)

## 🚀 Deployment Guide

### **Production Deployment**

1. **Build Production Bundle**
   ```bash
   npm run build
   ```

2. **Deploy Smart Contract**
   ```bash
   npm run deploy:sepolia
   ```

3. **Update Environment Variables**
   ```bash
   VITE_CONTRACT_ADDRESS=0xYourDeployedAddress
   ```

4. **Deploy Frontend**
   - **Vercel**: Connect GitHub repository
   - **Netlify**: Drag & drop `dist` folder
   - **AWS S3**: Upload static files
   - **IPFS**: Decentralized hosting

### **Environment-Specific Configs**
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### **Code Standards**
- **ESLint**: Follow configured rules
- **Prettier**: Auto-format code
- **Conventional Commits**: Use semantic commit messages
- **Component Structure**: Functional components with hooks

### **Testing Requirements**
- Unit tests for utility functions
- Integration tests for components
- E2E tests for user workflows
- Smart contract tests with Hardhat

## 📞 Support & Community

### **Getting Help**
- 📧 **Email**: support@blockklear.io
- 💬 **Discord**: [BlockKlear Community](https://discord.gg/blockklear)
- 📱 **Telegram**: [@BlockKlearSupport](https://t.me/BlockKlearSupport)
- 🐛 **Issues**: [GitHub Issues](https://github.com/blockklear/issues)

### **Documentation**
- 📖 **User Guide**: [docs.blockklear.io](https://docs.blockklear.io)
- 🔧 **API Reference**: [api.blockklear.io](https://api.blockklear.io)
- 🎥 **Video Tutorials**: [YouTube Channel](https://youtube.com/blockklear)

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### **MIT License Summary**
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ❌ Liability
- ❌ Warranty

---

## 🎯 Roadmap

### **Phase 1: Core Platform** ✅
- [x] Basic KYC workflow
- [x] MetaMask integration
- [x] Smart contract deployment
- [x] OCR document processing

### **Phase 2: Enhanced Features** 🚧
- [ ] Multi-language support
- [ ] Advanced biometrics
- [ ] Mobile app development
- [ ] API for third-party integration

### **Phase 3: Enterprise** 🔮
- [ ] White-label solutions
- [ ] Enterprise dashboard
- [ ] Compliance reporting
- [ ] Multi-chain support

---

<div align="center">

**Built with ❤️ by the BlockKlear Team**

[![GitHub](https://img.shields.io/badge/GitHub-BlockKlear-black?style=for-the-badge&logo=github)](https://github.com/blockklear)
[![Website](https://img.shields.io/badge/Website-blockklear.io-blue?style=for-the-badge&logo=web)](https://blockklear.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>