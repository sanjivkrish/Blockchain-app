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
      approvedSourceContracts : 0,
      existingTokenList : [],
      activeToken : null,
      amount: 1,
      sourceTokens : [],
      sourceTokenAmounts : [],
      pastEvents : props.pastEvents,
      isSourceTokenLoaded : false
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

  getTokens = () => {
    var tokenIns = tokenOperations.getTokenInstance(this.state.tokenAddress);

    // Generate list of token id's under each ingredients token
    tokenIns.getPastEvents('Transfer', {
      fromBlock: 0,
      toBlock: 'latest'
    }).then((events) => {
      var tokenList = tokenOperations.getTokens(events);

      this.setState({
        existingTokenList: tokenList
      });
    });
  };

  getSourceTokenList = () => {
    for(var i = 0; i < this.state.sourceContracts.length; i++) {
      var tokenIns = tokenOperations.getTokenInstance(this.state.sourceContracts[i]);

      // Generate list of token id's under each ingredients token
      tokenIns.getPastEvents('Transfer', {
        fromBlock: 0,
        toBlock: 'latest'
      }).then((events) => {
        var tokenList = tokenOperations.getTokens(events);

        // Insert in the order as simliar as sourceContracts
        for (var j = 0; j < this.state.sourceContracts.length; j++) {
          var arr = this.state.sourceTokenList;

          if (events.length > 0) {
            if (events[0].address === this.state.sourceContracts[j]) {
              arr[j] = tokenList;

              this.setState({
                sourceTokenList: arr
              });
            }
          } else {
              arr[j] = [];

              this.setState({
                sourceTokenList: arr
              });
          }
        }

        this.setState({
          isSourceTokenLoaded: true
        });
      });
    }
  };

	// Get owner of current active Token
	getSourceContracts = () => {
		tokenOperations.getSourceContracts().then((result) => {
      var sourceDesc = this.getDescFromPastEvents(result);
      var sourceTokens = Array(sourceDesc.length).fill('');
      var sourceTokenAmounts = Array(sourceDesc.length).fill(1);

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
      this.setState({
        isSourceTokenLoaded : false
      });

      // Check whether all the source contracts are approved
      if (this.state.approvedSourceContracts === this.state.sourceTokens.length) {
        tokenOperations.increaseSupply(this.state.sourceTokens, this.state.sourceTokenAmounts, this.state.amount)
        .then((result) => {
          this.setState({
            approvedSourceContracts: 0
          });

          this.getTokens();
          this.getSourceContracts();
        });
      } else {
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
        this.state.isSourceTokenLoaded ?
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
                title={"Exisiting Tokens - " + this.state.tokenDesc.toUpperCase()}
                sourceTokenList={this.state.existingTokenList}>
              </ListIngredients>
            </div>
            :
            <div className={classes.containerItem}>
              <ListIngredients
                title={"Exisiting Tokens - " + this.state.sourceDesc[this.state.activeToken].toUpperCase()}
                sourceTokenList={this.state.sourceTokenList[this.state.activeToken]}>
              </ListIngredients>
            </div>
          }
        </div>
        :
        <CircularProgress className="loading" size={100}/>
    );
  }
}

ComposedTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComposedTextField);
