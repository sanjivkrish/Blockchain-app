import React, { Component } from 'react';
import './App.css';
import Web3 from 'web3';
import * as factoryOperations from './factoryOperations';
import * as tokenOperations from './tokenOperations';
import AppBar from './components/AppBar';
import FactoryManager from './components/FactoryManager';
import TokenManager from './components/TokenManager';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialogs from './components/Dialogs';
import PrintProvider, { NoPrint } from 'react-easy-print';
import Snackbar from '@material-ui/core/Snackbar';

class App extends Component {
  state = {
    account: null,
    balance: 0,
    tokenAddress : null,
    tokenDesc : null,
    isPastEventsLoaded : false,
    isAccountFound : false,
    pastEvents: [],
    statusMessage: "Initializing",
    snackbarOpen : false,
    snackbarText : ""
  };

  constructor (props) {
    super(props)

    // Initialise web3
    if (typeof web3 !== 'undefined') {
      console.log('Using current provider');
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log('No Web3 Detected...');

        this.state.account = 0;
    }

    if (typeof web3 !== 'undefined') {
      // Retreive User account info
      window.web3.eth.getAccounts((err, accs) => {
        if (err != null) {
          console.log('Error fetching your accounts');
          this.setState({
            account: 0
          })
          return
        }

        if (accs.length === 0) {
          console.log('No accounts found');
          this.setState({
            account: 0
          })
          return
        }

        window.web3.eth.defaultAccount = accs[0];
        this.setState({
          account: accs[0],
          isAccountFound: true
        })

        // Update Balance of the user
        this.checkBalance();

        // Create instance of a factory contract
        factoryOperations.createFactoryInstance('0x6E27510C7991CA02B5e5060b8BA0aaEf27Cda2A1');

        // Update past tokens created by user
        this.getPastEvents();
      });
    }
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
      fromBlock: 0,
      toBlock: 'latest'
    }).then((events) => {
      var pastEvents = [];
      var tokenDescList = {};

      // Update past events info
      for (var i = (events.length-1) ; i >= 0; i--) {
        tokenDescList[events[i].returnValues[0].toLowerCase()] = events[i].returnValues[1];

        // Use current user's token
        if (events[i].returnValues[2] === this.state.account) {
          pastEvents.push({
            id : pastEvents.length+1,
            contractAddress : events[i].returnValues[0],
            desc : events[i].returnValues[1]
          });
        }
      }

      // Set description of tokens
      factoryOperations.setDesc(tokenDescList);

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
      isPastEventsLoaded : false,
      statusMessage : "Creating New Product..."
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
        tokenDesc : desc,
        snackbarText : 'New token contract created : ' + desc,
        snackbarOpen : true
      });
    }, function (err) {
      console.log('Error in sending a method' + err);
    });

  }

   // Close snackbar
   handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbarOpen: false });
  };

  // Allow child to update token info using setTokenAddress
  setTokenAddress = (tokenAddress, desc) => {
    if (tokenAddress) {
      tokenOperations.createTokenInstance(tokenAddress);
      this.setState({
        tokenAddress : tokenAddress,
        tokenDesc : desc,
        snackbarText : 'Selected token contract : ' + desc,
        snackbarOpen : true
      });
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
        <PrintProvider>
          <NoPrint>
        { (this.state.isAccountFound && this.state.isPastEventsLoaded) ?
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
                <FactoryManager
                  createToken={this.createToken}
                  pastEvents={this.state.pastEvents}
                  setTokenAddress={this.setTokenAddress}>
                </FactoryManager>
                :
                <TokenManager
                  tokenAddress={this.state.tokenAddress}
                  tokenDesc={this.state.tokenDesc}
                  pastEvents={this.state.pastEvents}>
                </TokenManager>
            }
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={this.state.snackbarOpen}
              autoHideDuration={6000}
              onClose={this.handleClose}
              ContentProps={{
                'aria-describedby': 'message-id',
              }}
              message={<span id="message-id">{this.state.snackbarText}</span>}
            />
          </div>
          :
          this.state.account === 0 ?
          <Dialogs></Dialogs>
          :
          <div className="loading">
            <CircularProgress size={100}/>
            <div className="loadingText">{this.state.statusMessage}</div>
          </div>
        }
          </NoPrint>
        </PrintProvider>
      </div>
    );
  }
}

export default App;
