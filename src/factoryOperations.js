let factoryInstance;
var tokenDesc = {};

// Create a factory contract instance from a fcatory address
export const createFactoryInstance = (factoryAddress) => {
    const abiArray = [
      {
        "constant": false,
        "inputs": [
          {
            "name": "_description",
            "type": "string"
          },
          {
            "name": "_source_addresses",
            "type": "address[]"
          },
          {
            "name": "_source_amounts",
            "type": "uint256[]"
          }
        ],
        "name": "createToken",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "name": "contract_address",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "description",
            "type": "string"
          },
          {
            "indexed": false,
            "name": "sender",
            "type": "address"
          }
        ],
        "name": "TokenCreated",
        "type": "event"
      }
    ];

    factoryInstance = new window.web3.eth.Contract(abiArray, factoryAddress, {
        from: window.web3.eth.defaultAccount,
        gasPrice: '2000000000',
        gas: 3000000
    });
}

// create new Token contract from factory instance
export const createToken = (desc, srcAddresses, srcAmounts) => {
    return factoryInstance.methods.createToken(desc, srcAddresses, srcAmounts).send();
}

// get past events from factory instance
export const getPastEvents = (event, options) => {
    return factoryInstance.getPastEvents(event, options);
}

// get description of all products
export const getDesc = () => {
    return tokenDesc;
}

// set description for products
export const setDesc = (tokenDescList) => {
    tokenDesc = tokenDescList;
}