import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

class App extends Component {
  state = {
    account: '',
    balance: 0,
    contractInstance : {}
  };

  constructor (props) {
    super(props)

    // Initialise web3
    if (typeof web3 !== 'undefined') {
      console.log('Using current provider');
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log('No Web3 Detected...');
    }

    window.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        console.log('Error fetching your accounts');
        return
      }

      if (accs.length === 0) {
        console.log('No accounts found');
        return
      }

      console.log("Active current account : " + accs[0]);
      window.web3.eth.defaultAccount = accs[0];
      this.setState({
        account: accs[0]
      })
      this.checkBalance();
      this.createContractInstance('0x73218674b32Be8e359ee63a4F8898F6103e79d63');
    });
  }

  // Get balance from the default account
  checkBalance = () => {
    window.web3.eth.getBalance(window.web3.eth.defaultAccount, (error, wei) => {
      if (!error) {
          var balance = window.web3.utils.fromWei(wei, 'ether');
          console.log(balance);
          this.setState({
            balance : balance
          })
      }
    });
  }

  // Create instance of a contract
  createContractInstance = (contractAdress) => {
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
          }
        ],
        "name": "TokenCreated",
        "type": "event"
      }
    ];

    var contractInstance = new window.web3.eth.Contract(abiArray, contractAdress, {
      from: window.web3.eth.defaultAccount,
      gasPrice: '2000000000',
      gas: 3000000
    });

    this.setState({
      contractInstance : contractInstance
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">SCBC</h1>
        </header>
        <p className="App-intro">
          Active account : <b>{this.state.account}</b>
        </p>
        <p className="App-intro">
          Balance : <b>{this.state.balance}</b>
        </p>
        <p className="App-intro">
          <button onClick={this.checkBalance}>Check balance</button>
        </p>
      </div>
    );
  }
}

export default App;
