import React from 'react';
import TestCenterReviewGraph from './TestCenterReviewGraph.js'
import VaccineCenterReviewGraph from './VaccineCenterReviewGraph.js'
import TestGraph from './TestGraph.js'
import VaccineGraph from './VaccineGraph.js'
import { Link } from 'react-router-dom';
import './register.scss';

class AdministerUser extends React.Component {
	constructor(props){
		super(props);

		this.storedJwt = localStorage.getItem('token');
		if(''.localeCompare(this.storedJwt) === 0
				|| this.storedJwt === null
				|| 'ADMIN'.localeCompare(localStorage.getItem('role')) !== 0) {
			const history = this.props.history;
			history.push("/");
		}

		this.user_id = this.props.match.params.id;
		
		this.email_ref = React.createRef();
		this.last_name_ref = React.createRef();
		this.first_name_ref = React.createRef();
		this.cnp_ref = React.createRef();
		this.address_ref = React.createRef();
		this.role_ref = React.createRef();
		this.activated_ref = React.createRef();

		this.state = {
			fields: {},
			successMessage: "",
			errorMessage: "",
			roles: "",
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
		const url = process.env.REACT_APP_API_URL + "/users/" + this.user_id;
		const rolesUrl = process.env.REACT_APP_API_URL + "/roles";

		fetch(url, {
			method: "GET",
			mode: "cors",
			headers: {
				"Authorization": "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetResponse(response.status, json.response)))
		.then(() => {
			fetch(rolesUrl, {
				method: "GET",
				mode: "cors",
				headers: {
					"Authorization": "Bearer " + this.storedJwt
				}
			})
			.then(response => response.json().then(json => this.handleGetRolesResponse(response.status, json.response)))
		})
		.catch(error => console.log(error));

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
			<>
				<div class="form_wrapper">
					<div class="form_container">
						<div class="title_container">
							<h2>Administrează utilizatorul</h2>
						</div>
						<div class="clearfix">
							<div class="">
								<form onSubmit={this.formSubmit.bind(this)}>
									<div class="input_field" style={{width: '100%'}}>
										<span>
											<i aria-hidden="true" class="fa fa-envelope"/>
										</span>
										<input type="text" name="email" placeholder="E-mail" onChange={this.handleChange.bind(this, "email")}
											ref={this.email_ref} minLength="4" required />
									</div>
									<div class="input_field">
										<span>
											<i aria-hidden="true" class="fa fa-user"/>
										</span>
										<input type="text" name="last_name" placeholder="Nume" onChange={this.handleChange.bind(this, "last_name")}
											ref={this.last_name_ref} minLength="4" required />
									</div>
									<div class="input_field">
										<span>
											<i aria-hidden="true" class="fa fa-user"/>
										</span>
										<input type="text" name="first_name" placeholder="Prenume" onChange={this.handleChange.bind(this, "first_name")}
											ref={this.first_name_ref} minLength="4" required />
									</div>
									<div class="input_field">
										<span>
											<i aria-hidden="true" class="fa fa-address-card"/>
										</span>
										<input type="text" name="cnp" placeholder="CNP" onChange={this.handleChange.bind(this, "cnp")}
											ref={this.cnp_ref} minLength="4" required />
									</div>
									<div class="input_field">
										<span>
											<i aria-hidden="true" class="fa fa-address-card"/>
										</span>
										<input type="text" name="address" placeholder="Adresă" onChange={this.handleChange.bind(this, "address")}
											ref={this.address_ref} minLength="4" required />
									</div>
									<div class="input_field select_option">
										<select ref={this.role_ref} onChange={this.handleChange.bind(this, "role")}>
											{this.state.roles}
										</select>
										<div class="select_arrow"></div>
									</div>
									<div class="input_field checkbox_option">
										<input type="checkbox" id="cb1" ref={this.activated_ref} onChange={this.handleCheckboxChange.bind(this)} />
										<label htmlFor="cb1">Activat</label>
									</div>
									<input class="button" type="submit" value="Modifică" />
									<span style={{color: "green", "display": "table", "margin": "0 auto"}}>{this.state.successMessage}</span>
									<span style={{color: "red", "display": "table", "margin": "0 auto"}}>{this.state.errorMessage}</span>
								</form>
							</div>
						</div>
					</div>
				</div>
				<div style={{height: "125px", width: "20%", display: "flex", "justify-content": "center", "margin-left": "auto", "margin-right": "auto", "margin-top": "4vw", "margin-bottom": "4vw"}}>
					<TestCenterReviewGraph userId={this.user_id} />
				</div>
				<div style={{height: "125px", width: "20%", display: "flex", "justify-content": "center", "margin-left": "auto", "margin-right": "auto", "margin-bottom": "4vw"}}>
					<VaccineCenterReviewGraph userId={this.user_id} />
				</div>
				<div style={{height: "125px", width: "20%", display: "flex", "justify-content": "center", "margin-left": "auto", "margin-right": "auto", "margin-bottom": "4vw"}}>
					<TestGraph userId={this.user_id} />
				</div>
				<div style={{height: "125px", width: "20%", display: "flex", "justify-content": "center", "margin-left": "auto", "margin-right": "auto", "margin-bottom": "4vw"}}>
					<VaccineGraph userId={this.user_id} />
				</div>
				<table class="news">
					<tbody><tr className="title_table_row"><td>Programări testare</td></tr></tbody>
					{this.state.test_appointment_list}
					<tbody><tr className="title_table_row"><td>Programări vaccinare</td></tr></tbody>
					{this.state.vaccine_appointment_list}
				</table>
			</>
		);
	}

	handleGetResponse(status, response) {
		if(Math.floor(status / 100) === 2) {
			let fields = {};

			fields["email"] = this.email_ref.current.value = response.email;
			fields["last_name"] = this.last_name_ref.current.value = response.last_name;
			fields["first_name"] = this.first_name_ref.current.value = response.first_name;
			fields["cnp"] = this.cnp_ref.current.value = response.cnp;
			fields["address"] = this.address_ref.current.value = response.address;
			fields["activated"] = this.activated_ref.current.defaultChecked = response.activated;
			fields["role"] = response.role;

			this.setState({fields: fields});
		}
	}

	handleGetRolesResponse(status, response) {
		if(Math.floor(status / 100) === 2) {
			let roles = response.map(role => {
				if(role.value.localeCompare(this.state.fields["role"]) === 0) {
					return (<option value={role.value} selected>{role.value}</option>);
				} else {
					return (<option value={role.value}>{role.value}</option>);
				}
			});
			this.setState({roles: roles});
		}
	}

	handleChange(field, e) {
		let fields = this.state.fields;
		fields[field] = e.target.value;
		this.setState({fields: fields});
	}

	handleCheckboxChange() {
		let fields = this.state.fields;
		fields["activated"] = !fields["activated"];
		this.setState({fields: fields});
	}
	
	formSubmit(e) {
		e.preventDefault();

		const data = {
			"id": this.user_id,
			"email": this.state.fields["email"],
			"last_name": this.state.fields["last_name"],
			"first_name": this.state.fields["first_name"],
			"cnp": this.state.fields["cnp"],
			"address": this.state.fields["address"],
			"role": this.state.fields["role"],
			"activated": this.state.fields["activated"]
		};

		const url = process.env.REACT_APP_API_URL + "/users";
		fetch(url, {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + this.storedJwt
			},
			body: JSON.stringify(data)
		})
		.then(response => this.handleStatus(response.status)) 
		.catch(error => this.handleError());
	}

	handleStatus(status) {
		if(Math.floor(status / 100) === 2) {
			this.setState({successMessage: 'Utilizatorul a fost modificat cu succes.'});
			this.setState({errorMessage: ''});
		}  else {
			this.setState({errorMessage: 'A apărut o eroare!'});
			this.setState({successMessage: ''});
		}
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
						content.push(<tr className="regular_table_row"><td><Link onClick={this.updateAppointmentStatus.bind(this, appointment.id, "Inchis", "/test_appointments/status")}>Închide</Link></td></tr>);
						content.push(<tr className="regular_table_row"><td><Link onClick={this.updateAppointmentStatus.bind(this, appointment.id, "Ratat", "/test_appointments/status")}>Programare ratată</Link></td></tr>);
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
						content.push(<tr className="regular_table_row"><td><Link onClick={this.updateAppointmentStatus.bind(this, appointment.id, "Inchis", "/vaccine_appointments/status")}>Închide</Link></td></tr>);
						content.push(<tr className="regular_table_row"><td><Link onClick={this.updateAppointmentStatus.bind(this, appointment.id, "Ratat", "/vaccine_appointments/status")}>Programare ratată</Link></td></tr>);
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

export default AdministerUser;