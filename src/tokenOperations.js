let tokenInstance;

// Create a token contract instance from a token address
export const createTokenInstance = (tokenAddress) => {
    const abiArray = [
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "batchId",
              "type": "bytes32"
            }
          ],
          "name": "ConsumedBatch",
          "type": "event"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_spender",
              "type": "address"
            },
            {
              "name": "tokenId",
              "type": "bytes12"
            }
          ],
          "name": "approve",
          "outputs": [
            {
              "name": "success",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "source_batches",
              "type": "bytes32[]"
            },
            {
              "name": "source_amounts",
              "type": "uint256[]"
            },
            {
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "increaseSupply",
          "outputs": [
            {
              "name": "",
              "type": "bytes12"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "tokenIds",
              "type": "bytes12[]"
            }
          ],
          "name": "merge",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "tokenId",
              "type": "bytes12"
            },
            {
              "name": "_amounts",
              "type": "uint256[]"
            }
          ],
          "name": "split",
          "outputs": [
            {
              "name": "",
              "type": "bytes12[]"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "tokenId",
              "type": "bytes12"
            },
            {
              "name": "a",
              "type": "uint256"
            },
            {
              "name": "b",
              "type": "uint256"
            }
          ],
          "name": "splitInTwo",
          "outputs": [
            {
              "name": "",
              "type": "bytes12[]"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "tokenId",
              "type": "bytes12"
            },
            {
              "name": "receiver",
              "type": "address"
            }
          ],
          "name": "transfer",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_from",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_to",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "tokenId",
              "type": "bytes12"
            },
            {
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "use",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "batchId",
              "type": "bytes32"
            },
            {
              "indexed": false,
              "name": "source_batches",
              "type": "bytes32[]"
            },
            {
              "indexed": false,
              "name": "amounts",
              "type": "uint256[]"
            },
            {
              "indexed": false,
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "name": "AddedBatch",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "name": "_owner",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_spender",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "_value",
              "type": "bool"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "inputs": [
            {
              "name": "_owner",
              "type": "address"
            },
            {
              "name": "_source_contracts",
              "type": "address[]"
            },
            {
              "name": "_amounts",
              "type": "uint256[]"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "tokenId",
              "type": "bytes12"
            },
            {
              "name": "_spender",
              "type": "address"
            }
          ],
          "name": "allowed",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_address",
              "type": "address"
            },
            {
              "name": "batch",
              "type": "bytes12"
            }
          ],
          "name": "concat",
          "outputs": [
            {
              "name": "uid",
              "type": "bytes32"
            }
          ],
          "payable": false,
          "stateMutability": "pure",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "source",
              "type": "bytes32"
            }
          ],
          "name": "cut",
          "outputs": [
            {
              "name": "contract_address",
              "type": "address"
            },
            {
              "name": "uid",
              "type": "bytes12"
            }
          ],
          "payable": false,
          "stateMutability": "pure",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "tokenId",
              "type": "bytes12"
            }
          ],
          "name": "getAmountOfToken",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getOwner",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "tokenId",
              "type": "bytes12"
            }
          ],
          "name": "getOwnerOfToken",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [],
          "name": "getTotalSupply",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        }
    ];
  
    tokenInstance = new window.web3.eth.Contract(abiArray, tokenAddress, {
        from: window.web3.eth.defaultAccount,
        gasPrice: '2000000000',
        gas: 3000000
    });
}

// Increase supply with a given input
export const increaseSupply = (srcBatches, srcAmounts, amount) => {
  return tokenInstance.methods.increaseSupply(srcBatches, srcAmounts, amount).send();
}

// Get owner of this token
export const getOwner = () => {
  return tokenInstance.methods.getOwner().call();
}

// Get owner of this token
export const getTotalSupply = () => {
  return tokenInstance.methods.getTotalSupply().call();
}