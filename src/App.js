import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';

class App extends Component {
  state = {
    account: '',
    balance: 0
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
      </div>
    );
  }
}

export default App;
