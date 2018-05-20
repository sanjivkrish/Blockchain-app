import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

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

  render() {
    const { classes } = this.props;

    return (
      <div>
				<div className={classes.container}>
					<div className={classes.containerItem}>
							<Paper className={classes.root} elevation={4}>
								<Typography variant="body1" component="h6">
									Increase Supply
								<Divider />
								</Typography>
								<Typography className={classes.inputContainer} component="div">

								</Typography>
							</Paper>
					</div>
					<div className={classes.containerItem}>
							<Paper className={classes.root} elevation={4}>
								<Typography variant="body1" component="h6">
									Barcode Generator
								<Divider />
								</Typography>
								<Typography className={classes.inputContainer} component="div">

								</Typography>
							</Paper>
					</div>
				</div>
      </div>
    );
  }
}

ComposedTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComposedTextField);
