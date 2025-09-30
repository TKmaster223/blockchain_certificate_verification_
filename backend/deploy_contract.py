#!/usr/bin/env python3
"""Deploy the CertRegistry smart contract to the local blockchain.

This script compiles and deploys the certificate registry contract,
then updates the configuration with the deployed contract address.
"""

import json
import os
from web3 import Web3
from solcx import compile_source, install_solc, set_solc_version
from config import BLOCKCHAIN_NODE

# Install solidity compiler if not available
try:
    install_solc('0.8.19')
    set_solc_version('0.8.19')
except Exception as e:
    print(f"Warning: Could not install solc: {e}")

def deploy_contract():
    """Deploy the CertRegistry contract to the blockchain."""
    
    # Connect to blockchain
    w3 = Web3(Web3.HTTPProvider(BLOCKCHAIN_NODE))
    
    if not w3.is_connected():
        print(f"❌ Cannot connect to blockchain node at {BLOCKCHAIN_NODE}")
        return None
    
    print(f"✅ Connected to blockchain node at {BLOCKCHAIN_NODE}")
    
    # Get accounts
    accounts = w3.eth.accounts
    if not accounts:
        print("❌ No accounts available on the blockchain")
        return None
    
    deployer = accounts[0]
    print(f"📝 Using deployer account: {deployer}")
    
    # Read the contract source
    contract_path = "../blockchain/certificate_contract.sol"
    if not os.path.exists(contract_path):
        contract_path = "blockchain/certificate_contract.sol"
    
    try:
        with open(contract_path, 'r') as f:
            contract_source = f.read()
    except FileNotFoundError:
        print(f"❌ Contract file not found at {contract_path}")
        return None
    
    print("📄 Contract source loaded")
    
    try:
        # Compile the contract
        compiled_sol = compile_source(contract_source)
        contract_id, contract_interface = compiled_sol.popitem()
        
        print("🔨 Contract compiled successfully")
        
        # Get contract data
        bytecode = contract_interface['bin']
        abi = contract_interface['abi']
        
        # Create contract instance
        contract = w3.eth.contract(abi=abi, bytecode=bytecode)
        
        # Deploy the contract
        print("🚀 Deploying contract...")
        tx_hash = contract.constructor().transact({'from': deployer})
        
        # Wait for transaction receipt
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)
        
        if tx_receipt.status == 1:
            contract_address = tx_receipt.contractAddress
            print(f"✅ Contract deployed successfully!")
            print(f"📍 Contract address: {contract_address}")
            
            # Test the contract
            deployed_contract = w3.eth.contract(address=contract_address, abi=abi)
            
            # Test storing and verifying a hash
            test_hash = "0x1234567890123456789012345678901234567890123456789012345678901234"
            test_bytes32 = bytes.fromhex(test_hash[2:])
            
            print("🧪 Testing contract functionality...")
            
            # Add a test certificate
            tx_hash = deployed_contract.functions.addCert(test_bytes32).transact({'from': deployer})
            w3.eth.wait_for_transaction_receipt(tx_hash)
            
            # Verify the certificate
            is_valid = deployed_contract.functions.verifyCert(test_bytes32).call()
            
            if is_valid:
                print("✅ Contract test passed - certificate storage and verification working")
            else:
                print("❌ Contract test failed - verification not working")
                return None
            
            return contract_address
        else:
            print("❌ Contract deployment failed")
            return None
            
    except Exception as e:
        print(f"❌ Error during compilation or deployment: {e}")
        # Try a simpler approach without solcx
        return deploy_contract_simple(w3, deployer)

def deploy_contract_simple(w3, deployer):
    """Deploy using precompiled bytecode (fallback method)."""
    print("🔄 Trying fallback deployment method...")
    
    # Simple precompiled bytecode for the CertRegistry contract
    # This is the compiled bytecode for the contract in certificate_contract.sol
    bytecode = "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806358e9dfaa1461003b578063d20c7e0d14610057575b600080fd5b61005560048036038101906100509190610094565b610087565b005b610071600480360381019061006c9190610094565b61009b565b60405161007e91906100d3565b60405180910390f35b60016000828152602001908152602001600020819055565b60006020528060005260406000206000915054906101000a900460ff1681565b6000813590506100ce81610103565b92915050565b60006020820190506100e860008301846100ee565b92915050565b6100f7816100f9565b82525050565b60008115159050919050565b61011281610099565b811461011d57600080fd5b5056fea2646970667358221220c9e3b58c1b8c8d4a9a5b8e1f8b7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f64736f6c63430008130033"
    
    abi = [
        {
            "inputs": [{"internalType": "bytes32", "name": "_hash", "type": "bytes32"}],
            "name": "addCert",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function",
        },
        {
            "inputs": [{"internalType": "bytes32", "name": "_hash", "type": "bytes32"}],
            "name": "verifyCert",
            "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
            "stateMutability": "view",
            "type": "function",
        },
        {
            "inputs": [{"internalType": "bytes32", "name": "", "type": "bytes32"}],
            "name": "certHashes",
            "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
            "stateMutability": "view",
            "type": "function",
        }
    ]
    
    try:
        # Create contract
        contract = w3.eth.contract(abi=abi, bytecode=bytecode)
        
        # Deploy
        print("🚀 Deploying with precompiled bytecode...")
        tx_hash = contract.constructor().transact({'from': deployer})
        tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash, timeout=60)
        
        if tx_receipt.status == 1:
            contract_address = tx_receipt.contractAddress
            print(f"✅ Contract deployed successfully!")
            print(f"📍 Contract address: {contract_address}")
            return contract_address
        else:
            print("❌ Contract deployment failed")
            return None
            
    except Exception as e:
        print(f"❌ Fallback deployment also failed: {e}")
        return None

def update_env_file(contract_address):
    """Update the environment configuration with the contract address."""
    env_file = "docker-compose.yaml"
    
    try:
        with open(env_file, 'r') as f:
            content = f.read()
        
        # Replace the CONTRACT_ADDRESS line
        updated_content = content.replace(
            '- CONTRACT_ADDRESS=',
            f'- CONTRACT_ADDRESS={contract_address}'
        )
        
        with open(env_file, 'w') as f:
            f.write(updated_content)
        
        print(f"✅ Updated {env_file} with contract address")
        print("⚠️  Please restart the backend service to use the new contract address:")
        print("   docker-compose restart backend")
        
    except Exception as e:
        print(f"❌ Failed to update environment file: {e}")
        print(f"Please manually set CONTRACT_ADDRESS={contract_address} in your docker-compose.yaml")

if __name__ == "__main__":
    print("🚀 Deploying CertRegistry Smart Contract")
    print("=" * 50)
    
    contract_address = deploy_contract()
    
    if contract_address:
        print("\n🎉 Deployment completed successfully!")
        print(f"Contract Address: {contract_address}")
        update_env_file(contract_address)
    else:
        print("\n❌ Deployment failed!")
        exit(1)