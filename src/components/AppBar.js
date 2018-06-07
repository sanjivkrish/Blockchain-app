import React from 'react';
import logo from '../scbc.png';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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
  title: {
    fontSize: '1rem',
    marginLeft: '10%',
  },
};

function ButtonAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="title" color="inherit" className={classes.flex}>
          <div className='logo'>
            <Button color="inherit" onClick={() => {props.setTokenAddress(null)}}>
              <img src={logo} width='95' height='75' alt=''/>
            </Button>
          </div>
          </Typography>
          { props.tokenAddress ?
            <Typography variant="title" color="inherit" className={classes.flex}>
              <span className={classes.title}>
                {props.tokenDesc.toUpperCase()}
              </span>
            </Typography>
            :
            <div></div>
          }
          <div>
            <Button color="inherit">Acc : {('' + props.accAddress + '').substring(0, 6)+'...'}</Button>
            <Button color="inherit">Bal : {props.accBalance}</Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);