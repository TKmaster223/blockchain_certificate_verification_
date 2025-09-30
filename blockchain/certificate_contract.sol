// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertRegistry {
    mapping(bytes32 => bool) public certHashes; // store only hashes

    // add a cert hash
    function addCert(bytes32 _hash) public {
        certHashes[_hash] = true;
    }

    // check if cert hash exists
    function verifyCert(bytes32 _hash) public view returns (bool) {
        return certHashes[_hash];
    }
}
