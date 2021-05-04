import React from 'react';
import { Link } from 'react-router-dom';
import './register.scss';

class Login extends React.Component {
	constructor(props){
		super(props);

		const storedJwt = localStorage.getItem('token');
		if(storedJwt) {
			const history = this.props.history;
			history.push("/");
		}

		this.state = {
			fields: {},
			errorMessage: ""
		}
		
	}
	
	render() {
		return (
			<div class="form_wrapper">
				<div class="form_container">
					<div class="title_container">
						<h2>Autentificare utilizator</h2>
					</div>
					<div class="clearfix">
						<div class="">
							<form onSubmit={this.formSubmit.bind(this)}>
								<div class="input_field" style={{width: '100%'}}>
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
								<input class="button" type="submit" value="Autentificare" />
								<span style={{color: "red", "display": "table", "margin": "0 auto"}}>{this.state.errorMessage}</span>
							</form>
						</div>
					</div>
				</div>
				Nu ai cont?&nbsp;
				<Link to={'/register' }>
					<span>Creează cont nou</span>
				</Link>
			</div>
		);
	}
	
	formSubmit(e) {
		e.preventDefault();

		const data = {
			"email": this.state.fields["email"],
			"password": this.state.fields["password"],
		};
		const url = process.env.REACT_APP_API_URL + "/users/login";

		fetch(url, {
			method: "POST",
			mode: "cors",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		})
		.then(response => response.json().then(json => this.handleResponse(response.status, json.response.token))) 
		.catch(error => this.handleError());
	}

	handleChange(field, e){			
		let fields = this.state.fields;
		fields[field] = e.target.value;		  
		this.setState({fields});
	}

	handleResponse(status, token) {
		if(Math.floor(status / 100) === 2) {
			localStorage.setItem('token', token);
			const history = this.props.history;
			history.push("/");
			window.location.reload();
		} else if(status === 401){
			this.setState({errorMessage: 'Contul sau parola sunt greșite!'});
		} else if(status === 403){
			this.setState({errorMessage: 'Contul nu este activat!'});
		} else {
			this.setState({errorMessage: 'A apărut o eroare!'});
		}
	}

	handleError() {
		this.setState({errorMessage: 'A apărut o eroare!'});
	}
}

export default Login;