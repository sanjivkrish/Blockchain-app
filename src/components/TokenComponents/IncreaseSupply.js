import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import * as tokenOperations from '../../tokenOperations';
import IncreaseSupplyForm from './IncreaseSupplyComponent/IncreaseSupplyForm';
import ListIngredients from './IncreaseSupplyComponent/ListIngredients';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    margin: theme.spacing.unit,
  },
  containerItem: {
    flexBasis: '50%',
  },
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginRight: 32,
    marginTop: theme.spacing.unit * 3,
  }),
  inputContainer: {
    paddingTop: 8,
    paddingBottom: 8,
  },
});

class ComposedTextField extends React.Component {

	constructor (props) {
    super(props);

    this.state = {
      tokenAddress : props.tokenAddress,
      tokenDesc : props.tokenDesc,
      sourceContracts : [],
      sourceContractsAmount : [],
      sourceDesc : [],
      sourceTokenList : [],
      existingSrcTokenAmountList : [],
      approvedSourceContracts : 0,
      existingTokenList : [],
      activeToken : null,
      amount: 1,
      sourceTokens : [],
      sourceTokenAmounts : [],
      pastEvents : props.pastEvents,
      isSourceTokenLoaded : false,
      isSourceTokenAmountLoaded : false,
      statusMessage : "Loading..."
    }

		this.getTokens();
		this.getSourceContracts();
	}

  // Generate description of each token
  getDescFromPastEvents = (result) => {
    var desc = [];

    for (var i = 0; i < result.length; i++) {
      for (var j = 0; j < this.state.pastEvents.length; j++) {
        if (result[i] === this.state.pastEvents[j].contractAddress) {
          desc.push(this.state.pastEvents[j].desc);
        }
      }
    }

    return desc;
  };

  // Get amount for each batch in the product
  getTokenAmonut = () => {
    var tokenIns = tokenOperations.getTokenInstance(this.state.tokenAddress);
    var tokenList = this.state.existingTokenList;
    var tokenLength = this.state.existingTokenAmountList.length;

    if (tokenLength !== tokenList.length) {
      tokenIns.methods.cut(tokenList[tokenLength]).call()
        .then((result) => {
          tokenOperations.getAvailableAmount(result[1])
          .then((amt) => {
            var arr = this.state.existingTokenAmountList;
            arr[tokenLength] = parseInt(amt, 0);

            this.setState({
              existingTokenAmountList: arr
            });

            this.getTokenAmonut();
          });
        });
    } else {
      this.setState({
        isSourceTokenAmountLoaded: true
      });
    }
  }

  // Get list of tokens for each source contract
  getTokens = () => {
    var tokenIns = tokenOperations.getTokenInstance(this.state.tokenAddress);

    // Generate list of token id's under each ingredients token
    tokenIns.getPastEvents('Transfer', {
      fromBlock: 0,
      toBlock: 'latest'
    }).then((events) => {
      var tokenList = tokenOperations.getTokens(events);

      this.setState({
        existingTokenList: tokenList,
        isSourceTokenAmountLoaded: false,
        existingTokenAmountList: []
      });

      this.getTokenAmonut();
    });
  };

  // Get available amount for each source contract
  getBatchAmount = (srcTokenIdx, batchIdx) => {
    var tokenIns = tokenOperations.getTokenInstance(this.state.sourceContracts[srcTokenIdx]);
    var srcBatchList = this.state.sourceTokenList[srcTokenIdx];

    tokenIns.methods.cut(srcBatchList[batchIdx]).call()
    .then((result) => {
      tokenIns.methods.getAvailableAmount(result[1]).call()
      .then((amt) => {
        var arr = this.state.existingSrcTokenAmountList;
        arr[srcTokenIdx][batchIdx] = parseInt(amt, 0);

        this.setState({
          existingSrcTokenAmountList: arr
        });

        this.getSrcContractTokenAmount();
      });
    });
  };

