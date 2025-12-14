// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title KYCHashStore
 * @dev Simple contract to store KYC verification hashes on blockchain
 * @notice This contract allows users to store their KYC verification hash
 */
contract KYCHashStore {
    // Mapping from user address to their KYC hash
    mapping(address => bytes32) public kycHash;
    
    // Mapping to track if user has completed KYC
    mapping(address => bool) public isKYCVerified;
    
    // Event emitted when KYC hash is stored
    event KYCStored(address indexed user, bytes32 indexed hash, uint256 timestamp);
    
    // Event emitted when KYC is updated
    event KYCUpdated(address indexed user, bytes32 indexed oldHash, bytes32 indexed newHash, uint256 timestamp);
    
    /**
     * @dev Store KYC hash for the caller
     * @param _hash The SHA-256 hash of the verified KYC data
     */
    function storeKYC(bytes32 _hash) external {
        require(_hash != bytes32(0), "Hash cannot be empty");
        
        bytes32 oldHash = kycHash[msg.sender];
        kycHash[msg.sender] = _hash;
        isKYCVerified[msg.sender] = true;
        
        if (oldHash != bytes32(0)) {
            emit KYCUpdated(msg.sender, oldHash, _hash, block.timestamp);
        } else {
            emit KYCStored(msg.sender, _hash, block.timestamp);
        }
    }
    
    /**
     * @dev Get KYC hash for a specific address
     * @param _user The address to query
     * @return The KYC hash for the user
     */
    function getKYCHash(address _user) external view returns (bytes32) {
        return kycHash[_user];
    }
    
    /**
     * @dev Check if a user has completed KYC verification
     * @param _user The address to check
     * @return True if user has completed KYC, false otherwise
     */
    function hasKYC(address _user) external view returns (bool) {
        return isKYCVerified[_user];
    }
    
    /**
     * @dev Verify if a hash matches the stored KYC hash for a user
     * @param _user The user address
     * @param _hash The hash to verify
     * @return True if hash matches, false otherwise
     */
    function verifyKYC(address _user, bytes32 _hash) external view returns (bool) {
        return kycHash[_user] == _hash && _hash != bytes32(0);
    }
}
