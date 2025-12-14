import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("🧪 Testing deployed KYC contract...");

  const contractAddress = "0xFbA3baAd6E36Ff053901Ab2DC6938678221d6d9b";
  const [signer] = await ethers.getSigners();
  
  console.log("📝 Testing with account:", signer.address);

  // Contract ABI (simplified for testing)
  const abi = [
    "function hasKYC(address _user) external view returns (bool)",
    "function getKYCHash(address _user) external view returns (bytes32)",
    "function storeKYC(bytes32 _hash) external",
    "function verifyKYC(address _user, bytes32 _hash) external view returns (bool)"
  ];

  const contract = new ethers.Contract(contractAddress, abi, signer);

  try {
    // Test 1: Check if user has KYC (should be false initially)
    console.log("\n🔍 Test 1: Checking if user has KYC...");
    const hasKYC = await contract.hasKYC(signer.address);
    console.log("✅ hasKYC result:", hasKYC);

    // Test 2: Get KYC hash (should be empty initially)
    console.log("\n🔍 Test 2: Getting KYC hash...");
    const kycHash = await contract.getKYCHash(signer.address);
    console.log("✅ KYC hash:", kycHash);

    // Test 3: Store a test KYC hash
    console.log("\n🔍 Test 3: Storing test KYC hash...");
    const testHash = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    
    console.log("📤 Sending transaction...");
    const tx = await contract.storeKYC(testHash);
    console.log("⏳ Waiting for confirmation...");
    await tx.wait();
    console.log("✅ Transaction confirmed:", tx.hash);

    // Test 4: Verify the hash was stored
    console.log("\n🔍 Test 4: Verifying stored hash...");
    const hasKYCAfter = await contract.hasKYC(signer.address);
    const storedHash = await contract.getKYCHash(signer.address);
    const isValid = await contract.verifyKYC(signer.address, testHash);

    console.log("✅ Has KYC after storing:", hasKYCAfter);
    console.log("✅ Stored hash:", storedHash);
    console.log("✅ Hash verification:", isValid);

    console.log("\n🎉 All tests passed! Contract is working correctly.");
    console.log("🔗 View transaction on Etherscan:");
    console.log(`   https://sepolia.etherscan.io/tx/${tx.hash}`);

  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
