import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import * as tokenOperations from '../../tokenOperations';
import * as factoryOperations from '../../factoryOperations';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Icon from '@material-ui/core/Icon';
import Dialog from '@material-ui/core/Dialog';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  rightIcon: {
    marginRight: theme.spacing.unit,
  },
  appBar: {
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  highlightRow: {
    backgroundColor: 'rgba(0,0,0,0.26)',
  },
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class CustomPaginationActionsTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: props.batchList,
      page: 0,
      rowsPerPage: 5,
      open: false,
      counter: null,
      nodeStructure: {},
      isGraphLoaded: false,
      treant : null,
      config: []
    };
  }

  // Generate tree of ingredients for an input element using recursive stratergy
  populateTree = (tokenID) => {
    var contract = tokenID.slice(0, -24);
    var tokenInstance = tokenOperations.getTokenInstance(contract);

    tokenInstance.getPastEvents('AddedBatch', {
      fromBlock: 0,
      toBlock: 'latest'
    }).then((events) => {
      for (var i = 0; i < events.length; i++) {
        if (tokenID === events[i].returnValues[0]) {
          // Get description of all products
          var tokenDesc = factoryOperations.getDesc();

          // Recure 'populateTree()' with its source batches
          for (var j = 0; j < events[i].returnValues[1].length; j++) {
            var config = this.state.config;
            var nodeStructure = this.state.nodeStructure;

            nodeStructure[events[i].returnValues[1][j]] = {
              parent: nodeStructure[tokenID],
              text: {
                name: tokenDesc[events[i].returnValues[1][j].slice(0, -24)],
                desc: '0x...'+events[i].returnValues[1][j].slice(-24)
              }
            };

            config.push(nodeStructure[events[i].returnValues[1][j]])

            this.setState({
              counter: this.state.counter+1,
              nodeStructure: nodeStructure,
              config: config
            });
          }

          // Decrease counter on every source batch identification
          this.setState({
            counter: this.state.counter-1
          });

          // Generate graph when all the elements are listed
          if (this.state.counter === 0) {
            this.setState({
              isGraphLoaded : true
            });

            var treant = new window.Treant(this.state.config);
          } else {
            for (j = 0; j < events[i].returnValues[1].length; j++) {
              this.populateTree(events[i].returnValues[1][j]);
            }
          }
        }
      }
    });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleClickOpen = (value) => {
    var tokenID = this.state.data[value];
    var nodeStructure = {};
    var config = [{
      container: "#treesimple",
      node: {
        HTMLclass: 'nodeExample1'
      }
    }];

    nodeStructure[tokenID] = {
      text: {
        name: this.props.tokenDesc,
        desc: '0x...'+tokenID.slice(-24)
      }
    };

    config.push(nodeStructure[tokenID])

    this.setState({
      counter: 1,
      config: config,
      nodeStructure: nodeStructure,
      isGraphLoaded : false
    });

    this.populateTree(tokenID);

    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const { rowsPerPage, page } = this.state;
    const data = this.props.batchList;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>{(this.props.tokenDesc)} - Batch ID's</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n,i) => {
                return (
                  this.props.activeBatch === n ?
                  <TableRow key={i} className={classes.highlightRow} style={{cursor: 'pointer'}} onClick={() => {this.props.setActiveBatch(i)}}>
                    <TableCell style={{fontSize: 10}} component="th" scope="row">
                      <Icon className={classes.rightIcon} style={{ fontSize: 16 }} onClick={() => {this.handleClickOpen(i)}}>info</Icon>
                      <span>{n}</span>
                    </TableCell>
                    <TableCell numeric>{this.props.batchAmount[i]}</TableCell>
                  </TableRow>
                  :
                  <TableRow key={i} style={{cursor: 'pointer'}} onClick={() => {this.props.setActiveBatch(i)}}>
                    <TableCell style={{fontSize: 10}} component="th" scope="row">
                      <Icon className={classes.rightIcon} style={{ fontSize: 16 }} onClick={() => {this.handleClickOpen(i)}}>info</Icon>
                      <span>{n}</span>
                    </TableCell>
                    <TableCell numeric>{this.props.batchAmount[i]}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActionsWrapped}
                />
              </TableRow>
            </TableFooter>
          </Table>
          <Dialog
            fullScreen
            open={this.state.open}
            onClose={this.handleClose}
            TransitionComponent={Transition}
          >
            <AppBar className={classes.appBar}>
              <Toolbar>
                <Typography variant="title" color="inherit" className={classes.flex}>
                  {this.props.tokenDesc}
                </Typography>
                <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            {
              this.state.isGraphLoaded ?
              <List>
                <ListItem>
                  <div id="treesimple" ref="treesimple" style={{width:"100%",height:"100%"}}> </div>
                </ListItem>
              </List>
              :
              <div>
                Loading...
              </div>
            }
          </Dialog>
        </div>
      </Paper>
    );
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomPaginationActionsTable);