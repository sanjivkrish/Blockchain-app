import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

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
				amount: 1
			};
		}

    render() {
			const { classes } = this.props;

      return (
        <div>
					<div>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="amt-simple">Amount</InputLabel>
							<Input id="amt-simple" type="number" value={this.props.amount} onChange={this.props.amtChanged}/>
						</FormControl>
					</div>
					{
						this.props.sourceContracts.map((srcAddr, i) => {
							return (
								<div key={i}>
									<FormControl className={classes.formControl} onClick={() => {this.props.changeActiveToken(i)}}>
										<InputLabel htmlFor="srcAddress-simple">{this.props.sourceDesc[i]}</InputLabel>
										<Input id="srcAddress-simple"	type="text"/>
									</FormControl>
									<FormControl className={classes.formControl}>
										<InputLabel htmlFor="srcAmount-simple">Amount</InputLabel>
										<Input id="srcAmount-simple" type="number"/>
									</FormControl>
							</div>
							)
						})
					}
					<div>
						<Button variant="raised" color="secondary" className={classes.formControl} onClick={this.props.increaseSupply}>
							Increase Supply
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