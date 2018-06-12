import React from 'react';
import ListTokens from './FactoryComponents/ListTokens';
import CreateToken from './FactoryComponents/CreateToken';
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
      <div className={classes.container}>
        <div className={classes.containerItem}>
            <Paper className={classes.root} elevation={4}>
              <Typography variant="body1" component="h6">
                Create a contract for new product
              <Divider />
              </Typography>
              <Typography className={classes.inputContainer} component="div">
                <CreateToken createToken={this.props.createToken} pastEvents={this.props.pastEvents}>
                </CreateToken>
              </Typography>
            </Paper>
        </div>
        <div className={classes.containerItem}>
          <ListTokens
            pastEvents={this.props.pastEvents}
            setTokenAddress={this.props.setTokenAddress}>
          </ListTokens>
        </div>
      </div>
    );
  }
}

ComposedTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ComposedTextField);