  // Get amount for each batch in the source contract
  getSrcContractTokenAmount = () => {
    var srcTokenAmtList = this.state.existingSrcTokenAmountList;
    var srcTokenIdx = 0;
    var batchIdx = 0;
    var isValidated = false;

    for (var i = 0; i < srcTokenAmtList.length; i++) {
      for (var j = 0; j < srcTokenAmtList[i].length; j++) {
        if (srcTokenAmtList[i][j] === 'NA') {
          isValidated = true;
          srcTokenIdx = i;
          batchIdx = j;
        }
      }
    }

    if(isValidated) {
      this.getBatchAmount(srcTokenIdx, batchIdx);
    } else {
      this.setState({
        isSourceTokenLoaded: true
      });
    }

  }

  // Get list of tokens available for each source contract
  getSourceTokenList = () => {
    for(var i = 0; i < this.state.sourceContracts.length; i++) {
      var tokenIns = tokenOperations.getTokenInstance(this.state.sourceContracts[i]);

      // Generate list of token id's under each ingredients token
      tokenIns.getPastEvents('Transfer', {
        fromBlock: 0,
        toBlock: 'latest'
      }).then((events) => {
        var tokenList = tokenOperations.getTokens(events);
        var isValidated = true;

        // Insert in the order as simliar as sourceContracts
        for (var j = 0; j < this.state.sourceContracts.length; j++) {
          var srcTokenList = this.state.sourceTokenList;
          var srcTokenAmtList = this.state.existingSrcTokenAmountList;

          if (events.length > 0) {
            if (events[0].address === this.state.sourceContracts[j]) {
              srcTokenList[j] = tokenList;
              srcTokenAmtList[j] = Array(tokenList.length).fill('NA');

              this.setState({
                sourceTokenList: srcTokenList,
                existingSrcTokenAmountList: srcTokenAmtList,
              });
            }
          } else {
            srcTokenList[j] = [];
            srcTokenAmtList[j] = [];

            this.setState({
              sourceTokenList: srcTokenList,
              existingSrcTokenAmountList: srcTokenAmtList
            });
          }
        }

        for (var k = 0; k < this.state.sourceTokenList.length; k++) {
          if (this.state.sourceTokenList[k] === undefined) {
            isValidated = false;
          }
        }

        if (isValidated) {
          this.getSrcContractTokenAmount();
        }
      });
    }
  };

	// Get owner of current active Token
	getSourceContracts = () => {
    tokenOperations.getSourceContracts().then((result) => {
      tokenOperations.getSourceAmounts().then((srcAmt) => {
        var sourceDesc = this.getDescFromPastEvents(result);
        var sourceTokens = Array(sourceDesc.length).fill('');
        var sourceTokenAmounts = srcAmt;

        this.setState({
          sourceContracts: result,
          sourceDesc: sourceDesc,
          sourceTokens: sourceTokens,
          sourceTokenAmounts: sourceTokenAmounts
        });

        if (result.length === 0) {
          this.setState({
            isSourceTokenLoaded: true
          });
        } else {
          this.getSourceTokenList();
        }
      });
		});
  };

  // Whenever user changes the amount
  amtChanged = (events) => {
    this.setState({
      amount: events.target.value
    });
  };

  // Whenever user changes the source token
  srcTokenChanged = props => (events) => {
    var sourceTokens = this.state.sourceTokens;

    sourceTokens[props] = events.target.value;

    this.setState({
      sourceTokens: sourceTokens
    });
  };

  // Whenever user changes the source token amount
  srcTokenAmtChanged = props => (events) => {
    var sourceTokenAmounts = this.state.sourceTokenAmounts;

    sourceTokenAmounts[props] = parseInt(events.target.value, 0);

    this.setState({
      sourceTokenAmounts: sourceTokenAmounts
    });
  };

  // Check whether Token contract is allowed to use its token
  isAllowed = (tokenIns, id) => {
    tokenIns.methods.allowed(id, this.state.tokenAddress).call()
    .then((isAllowed) => {
      if (isAllowed) {
        var approvedSourceContracts = this.state.approvedSourceContracts + 1;

        this.setState({
          approvedSourceContracts: approvedSourceContracts
        });

        this.increaseSupply();
      } else {
        this.setState({
          statusMessage : "Providing permission..."
        });

        this.approveTokenContract(tokenIns, id);
      }
    });
  };

