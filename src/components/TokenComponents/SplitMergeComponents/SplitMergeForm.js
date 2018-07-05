import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
		padding: theme.spacing.unit,
		marginRight: 32,
	},
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginRight: 16,
    marginTop: theme.spacing.unit * 3,
	}),
	container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    margin: theme.spacing.unit,
  },
  containerItem: {
    flexBasis: '100%',
    margin : theme.spacing.unit * 3,
  },
});

class ComposedTextField extends React.Component {
		constructor(props, context) {
			super(props, context);

			this.state = {
				splitedCount : 2,
				splitAmount : [1, 1]
			};
		}

		// Increase text box to get user input
		splitedCountChanged = (event) => {
			var splitAmount = [];

			if (event.target.value < 2 || event.target.value > this.props.selectedBatchAmount[0]) {
				return
			}

			for (var i = 0; i < event.target.value; i++) {
				if (this.state.splitAmount.length > i) {
					splitAmount[i] = this.state.splitAmount[i];
				} else {
					splitAmount[i] = 1;
				}
			}

			this.setState({
				splitedCount: event.target.value,
				splitAmount: splitAmount
			});
		};

		// Get user input of how it needs to be splitted
		splitAmountChanged = props => event => {
			var splitAmount = this.state.splitAmount;

			if (event.target.value < 1) {
				return
			}

			splitAmount[props] = parseInt(event.target.value, 0);

			this.setState({
				splitAmount: splitAmount
			});
		};

    render() {
      const { classes } = this.props;
  
      return (
        <div className={classes.container}>
					{
						this.props.selectedBatchList.length === 0 || (this.props.selectedBatchList.length === 1 && this.props.selectedBatchAmount[0] === 1)?
						<div>
							<div className={classes.containerItem}>
								<Button variant="raised" color="secondary" className={classes.formControl} disabled>
									Merge
								</Button>
								<Button variant="raised" color="secondary" className={classes.formControl} disabled>
									Split
								</Button>
							</div>
						</div>
						:
						this.props.selectedBatchList.length === 1 ?
						<div>
							<div className={classes.containerItem}>
								<Button variant="raised" color="secondary" className={classes.formControl} disabled>
									Merge
								</Button>
								<Button variant="raised" color="secondary" className={classes.formControl} onClick={() => {this.props.splitBatch(this.state.splitAmount)}}>
									Split
								</Button>
							</div>
							<div className={classes.containerItem}>
								<FormControl className={classes.formControl}>
									<InputLabel htmlFor="srcAmount-simple">Split into</InputLabel>
									<Input
										id="srcAmount-simple"
										type="number"
										value={this.state.splitedCount}
										onChange={this.splitedCountChanged}/>
								</FormControl>
								{
									this.state.splitAmount.map((n, i) => {
										return (
											<div key={i}>
												<FormControl className={classes.formControl}>
													<InputLabel htmlFor="srcAmount-simple">Batch {i+1}</InputLabel>
													<Input
														id="srcAmount-simple"
														type="number"
														value={this.state.splitAmount[i]}
														onChange={this.splitAmountChanged(i)}/>
												</FormControl>
											</div>
										);
									})
								}
							</div>
						</div>
						:
						<div>
							<div className={classes.containerItem}>
								<Button variant="raised" color="secondary" className={classes.formControl} onClick={this.props.mergeBatches}>
									Merge
								</Button>
								<Button variant="raised" color="secondary" className={classes.formControl} disabled>
									Split
								</Button>
							</div>
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