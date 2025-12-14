import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  console.log("🚀 Starting KYCHashStore deployment to Sepolia...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Check deployer balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  Warning: Low balance. You might need more Sepolia ETH from a faucet.");
  }

  // Deploy the KYCHashStore contract
  console.log("\n📦 Deploying KYCHashStore contract...");
  const KYCHashStore = await ethers.getContractFactory("KYCHashStore");
  
  // Estimate deployment gas
  const deploymentData = KYCHashStore.interface.encodeDeploy([]);
  const estimatedGas = await ethers.provider.estimateGas({
    data: deploymentData,
  });
  console.log("⛽ Estimated gas for deployment:", estimatedGas.toString());

  // Deploy the contract
  const kycHashStore = await KYCHashStore.deploy();
  await kycHashStore.waitForDeployment();

  const contractAddress = await kycHashStore.getAddress();
  console.log("✅ KYCHashStore deployed to:", contractAddress);

  // Get deployment transaction details
  const deploymentTx = kycHashStore.deploymentTransaction();
  console.log("📋 Deployment transaction hash:", deploymentTx.hash);
  console.log("🔗 View on Etherscan:", `https://sepolia.etherscan.io/tx/${deploymentTx.hash}`);

  // Wait for a few confirmations
  console.log("\n⏳ Waiting for confirmations...");
  await deploymentTx.wait(3);
  console.log("✅ Contract confirmed!");

  // Verify the contract has the expected functions
  console.log("\n🔍 Verifying contract functions...");
  try {
    // Test that we can call view functions
    const hasKYC = await kycHashStore.hasKYC(deployer.address);
    console.log("✅ hasKYC function working:", hasKYC);
    
    const kycHash = await kycHashStore.getKYCHash(deployer.address);
    console.log("✅ getKYCHash function working:", kycHash);
    
    console.log("✅ All contract functions verified!");
  } catch (error) {
    console.log("❌ Error verifying contract functions:", error.message);
  }

  // Output deployment summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT SUCCESSFUL!");
  console.log("=".repeat(60));
  console.log("📍 Contract Address:", contractAddress);
  console.log("🌐 Network: Sepolia Testnet");
  console.log("🔗 Etherscan:", `https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log("📋 Transaction:", `https://sepolia.etherscan.io/tx/${deploymentTx.hash}`);
  console.log("=".repeat(60));
  
  console.log("\n📝 Next steps:");
  console.log("1. Update your .env file with the new contract address:");
  console.log(`   VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("2. Restart your frontend development server");
  console.log("3. Test the contract integration in your app");

  return contractAddress;
}

// Handle errors
main()
  .then((contractAddress) => {
    console.log(`\n✅ Deployment completed successfully!`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
