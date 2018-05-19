import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import * as factoryOperations from './factoryOperations';
import * as tokenOperations from './tokenOperations';

class App extends Component {
  state = {
    account: '',
    balance: 0,
    tokenAddress : null
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
      factoryOperations.createFactoryInstance('0x73218674b32Be8e359ee63a4F8898F6103e79d63');
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

  // Get past events from an account
  getPastEvents = () => {
    factoryOperations.getPastEvents('TokenCreated', {
      filter: {_from: "0xcC5f6541E7Fd08f7E0969A596f32A3100590a696"},
      fromBlock: 0,
      toBlock: 'latest'
    }, function(error, events){
      for (var i = 0; i < events.length; i++) {
        console.log(events[i].returnValues);
      }
    });
  }

  // Call createToken method from TokenFactory
  createToken = (desc, srcAddresses, srcAmounts) => {
    factoryOperations.createToken(desc, srcAddresses, srcAmounts).then((result) => {
      console.log('Token created successfully');

      const tokenAddress = result.events.TokenCreated.returnValues[0];
      console.log('Token address : ' + tokenAddress);

      //this.setCurrentTokenInstance(tokenAddress)
      tokenOperations.createTokenInstance(tokenAddress);
      this.setState({
        tokenAddress : tokenAddress
      });
    }, function (err) {
      console.log('Error in sending a method' + err);
    });

  }

  increaseSupply = (srcBatches, srcAmounts, amount) => {
    tokenOperations.increaseSupply(srcBatches, srcAmounts, amount).then((result) => {
      console.log('Supply increased by ' + amount);
      console.log(result.events.AddedBatch.returnValues)
    }, function (err) {
      console.log('Error in sending a method' + err);
    });
  }

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          Active account : <b>{this.state.account}</b>
        </p>
        <p className="App-intro">
          Contract address : <b>0x73218674b32Be8e359ee63a4F8898F6103e79d63</b>
        </p>
        <p className="App-intro">
          Balance : <b>{this.state.balance}</b>
        </p>
        <p className="App-intro">
          <button onClick={this.checkBalance}>Check balance</button>
          <button onClick={this.getPastEvents}>Get Past Events</button>
        </p>
        <p className="App-intro">
          Input : <b>("wood", [ ], [ ])</b>
        </p>
        <p className="App-intro">
          Token address : <b>{ this.state.tokenAddress }</b>
        </p>
        <p className="App-intro">
          <button onClick={() => {
            // Replace hardcoded value with user input
            this.createToken('wood', [], [])
            }}>
            Create Token
          </button>
        </p>
        {
          this.state.tokenAddress ?
          <p>
            <span className="App-intro">
              Input : <b>([ ], [ ], 1)  </b>
            </span>
            <span className="App-intro">
              <button onClick={() => {
                // Replace hardcoded value with user input
                this.increaseSupply([], [], 1)
                }}>
                Increase supply
              </button>
            </span>
          </p> : null
          }
      </div>
    );
  }
}

export default App;
