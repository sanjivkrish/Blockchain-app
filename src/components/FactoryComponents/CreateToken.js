import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';

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
});

class ComposedTextField extends React.Component {
		constructor(props, context) {
			super(props, context);

			this.state = {
				data: props.pastEvents,
				desc: '',
				srcAddresses: [],
				srcAmounts: []
			};
		}
	
		// Update form elements when number of ingredients is changed
		ingredientsChanged = (event) => {
			var srcAddresses = [];
			var srcAmounts = [];

			for (var i = 0; i < event.target.value; i++) {
				if (this.state.srcAddresses.length > i) {
					srcAddresses[i] = this.state.srcAddresses[i];
					srcAmounts[i] = this.state.srcAmounts[i];
				} else {
					srcAddresses[i] = '';
					srcAmounts[i] = 1;
				}
			}

			this.setState({
				srcAddresses: srcAddresses,
				srcAmounts: srcAmounts,
			});
		}

		// Update description when user changes it
		descChanged = events => {
			this.setState({
				desc: events.target.value
			});
		}

		// Update source address when user changes it
		srcAdrChanged = props => events => {
			var srcAddresses = this.state.srcAddresses;

			srcAddresses[props] = events.target.value;

			this.setState({
				srcAddresses: srcAddresses
			});
		}

		// Update source aamount when user changes it
		srcAmtChanged = props => events => {
			// Ingredients amount can never be less than 1
			if (events.target.value < 1) {
				return;
			}

			var srcAmounts = this.state.srcAmounts;

			srcAmounts[props] = events.target.value;

			this.setState({
				srcAmounts: srcAmounts
			});
		}

		// Validate form before creating a token
		createToken = () => {
			var isValidated = true;

			if (this.state.desc !== '') {
				for (var i = 0; i < this.state.srcAddresses.length; i++) {
					if (this.state.srcAddresses[i] === '') {
						isValidated = false;
					}
				}
			} else {
				isValidated = false
			}

			if(isValidated) {
				this.props.createToken(this.state.desc, this.state.srcAddresses, this.state.srcAmounts);
			} else {
				console.log('Info missing');
			}
		}

    render() {
      const { classes } = this.props;
  
      return (
        <div>
					<div>
							<FormControl className={classes.formControl} style={{width:"40%"}}>
									<InputLabel htmlFor="desc-simple">Description</InputLabel>
									<Input id="desc-simple" value={this.state.desc} onChange={this.descChanged}/>
							</FormControl>
							<FormControl className={classes.formControl}>
									<InputLabel htmlFor="ingredients">Number of Ingredients</InputLabel>
									<Input id="ingredients" type="number" onChange={this.ingredientsChanged} />
							</FormControl>
							{
								this.state.srcAddresses.map((n, i) => {
									return (
										<div key={i}>
											<FormControl className={classes.formControl} style={{width:"40%"}}>
												<InputLabel htmlFor="age-simple">Ingredient {i+1}</InputLabel>
												<Select
													value={this.state.srcAddresses[i]}
													onChange={this.srcAdrChanged(i)}
													inputProps={{
														name: 'ingredient',
														id: 'ingredient-simple' + i,
													}}
												>
													{
														this.state.data.map((n,i) => {
															return (
																<MenuItem key={i} value={n.contractAddress}>{n.desc}</MenuItem>
															);
														})
													}
												</Select>
												<FormHelperText style={{fontSize:"0.62rem"}}>{this.state.srcAddresses[i]}</FormHelperText>
											</FormControl>
											<FormControl className={classes.formControl}>
													<InputLabel htmlFor="srcAmount-simple">Source amount {i+1}</InputLabel>
													<Input
														id="srcAmount-simple"
														type="number"
														value={this.state.srcAmounts[i]}
														onChange={this.srcAmtChanged(i)}/>
											</FormControl>
										</div>
									)
								})
							}
					</div>
					<div>
							<Button variant="raised" color="secondary" className={classes.formControl}
								onClick={this.createToken}>
									Create Token
							</Button>
					</div>
        </div>
      );
    }
  }
  
  ComposedTextField.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(ComposedTextField);