import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ContractInfo from './TokenComponents/ContractInfo';
import IncreaseSupply from './TokenComponents/IncreaseSupply';
import Barcode from './TokenComponents/Barcode.js';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = {
  root: {
    flexGrow: 1,
  },
};

class CenteredTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <Paper className={classes.root}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Increase Supply" />
          <Tab label="Transfer" />
          <Tab label="Split/Merge" />
          <Tab label="Barcode" />
          <Tab label="Contract Info" />
        </Tabs>
        {value === 0 && <TabContainer>
            <IncreaseSupply pastEvents={this.props.pastEvents} tokenAddress={this.props.tokenAddress} tokenDesc={this.props.tokenDesc}></IncreaseSupply>
          </TabContainer>}
        {value === 1 && <TabContainer>Item Two</TabContainer>}
        {value === 2 && <TabContainer>Item Three</TabContainer>}
        {value === 3 && <TabContainer><Barcode tokenAddress={this.props.tokenAddress}></Barcode></TabContainer>}
        {value === 4 && <TabContainer><ContractInfo></ContractInfo></TabContainer>}
      </Paper>
    );
  }
}

CenteredTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CenteredTabs);
