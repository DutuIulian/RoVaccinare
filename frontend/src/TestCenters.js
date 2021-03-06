import React from 'react';
import { Link } from 'react-router-dom';
import './centers.scss';

class TestCenters extends React.Component {
	constructor(props) {
		super(props);

		this.storedJwt = localStorage.getItem('token');
		if(this.storedJwt === null || this.storedJwt.localeCompare('') === 0) {
			const history = this.props.history;
			history.push("/login");
		}

		this.state = {
			center_list: <tbody><tr><td>Lista se încarcă...</td></tr></tbody>,
		}
	}

	componentDidMount() {
		const url = process.env.REACT_APP_API_URL + "/test_centers";

		fetch(url, {
			method: "GET",
			mode: "cors",
			headers: {
				Authorization: "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleResponse(response.status, json.response)))
		.catch(error => this.handleError());
	}

	render() {
		if('ADMIN'.localeCompare(localStorage.getItem('role')) === 0) {
			return (
				<table class="centers-box">
					<thead><tr><td></td><td></td><td></td><td></td><td></td><td></td><td><Link to={'/add_test_center'}><input type="submit" value="Adaugă" /></Link></td></tr></thead>
					{ this.state.center_list }
				</table>
			);
		} else {
			return (
				<table class="centers-box">
					{ this.state.center_list }
				</table>
			);
		}
	}

	handleResponse(status, response) {
		let content = [];

		if(Math.floor(status / 100) === 2) {
			if(!response || !response.length) {
				this.setState({center_list: this.buildTbodyFromString('Nu există niciun centru disponibil.')});
			} else {
				response.forEach((center) => {
					if('ADMIN'.localeCompare(localStorage.getItem('role')) === 0) {
						if(center.test_count === 0) {
							content.push(
								<tr>
									<td>{center.name}</td>
									<td>{center.address}</td>
									<td>{center.locality}</td>
									<td><Link to={'/tests/' + center.id}><span>Programează-te</span></Link></td>
									<td><Link to={'/test_center_reviews/' + center.id}><span>Recenzii</span></Link></td>
									<td><Link to={'/edit_test_center/' + center.id}><span>Editează</span></Link></td>
									<td><Link onClick={this.deleteCenter.bind(this, center.id)}>Șterge</Link></td>
								</tr>
							);
						} else {
							content.push(
								<tr>
									<td>{center.name}</td>
									<td>{center.address}</td>
									<td>{center.locality}</td>
									<td><Link to={'/tests/' + center.id}><span>Programează-te</span></Link></td>
									<td><Link to={'/test_center_reviews/' + center.id}><span>Recenzii</span></Link></td>
									<td><Link to={'/edit_test_center/' + center.id}><span>Editează</span></Link></td>
								</tr>
							);
						}
					} else {
						content.push(
							<tr>
								<td>{center.name}</td>
								<td>{center.address}</td>
								<td>{center.locality}</td>
								<td><Link to={'/tests/' + center.id}><span>Programează-te</span></Link></td>
								<td><Link to={'/test_center_reviews/' + center.id}><span>Recenzii</span></Link></td>
							</tr>
						);
					}
				});

				this.setState({center_list: (
					<>
						<thead>
							<tr>
								<td>Nume</td>
								<td>Adresa</td>
								<td>Localitate</td>
							</tr>
						</thead>
						<tbody>
							{content}
						</tbody>
					</>
				)});
			}
		} else {
			this.setState({center_list: this.buildTbodyFromString("A apărut o eroare!")});
		}
	}

	handleError() {
		this.setState({center_list: this.buildTbodyFromString("A apărut o eroare!")});
	}

	buildTbodyFromString(text) {
		return (
			<tbody><tr><td>{text}</td></tr></tbody>
		);
	}

	deleteCenter(id) {
		const url = process.env.REACT_APP_API_URL + "/test_centers/" + id;

		fetch(url, {
			method: "DELETE",
			mode: "cors",
		})
		.then(response => this.handleDeleteResponse(response.status))
		.catch(error => this.handleError());
	}

	handleDeleteResponse(status) {
		if(Math.floor(status / 100) === 2) {
			window.location.reload();
		}
	}
}

export default TestCenters;