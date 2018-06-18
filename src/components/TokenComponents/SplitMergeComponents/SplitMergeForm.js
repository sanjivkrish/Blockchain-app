import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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
				
			};
		}

    render() {
      const { classes } = this.props;
  
      return (
        <div className={classes.container}>
					{
						this.props.selectedBatchList.length === 0 ?
						<div>
							<div className={classes.containerItem}>
								<Button variant="raised" color="secondary" className={classes.formControl} disabled>
									Split
								</Button>
							</div>
							<div className={classes.containerItem}>
								<Button variant="raised" color="secondary" className={classes.formControl} disabled>
									Merge
								</Button>
							</div>
						</div>
						:
						this.props.selectedBatchList.length === 1 ?
						<div>
							<div className={classes.containerItem}>
								<Button variant="raised" color="secondary" className={classes.formControl}>
									Split
								</Button>
							</div>
							<div className={classes.containerItem}>
								<Button variant="raised" color="secondary" className={classes.formControl} disabled>
									Merge
								</Button>
							</div>
						</div>
						:
						<div>
							<div className={classes.containerItem}>
								<Button variant="raised" color="secondary" className={classes.formControl} disabled>
									Split
								</Button>
							</div>
							<div className={classes.containerItem}>
								<Button variant="raised" color="secondary" className={classes.formControl} onClick={this.props.mergeBatches}>
									Merge
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