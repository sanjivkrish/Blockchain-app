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
});

class ComposedTextField extends React.Component {

	constructor (props) {
		super(props);

		this.state = {
			data: []
		};
	}

	render() {
		const { classes } = this.props;

		return (
			<Paper className={classes.root}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<TableCell>Batch ID</TableCell>
							<TableCell>Available amount</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{this.state.data.map(n => {
							return (
								<TableRow key={n.id}>
									<TableCell component="th" scope="row">{n.batchId}</TableCell>
									<TableCell >{n.batchAmount}</TableCell>
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
