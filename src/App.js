import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import * as factoryOperations from './factoryOperations';
import * as tokenOperations from './tokenOperations';
import AppBar from './components/AppBar';
import FactoryManager from './components/FactoryManager';
import TokenManager from './components/TokenManager';
import MDSpinner from 'react-md-spinner';


class App extends Component {
  state = {
    account: null,
    balance: 0,
    tokenAddress : null,
    tokenDesc : null,
    isPastEventsLoaded : false,
    pastEvents: []
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

    // Retreive User account info
    window.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        console.log('Error fetching your accounts');
        return
      }

      if (accs.length === 0) {
        console.log('No accounts found');
        return
      }

      window.web3.eth.defaultAccount = accs[0];
      this.setState({
        account: accs[0]
      })

      // Update Balance of the user
      this.checkBalance();

      // Create instance of a factory contract
      factoryOperations.createFactoryInstance('0x73218674b32Be8e359ee63a4F8898F6103e79d63');

      // Update past tokens created by user
      this.getPastEvents();
    });
  }

  // Get balance from the default account
  checkBalance = () => {
    window.web3.eth.getBalance(window.web3.eth.defaultAccount, (error, wei) => {
      if (!error) {
          var balance = window.web3.utils.fromWei(wei, 'ether');
          balance = parseFloat(balance).toFixed(2);

          this.setState({
            balance : balance
          })
      } else {
        console.log('Issue with getBalance()');
      }
    });
  }

  // Get past events from an account
  getPastEvents = () => {
    factoryOperations.getPastEvents('TokenCreated', {
      filter: {_from: this.state.account},
      fromBlock: 0,
      toBlock: 'latest'
    }).then((events) => {
      var pastEvents = [];

      // Update past events info
      for (var i = (events.length-1) ; i > 0; i--) {
        pastEvents.push({
          id : i,
          contractAddress : events[i].returnValues[0],
          desc : events[i].returnValues[1]
        });
      }

      this.setState({
        isPastEventsLoaded : true,
        pastEvents : pastEvents
      });
    })
  }

  // Call createToken method from TokenFactory
  createToken = (desc, srcAddresses, srcAmounts) => {
    // Freeze UI until token is created
    this.setState({
      isPastEventsLoaded : false
    });

    factoryOperations.createToken(desc, srcAddresses, srcAmounts).then((result) => {
      console.log('Token created successfully');

      const tokenAddress = result.events.TokenCreated.returnValues[0];

      // Create instance of newly created token
      tokenOperations.createTokenInstance(tokenAddress);

      // Update past events to include current token
      this.getPastEvents();

      this.setState({
        tokenAddress : tokenAddress,
        tokenDesc : desc
      });
    }, function (err) {
      console.log('Error in sending a method' + err);
    });

  }

  // Allow child to update token info using setTokenAddress
  setTokenAddress = (tokenAddress, desc) => {
    if (tokenAddress) {
      tokenOperations.createTokenInstance(tokenAddress);
      this.setState({
        tokenAddress : tokenAddress,
        tokenDesc : desc
      });

      console.log('Token Instance Created', tokenAddress);
    } else {
      this.setState({
        tokenAddress : null,
        tokenDesc : null
      });
    }
  }

  render() {
    return (
      <div>
        { this.state.account ?
          <div>
            <AppBar
              tokenAddress={this.state.tokenAddress}
              tokenDesc={this.state.tokenDesc}
              accAddress={this.state.account}
              accBalance={this.state.balance}
              setTokenAddress={this.setTokenAddress}>
            </AppBar>
            {
              this.state.tokenAddress == null ?
                (
                  this.state.isPastEventsLoaded ?
                  <FactoryManager
                    createToken={this.createToken}
                    pastEvents={this.state.pastEvents}
                    setTokenAddress={this.setTokenAddress}>
                  </FactoryManager>
                  :
                 <MDSpinner className="spinner" size={100} duration={2000}></MDSpinner>

                )
                :
                <TokenManager>
                </TokenManager>
            }
          </div>
          :
          <div>No account found</div>
        }
      </div>
    );
  }
}

export default App;
