import React from 'react';
import { Link } from 'react-router-dom';
import './styles.scss';

class AdminMenu extends React.Component {
	constructor(props) {
		super(props);

		this.storedJwt = localStorage.getItem('token');
		if(''.localeCompare(this.storedJwt) === 0
				|| this.storedJwt === null
				|| 'ADMIN'.localeCompare(localStorage.getItem('role')) !== 0) {
			const history = this.props.history;
			history.push("/");
		}

		this.state = {
			news_list: (
				<tbody>
					<tr><td></td></tr>
					<tr><td></td></tr>
					<tr><td></td></tr>
				</tbody>
			)
		}
	}

	componentDidMount() {
		const url = process.env.REACT_APP_API_URL + "/users";

		fetch(url, {
			method: "GET",
			mode: "cors",
			headers: {
				"Authorization": "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleResponse(response.status, json.response)))
		.catch(error => this.handleError());
	}

	render() {
		return (
			<table class="news">
				{this.state.news_list}
			</table>
		);
	}

	handleResponse(status, response) {
		let content = [];

		if(Math.floor(status / 100) === 2) {
			if(!response || !response.length) {
				this.setState({news_list: this.buildTbodyFromString('Nu există știri.')});
			} else {
				response.forEach((user) => {
					content.push(
						<tr>
							<td>{user.email}</td>
							<td>{user.first_name + ' ' + user.last_name}</td>
							<td>{user.cnp}</td>
							<td>{user.address}</td>
							<td>{user.role}</td>
							<td><Link to={'/administer_user/' + user.id}><span>Administrează</span></Link></td>
						</tr>
					);
				});
				this.setState({news_list: (
					<>
						<thead>
							<tr>
								<td>E-mail</td>
								<td>Nume</td>
								<td>CNP</td>
								<td>Adresă</td>
								<td>Rol</td>
							</tr>
						</thead>
						<tbody>
							{content}
						</tbody>
					</>
				)});
			}
		} else {
			this.setState({news_list: this.buildTbodyFromString("A apărut o eroare!")});
		}
	}

	handleError() {
		this.setState({news_list: this.buildTbodyFromString("A apărut o eroare!")});
	}

	buildTbodyFromString(text) {
		return (
			<tbody><tr><td>{text}</td></tr></tbody>
		);
	}
}

export default AdminMenu;