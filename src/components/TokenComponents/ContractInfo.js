import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as tokenOperations from '../../tokenOperations';

const styles = theme => ({
  root: {
    width: '50%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 350,
  },
});

class SimpleTable extends React.Component {
	state = {
		owner : null,
		totalSupply: null
	}

	constructor (props) {
		super(props);

		this.getOwner();
		this.getTotalSupply();
	}

	// Get owner of current active Token
	getOwner = () => {
		tokenOperations.getOwner().then((result) => {
			this.setState({
				owner: result
			});
		});
	}

	// Get total available supply of current active Token
	getTotalSupply = () => {
		tokenOperations.getTotalSupply().then((result) => {
			this.setState({
				totalSupply: result
			});
		});
	}

	render() {
		const { classes } = this.props;
	
		return (
			<Paper className={classes.root}>
				<Table className={classes.table}>
					<TableBody>
						<TableRow>
							<TableCell component="th" scope="row">
									Owner
							</TableCell>
							<TableCell>{this.state.owner}</TableCell>
						</TableRow>
						<TableRow>
							<TableCell component="th" scope="row">
									Total supply
							</TableCell>
							<TableCell>{this.state.totalSupply}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Paper>
		);
	}
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);