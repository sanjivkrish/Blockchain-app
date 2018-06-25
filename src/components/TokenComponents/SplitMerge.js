import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListBatchesWithCheckbox from './SplitMergeComponents/ListBatchesWithCheckbox';
import * as tokenOperations from '../../tokenOperations';
import CircularProgress from '@material-ui/core/CircularProgress';
import SplitMergeForm from './SplitMergeComponents/SplitMergeForm';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    margin: theme.spacing.unit,
  },
  containerItem: {
    flexBasis: '45%',
    margin : theme.spacing.unit * 3,
  },
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginRight: 32,
    marginTop: theme.spacing.unit * 3,
  }),
  inputContainer: {
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
	},
	Qrcode: {
		paddingLeft: '30%',
	},
	button: {
		marginLeft: '35%',
		marginTop: '3%',
	},
});

class ComposedTextField extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			tokenAddress: props.tokenAddress,
			batchList: [],
			selectedBatchList: [],
			selectedBatchAmount: [],
			batchAmount: [],
      isTokenAmountLoaded: false,
      status: 'Loading...'
		};

		this.getTokens();
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
				batchList: tokenList
			});

      this.getTokenAmount();
    });
	};

	// Get amount for each batch in the product
  getTokenAmount = () => {
    var tokenIns = tokenOperations.getTokenInstance(this.state.tokenAddress);
    var batchList = this.state.batchList;
    var tokenLength = this.state.batchAmount.length;

    if (tokenLength !== batchList.length) {
      tokenIns.methods.cut(batchList[tokenLength]).call()
        .then((result) => {
					tokenIns.methods.getAvailableAmount(result[1]).call()
          .then((amt) => {
            var arr = this.state.batchAmount;
            arr[tokenLength] = parseInt(amt, 0);

            this.setState({
              batchAmount: arr
            });

            this.getTokenAmount();
          });
        });
    } else {
      this.setState({
				isTokenAmountLoaded: true
			});
    }
	}

  // gets called everytime a batch is selected by user
  batchSelected = (batchList) => {
    var selectedBatchList = [];
    var selectedBatchAmount = [];

    for (var i = 0; i < batchList.length; i++) {
      selectedBatchList.push(this.state.batchList[batchList[i]-1]);
      selectedBatchAmount.push(this.state.batchAmount[batchList[i]-1]);
    }

    this.setState({
      selectedBatchList: selectedBatchList,
      selectedBatchAmount: selectedBatchAmount
    });
	}

  // Merge batches into single batch
  mergeBatches = () => {
    var selectedBatchList = [];

    for (var i = 0; i < this.state.selectedBatchList.length; i++) {
      var tokenId = '0x' + this.state.selectedBatchList[i].slice(-24);
      selectedBatchList.push(tokenId);
    }

    this.setState({
      batchList: [],
      selectedBatchList: [],
      selectedBatchAmount: [],
      batchAmount: [],
      isTokenAmountLoaded: false,
      status: 'Merging Batches...'
    });

    tokenOperations.mergeBatches(selectedBatchList)
    .then((result) => {
      this.getTokens();
    });
  }

  // Split batch into multiple batches
  splitBatch = (splitAmount) => {
    var sum = 0;

    for (var i = 0; i < splitAmount.length; i++) {
      sum = sum + splitAmount[i];
    }

    if (sum !== this.state.selectedBatchAmount[0]) {
      console.log('invalid split values');
      return
    }

    var tokenId = '0x' + this.state.selectedBatchList[0].slice(-24);

    this.setState({
      batchList: [],
      selectedBatchList: [],
      selectedBatchAmount: [],
      batchAmount: [],
      isTokenAmountLoaded: false,
      status: 'Spliting Batches...'
    });

    tokenOperations.splitBatch(tokenId, splitAmount)
    .then((result) => {
      this.getTokens();
    });
  }

  render() {
    const { classes } = this.props;

    return (
      this.state.isTokenAmountLoaded ?
      <div className={classes.container}>
        <div className={classes.containerItem}>
          <ListBatchesWithCheckbox
            batchList={this.state.batchList}
            batchAmount={this.state.batchAmount}
            tokenDesc={this.props.tokenDesc}
            batchSelected= {this.batchSelected}>
          </ListBatchesWithCheckbox>
        </div>
        <div className={classes.containerItem}>
          <SplitMergeForm
            selectedBatchList={this.state.selectedBatchList}
            selectedBatchAmount={this.state.selectedBatchAmount}
            splitBatch={this.splitBatch}
            mergeBatches={this.mergeBatches}>
          </SplitMergeForm>
        </div>
      </div>
      :
      <div className="loading">
        <CircularProgress size={100}/>
        <div className="loadingText">{this.state.status}</div>
      </div>
    );
  }
}

ComposedTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComposedTextField);
