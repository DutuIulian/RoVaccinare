import React from 'react';
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
			roles: ""
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
		.catch(error => {});
	}

	render() {
		return (
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
										<i aria-hidden="true" class="fa fa-envelope"/>
									</span>
									<input type="text" name="last_name" placeholder="Nume" onChange={this.handleChange.bind(this, "last_name")}
										ref={this.last_name_ref} minLength="4" required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-envelope"/>
									</span>
									<input type="text" name="first_name" placeholder="Prenume" onChange={this.handleChange.bind(this, "first_name")}
										ref={this.first_name_ref} minLength="4" required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-envelope"/>
									</span>
									<input type="text" name="cnp" placeholder="CNP" onChange={this.handleChange.bind(this, "cnp")}
										ref={this.cnp_ref} minLength="4" required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-envelope"/>
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
}

export default AdministerUser;