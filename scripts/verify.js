import pkg from "hardhat";
const { run } = pkg;

async function main() {
  const contractAddress = process.argv[2];
  
  if (!contractAddress) {
    console.log("❌ Please provide the contract address as an argument");
    console.log("Usage: npx hardhat run scripts/verify.js --network sepolia <CONTRACT_ADDRESS>");
    process.exit(1);
  }

  console.log("🔍 Verifying contract on Etherscan...");
  console.log("📍 Contract Address:", contractAddress);

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [], // KYCHashStore has no constructor arguments
    });
    
    console.log("✅ Contract verified successfully!");
    console.log("🔗 View on Etherscan:", `https://sepolia.etherscan.io/address/${contractAddress}#code`);
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
