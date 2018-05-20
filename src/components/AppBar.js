import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  icon: {
    margin: 4,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

function ButtonAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
            SCBC
          </Typography>
          { props.tokenAddress ?
            <Typography variant="title" color="inherit" className={classes.flex}>
              <Button color="inherit" onClick={() => {props.setTokenAddress(null)}}>
                {props.tokenDesc}
                <Icon className={classes.icon} style={{ fontSize: 16 }}>
                  edit_circle
                </Icon>
              </Button>
            </Typography>
            :
            <div></div>
          }
          <Button color="inherit">Acc : {('' + props.accAddress + '').substring(0, 6)+'...'}</Button>
          <Button color="inherit">Bal : {props.accBalance}</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);