  // Source contract must approve token contract to use its token
  approveTokenContract = (tokenIns, id) => {
    tokenIns.methods.approve(this.state.tokenAddress, id).send()
    .then((isApproved) => {
      if (isApproved) {
        var approvedSourceContracts = this.state.approvedSourceContracts + 1;

        this.setState({
          approvedSourceContracts: approvedSourceContracts
        });

        // Iterate increaseSupply till it succeed
        this.increaseSupply();
      } else {
        console.log('Approval failed');
      }
    })
  };

  // When Increase supply button is clicked
  increaseSupply = () => {
    var isValidated = true;

    if (this.state.amount > 0) {
      for (var i = 0; i < this.state.sourceTokens.length; i++) {
        if ((this.state.sourceTokens[i] === '') || (this.state.sourceTokenAmounts[i] <= 0)) {
          isValidated = false;
        }
      }
    } else {
      isValidated = false
    }

    if(isValidated) {

      // Check whether all the source contracts are approved
      if (this.state.approvedSourceContracts === this.state.sourceTokens.length) {
        this.setState({
          isSourceTokenLoaded : false,
          statusMessage : "Increasing supply..."
        });
        tokenOperations.increaseSupply(this.state.sourceTokens, this.state.sourceTokenAmounts, this.state.amount)
        .then((result) => {
          this.setState({
            approvedSourceContracts: 0
          });

          this.getTokens();
          this.getSourceContracts();
        });
      } else {
        this.setState({
          isSourceTokenLoaded : false,
          statusMessage : "Validating permission..."
        });
        var tokenIns = tokenOperations.getTokenInstance(this.state.sourceContracts[this.state.approvedSourceContracts]);

        // Use cut funtion to get 12 bytes tokenID
        tokenIns.methods.cut(this.state.sourceTokens[this.state.approvedSourceContracts]).call()
        .then((result) => {
          this.isAllowed(tokenIns, result[1]);
        });
      }
    }
  }

  // When user clicks on ingredient list
  changeActiveToken = (activeToken) => {
    this.setState({
      activeToken
    });
  }

  render() {
    const { classes } = this.props;

    return (
        this.state.isSourceTokenLoaded && this.state.isSourceTokenAmountLoaded ?
        <div className={classes.container}>
          <div className={classes.containerItem} onClick={() => {this.changeActiveToken(null)}}>
              <Paper className={classes.root} elevation={4}>
                <Typography className={classes.inputContainer} component="div">
                  <IncreaseSupplyForm
                    amount={this.state.amount}
                    amtChanged={this.amtChanged}
                    sourceContracts={this.state.sourceContracts}
                    sourceDesc={this.state.sourceDesc}
                    increaseSupply={this.increaseSupply}
                    changeActiveToken={this.changeActiveToken}
                    sourceTokens={this.state.sourceTokens}
                    sourceTokenAmounts={this.state.sourceTokenAmounts}
                    srcTokenChanged={this.srcTokenChanged}
                    srcTokenAmtChanged={this.srcTokenAmtChanged}>
                  </IncreaseSupplyForm>
                </Typography>
              </Paper>
          </div>
          {
            this.state.activeToken == null ?
            <div className={classes.containerItem}>
              <ListIngredients
                title={"Batch ID - " + this.state.tokenDesc.toUpperCase()}
                sourceTokenList={this.state.existingTokenList}
                existingTokenAmountList={this.state.existingTokenAmountList}>
              </ListIngredients>
            </div>
            :
            <div className={classes.containerItem}>
              <ListIngredients
                title={"Exisiting Tokens - " + this.state.sourceDesc[this.state.activeToken].toUpperCase()}
                sourceTokenList={this.state.sourceTokenList[this.state.activeToken]}
                existingTokenAmountList={this.state.existingSrcTokenAmountList[this.state.activeToken]}>
              </ListIngredients>
            </div>
          }
        </div>
        :
        <div className="loading">
          <CircularProgress size={100}/>
          <div className="loadingText">{this.state.statusMessage}</div>
        </div>
    );
  }
}

ComposedTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComposedTextField);
