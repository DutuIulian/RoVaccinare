import React from 'react';
import { Link } from 'react-router-dom';
import './register.scss';

class Appointments extends React.Component {
	constructor(props){
		super(props);

		this.storedJwt = localStorage.getItem('token');
		if(this.storedJwt === null || this.storedJwt.localeCompare('') === 0) {
            const history = this.props.history;
            history.push("/login");
        }

		this.user_id = localStorage.getItem('id');

		this.state = {
			test_appointment_list: (
				<tbody>
					<tr><td></td></tr>
					<tr><td></td></tr>
					<tr><td></td></tr>
				</tbody>
			),
			vaccine_appointment_list: (
				<tbody>
					<tr><td></td></tr>
					<tr><td></td></tr>
					<tr><td></td></tr>
				</tbody>
			)
		}
	}

	componentDidMount() {
		const testAppointmentUrl = process.env.REACT_APP_API_URL + "/test_appointments/" + this.user_id;
		fetch(testAppointmentUrl, {
			method: "GET",
			mode: "cors",
			headers: {
				"Authorization": "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetTestAppointmentsResponse(response.status, json.response)))
		.catch(error => console.log(error));

		const vaccineAppointmentUrl = process.env.REACT_APP_API_URL + "/vaccine_appointments/" + this.user_id;
		fetch(vaccineAppointmentUrl, {
			method: "GET",
			mode: "cors",
			headers: {
				"Authorization": "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetVaccineAppointmentsResponse(response.status, json.response)))
		.catch(error => console.log(error));
	}

	render() {
		return (
			<table class="news">
				<tbody><tr className="title_table_row"><td>Programări testare</td></tr></tbody>
				{this.state.test_appointment_list}
				<tbody><tr className="title_table_row"><td>Programări vaccinare</td></tr></tbody>
				{this.state.vaccine_appointment_list}
			</table>
		);
	}

	handleError() {
		this.setState({errorMessage: 'A apărut o eroare!'});
		this.setState({successMessage: ''});
	}

	handleGetTestAppointmentsResponse(status, response) {
		let content = [];

		if(Math.floor(status / 100) === 2) {
			if(!response || !response.length) {
				this.setState({test_appointment_list: this.buildTbodyFromString('Nu există programări.')});
			} else {
				response.forEach((appointment) => {
					content.push(<tr className="regular_table_row"><td>Test: {appointment.test_name}</td></tr>);
					content.push(<tr className="regular_table_row"><td>Centru: {appointment.center_name}</td></tr>);
					content.push(<tr className="regular_table_row"><td>Status: {appointment.status}</td></tr>);
					content.push(<tr className="regular_table_row"><td>Data programării: {appointment.date_time}</td></tr>);
					content.push(<tr className="regular_table_row"><td>Ultima actualizare: {appointment.last_update}</td></tr>);
					if(appointment.status.localeCompare("Inchis") !== 0 && appointment.status.localeCompare("Ratat") !== 0 && appointment.status.localeCompare("Anulat") !== 0) {
						content.push(<tr className="regular_table_row"><td><Link onClick={this.updateAppointmentStatus.bind(this, appointment.id, "Anulat", "/test_appointments/status")}>Anulează</Link></td></tr>);
					}
					content.push(<tr className="regular_table_row"><td><hr /></td></tr>);
				});
				this.setState({test_appointment_list: (
					<tbody>
						{content}
					</tbody>
				)});
			}
		} else {
			this.setState({test_appointment_list: this.buildTbodyFromString("A apărut o eroare!")});
		}
	}

	handleGetVaccineAppointmentsResponse(status, response) {
		let content = [];

		if(Math.floor(status / 100) === 2) {
			if(!response || !response.length) {
				this.setState({vaccine_appointment_list: this.buildTbodyFromString('Nu există programări.')});
			} else {
				response.forEach((appointment) => {
					content.push(<tr className="regular_table_row"><td>Vaccin: {appointment.vaccine_name}</td></tr>);
					content.push(<tr className="regular_table_row"><td>Centru: {appointment.center_name}</td></tr>);
					content.push(<tr className="regular_table_row"><td>Status: {appointment.status}</td></tr>);
					content.push(<tr className="regular_table_row"><td>Data programării: {appointment.date_time}</td></tr>);
					content.push(<tr className="regular_table_row"><td>Ultima actualizare: {appointment.last_update}</td></tr>);
					if(appointment.status.localeCompare("Inchis") !== 0 && appointment.status.localeCompare("Ratat") !== 0 && appointment.status.localeCompare("Anulat") !== 0) {
						content.push(<tr className="regular_table_row"><td><Link onClick={this.updateAppointmentStatus.bind(this, appointment.id, "Anulat", "/vaccine_appointments/status")}>Anulează</Link></td></tr>);
					}
					content.push(<tr className="regular_table_row"><td><hr /></td></tr>);
				});
				this.setState({vaccine_appointment_list: (
					<tbody>
						{content}
					</tbody>
				)});
			}
		} else {
			this.setState({vaccine_appointment_list: this.buildTbodyFromString("A apărut o eroare!")});
		}
	}

	updateAppointmentStatus(appointment_id, status, url_route) {
		const data = {
			"id": appointment_id,
			"status": status
		};

		const url = process.env.REACT_APP_API_URL + url_route;
		fetch(url, {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + this.storedJwt
			},
			body: JSON.stringify(data)
		})
		.then(response => this.handleResponse()) 
		.catch(error => this.handleError());
	}

	handleResponse() {
		window.location.reload()
	}

	buildTbodyFromString(text) {
		return (
			<tbody><tr><td>{text}</td></tr></tbody>
		);
	}
}

export default Appointments;