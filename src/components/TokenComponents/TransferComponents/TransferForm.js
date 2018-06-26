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
				senderAddress : ''
			};
		}

		// Update sender address
		senderAddressChanged = (event) => {
			if (event.target.value === '') {
				return
			}

			this.setState({
				senderAddress: event.target.value
			});
		};

    render() {
      const { classes } = this.props;
  
      return (
        <div className={classes.container}>
					{
						this.props.selectedBatchList.length === 0 ?
						<div className={classes.containerItem}>
							<FormControl className={classes.formControl} style={{width:"80%"}} disabled>
								<InputLabel htmlFor="sendAddr-simple">Send to</InputLabel>
								<Input
									id="sendAddr-simple"
									type="string"
									value={this.state.senderAddress}
									onChange={this.senderAddressChanged}/>
							</FormControl>
							<Button variant="raised" color="secondary" className={classes.formControl} disabled>
								Transfer
							</Button>
						</div>
						:
						<div className={classes.containerItem}>
							<FormControl className={classes.formControl} style={{width:"80%"}}>
								<InputLabel htmlFor="sendAddr-simple">Send to</InputLabel>
								<Input
									id="sendAddr-simple"
									type="string"
									value={this.state.senderAddress}
									onChange={this.senderAddressChanged}/>
							</FormControl>
							<Button variant="raised" color="secondary" className={classes.formControl}>
								Transfer
							</Button>
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