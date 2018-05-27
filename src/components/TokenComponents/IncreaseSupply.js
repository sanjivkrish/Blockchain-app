import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import * as tokenOperations from '../../tokenOperations';
import IncreaseSupplyForm from './IncreaseSupplyComponent/IncreaseSupplyForm';
import ListIngredients from './IncreaseSupplyComponent/ListIngredients';

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
      sourceContracts : [],
      sourceContractsAmount : [],
      sourceDesc : [],
      sourceTokenList : [],
      activeToken : null,
      amount: 1,
      pastEvents : props.pastEvents
    }

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

  getSourceTokenList = () => {
    for(var i = 0; i < this.state.sourceContracts.length; i++) {
      var tokenIns = tokenOperations.getTokenInstance(this.state.sourceContracts[i]);

      // Generate list of token id's under each ingredients token
      tokenIns.getPastEvents('AddedBatch', {
        fromBlock: 0,
        toBlock: 'latest'
      }).then((events) => {
        // Insert in the order as simliar as sourceContracts
        for (var j = 0; j < this.state.sourceContracts.length; j++) {
          var arr = this.state.sourceTokenList;
          if (events.length > 0) {
            if (events[0].address === this.state.sourceContracts[j]) {
              arr[j] = events;

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
      });
    }
  };

	// Get owner of current active Token
	getSourceContracts = () => {
		tokenOperations.getSourceContracts().then((result) => {
      var sourceDesc = this.getDescFromPastEvents(result);

			this.setState({
        sourceContracts: result,
        sourceDesc: sourceDesc
      });

      this.getSourceTokenList();
		});
  };

  // Whenever user changes the amount
  amtChanged = (events) => {
    this.setState({
      amount: events.target.value
    });
  };

  // When Increase supply button is clicked
  increaseSupply = () => {
    tokenOperations.increaseSupply(this.state.sourceContracts, this.state.sourceContractsAmount, this.state.amount)
    .then((result) => {
      console.log(result);
    });
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
      <div className={classes.container}>
        <div className={classes.containerItem}>
            <Paper className={classes.root} elevation={4}>
              <Typography className={classes.inputContainer} component="div">
                <IncreaseSupplyForm
                  amount={this.state.amount}
                  amtChanged={this.amtChanged}
                  sourceContracts={this.state.sourceContracts}
                  sourceDesc={this.state.sourceDesc}
                  increaseSupply={this.increaseSupply}
                  changeActiveToken={this.changeActiveToken}>
                </IncreaseSupplyForm>
              </Typography>
            </Paper>
        </div>
        {
          this.state.activeToken == null ?
          <div></div>
          :
          <div className={classes.containerItem}>
            <ListIngredients
              activeToken={this.state.activeToken}
              sourceTokenList={this.state.sourceTokenList}>
            </ListIngredients>
          </div>
        }
      </div>
    );
  }
}

ComposedTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComposedTextField);
