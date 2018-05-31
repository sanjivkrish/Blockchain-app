import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
		minWidth: '30%',
	},
	highlight: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
});

class ComposedTextField extends React.Component {
	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.root}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<TableCell>{this.props.tokenDesc} - Batch ID's</TableCell>
							<TableCell>Available amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.props.batchList.map((n,i) => {
							return (
								<TableRow key={i} style={{cursor: 'pointer'}} onClick={() => {this.props.setActiveBatch(i)}}>
									<TableCell component="th" scope="row" style={{fontSize: 11}}>{n}</TableCell>
									<TableCell>{this.props.batchAmount[i]}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Paper>
		);
	}
}

ComposedTextField.propTypes = {
  classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(ComposedTextField);
