import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListBatchesWithCheckbox from './SplitMergeComponents/ListBatchesWithCheckbox';
import QRCodeGenerator  from 'qrcode.react';
import * as tokenOperations from '../../tokenOperations';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import PrintProvider, { Print } from 'react-easy-print';

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
			batchAmount: [],
      activeBatch: null,
      isTokenAmountLoaded: false
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

			if (tokenList.length > 0) {
				this.setState({
					activeBatch: tokenList[0]
				});
			}

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

	setActiveBatch = (idx) => {
		this.setState({
			activeBatch : this.state.batchList[idx]
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
							setActiveBatch= {this.setActiveBatch}>
						</ListBatchesWithCheckbox>
        </div>
        <div className={classes.containerItem}>
        </div>
      </div>
      :
      <div className="loading">
        <CircularProgress size={100}/>
        <div className="loadingText">Loading...</div>
      </div>
    );
  }
}

ComposedTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComposedTextField);
