import React from 'react';
import './register.scss';

class Register extends React.Component {
	
	constructor(props){
		super(props);

		this.state = {
			fields: {},
			errors: {}
		}
	}
	
	handleValidation(){
		let fields = this.state.fields;
		let errors = {};

		if(fields["password"].localeCompare(fields["confirmPassword"]) !== 0) {
			errors["password"] = "Parolele diferă";
			return false;
		}
		
		this.setState({errors: errors});
		return true;
	}
	
	formSubmit(e){
		e.preventDefault();

		if(this.handleValidation()) {
			
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
						<h2>Înregistrare utilizator</h2>
					</div>
					<div class="clearfix">
						<div class="">
							<form onSubmit={this.formSubmit.bind(this)}>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-envelope"/>
									</span>
									<input type="email" name="email" placeholder="E-mail" onChange={this.handleChange.bind(this, "email")} required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-lock"/>
									</span>
									<input type="password" name="password" placeholder="Parola" onChange={this.handleChange.bind(this, "password")} required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-lock"/>
									</span>
									<input type="password" name="confirmPassword" placeholder="Parola (confirmare)" onChange={this.handleChange.bind(this, "confirmPassword")} required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-user"/>
									</span>
									<input type="text" name="lastName" placeholder="Nume" onChange={this.handleChange.bind(this, "lastName")} required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-user"/>
									</span>
									<input type="text" name="firstName" placeholder="Prenume" onChange={this.handleChange.bind(this, "firstName")} required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-address-card"/>
									</span>
									<input type="text" name="cnp" pattern="[0-9]*" placeholder="CNP" onChange={this.handleChange.bind(this, "cnp")} required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-address-card"/>
									</span>
									<input type="text" name="address" placeholder="Adresă" requiredonChange={this.handleChange.bind(this, "address")} required />
								</div>
								<input class="button" type="submit" value="Înregistrare"/>
								<span style={{color: "red", "display": "table", "margin": "0 auto"}}>{this.state.errors["password"]}</span>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Register;