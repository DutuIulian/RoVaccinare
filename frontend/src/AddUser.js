import React from 'react';
import './register.scss';

class AddUser extends React.Component {
	
	constructor(props){
		super(props);

		this.storedJwt = localStorage.getItem('token');
		if(''.localeCompare(this.storedJwt) === 0
				|| this.storedJwt === null
				|| 'ADMIN'.localeCompare(localStorage.getItem('role')) !== 0) {
			const history = this.props.history;
			history.push("/");
		}

		this.state = {
			fields: {},
			successMessage: "",
			errorMessage: "",
			roles: ""
		}
	}

	componentDidMount() {
        const rolesUrl = process.env.REACT_APP_API_URL + "/roles";
		fetch(rolesUrl, {
			method: "GET",
			mode: "cors",
			headers: {
				"Authorization": "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetRolesResponse(response.status, json.response)))
    }

	handleGetRolesResponse(status, response) {
		if(Math.floor(status / 100) === 2) {
			let roles = response.map(role => <option value={role.value}>{role.value}</option>);
			this.setState({roles: roles});
		}
	}
	
	handleValidation(){
		let fields = this.state.fields;
		let errorMessage = "";
		let isValid = true;

		if(fields["password"].localeCompare(fields["confirmPassword"]) !== 0) {
			errorMessage = "Parolele diferă";
			isValid = false;
		}
		
		this.setState({errorMessage: errorMessage});
		return isValid;
	}
	
	handleStatus(status) {
		if(Math.floor(status / 100) === 2) {
			this.setState({successMessage: 'Contul a fost creat. Folosiți link-ul de activare primit pe e-mail.'});
			this.setState({errorMessage: ''});
		} else {
			this.setState({errorMessage: 'A apărut o eroare!'});
			this.setState({successMessage: ''});
		}
	}
	
	handleError() {
		this.setState({errorMessage: 'A apărut o eroare!'});
		this.setState({successMessage: ''});
	}
	
	formSubmit(e) {
		e.preventDefault();

		if(this.handleValidation()) {
			const data = {
				"email": this.state.fields["email"],
				"password": this.state.fields["password"],
				"last_name": this.state.fields["last_name"],
				"first_name": this.state.fields["first_name"],
				"cnp": this.state.fields["cnp"],
				"address": this.state.fields["address"],
				"role": this.state.fields["role"]
			};
			const url = process.env.REACT_APP_API_URL + "/users/register";
			
			fetch(url, {
				method: "POST",
				mode: "cors",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data)
			})
			.then(response => this.handleStatus(response.status))
			.catch(error => this.handleError());
		}
	}
	
	handleChange(field, e){			
		let fields = this.state.fields;
		fields[field] = e.target.value;		  
		this.setState({fields});
	}
	
	render() {
		return (
			<div class="form_wrapper">
				<div class="form_container">
					<div class="title_container">
						<h2>Adăugare utilizator</h2>
					</div>
					<div class="clearfix">
						<div class="">
							<form onSubmit={this.formSubmit.bind(this)}>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-envelope"/>
									</span>
									<input type="text" name="email" placeholder="E-mail" onChange={this.handleChange.bind(this, "email")} required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-lock"/>
									</span>
									<input type="password" name="password" placeholder="Parola" onChange={this.handleChange.bind(this, "password")} minLength="4" required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-lock"/>
									</span>
									<input type="password" name="confirmPassword" placeholder="Parola (confirmare)" onChange={this.handleChange.bind(this, "confirmPassword")} minLength="4" required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-user"/>
									</span>
									<input type="text" name="last_name" placeholder="Nume" onChange={this.handleChange.bind(this, "last_name")} required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-user"/>
									</span>
									<input type="text" name="first_name" placeholder="Prenume" onChange={this.handleChange.bind(this, "first_name")} required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-address-card"/>
									</span>
									<input type="text" name="cnp" pattern="[0-9]*" placeholder="CNP" onChange={this.handleChange.bind(this, "cnp")} minLength="13" maxLength="13" required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-address-card"/>
									</span>
									<input type="text" name="address" placeholder="Adresă" onChange={this.handleChange.bind(this, "address")} required />
								</div>
								<div class="input_field select_option">
									<select onChange={this.handleChange.bind(this, "role")}>
										{this.state.roles}
									</select>
									<div class="select_arrow"></div>
								</div>
								<input class="button" type="submit" value="Înregistrare" />
								<span style={{color: "green", "display": "table", "margin": "0 auto"}}>{this.state.successMessage}</span>
								<span style={{color: "red", "display": "table", "margin": "0 auto"}}>{this.state.errorMessage}</span>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default AddUser;