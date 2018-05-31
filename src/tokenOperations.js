let tokenInstance;

const abiArray = [
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
		"constant": true,
		"inputs": [
			{
				"name": "tokenId",
				"type": "bytes12"
			}
		],
		"name": "getAvailableAmount",
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
		"constant": true,
		"inputs": [],
		"name": "getSourceContracts",
		"outputs": [
			{
				"name": "",
				"type": "address[]"
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
		"inputs": [],
		"name": "getSourceAmounts",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
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
				"name": "batchId",
				"type": "bytes32"
			}
		],
		"name": "Transfer",
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
	}
];

// Create a token contract instance from a token address
export const createTokenInstance = (tokenAddress) => {
    tokenInstance = new window.web3.eth.Contract(abiArray, tokenAddress, {
        from: window.web3.eth.defaultAccount,
        gasPrice: '2000000000',
        gas: 3000000
    });
}

// Create a token contract instance from a token address and return it
export const getTokenInstance = (tokenAddress) => {
    var tokenIns= new window.web3.eth.Contract(abiArray, tokenAddress, {
        from: window.web3.eth.defaultAccount,
        gasPrice: '2000000000',
        gas: 3000000
    });

    return tokenIns;
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

// Get source contracts of the ingredients
export const getSourceContracts = () => {
  return tokenInstance.methods.getSourceContracts().call();
}

// Get source amounts of the ingredients
export const getSourceAmounts = () => {
  return tokenInstance.methods.getSourceAmounts().call();
}

// Sort out existing tokens in a tokenContract
export const getTokens = (transferList) => {
  var curUser = window.web3.eth.defaultAccount;
  var dummyAddr = "0x0000000000000000000000000000000000000000";
  var returnArr = [];
  var uniqueArr = [];

  for(var i = 0; i < transferList.length; i++) {
		if ((uniqueArr.indexOf(transferList[i].returnValues[2]) === -1)
					&& (transferList[i].returnValues[0] === curUser || transferList[i].returnValues[1] === curUser)) {
			uniqueArr.push(transferList[i].returnValues[2]);
		}
	}

	for(var j = 0; j < uniqueArr.length; j++) {
		var isQualified = true;

		for (var k = 0; k < transferList.length; k++) {
			if (transferList[k].returnValues[2] === uniqueArr[j]) {
				if (transferList[k].returnValues[1] === curUser) {
					isQualified = true;
				}

				if ((transferList[k].returnValues[1] === dummyAddr) ||
						(transferList[k].returnValues[0] === curUser)) {
					isQualified = false;
				}
			}
		}

		if(isQualified) {
			returnArr.push(uniqueArr[j]);
		}
  }

  return returnArr;
}