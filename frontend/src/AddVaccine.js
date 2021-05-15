import React from 'react';
import './register.scss';

class AddVaccine extends React.Component {
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
			fields: {quantity: 0},
			successMessage: "",
			errorMessage: ""
		}

		this.center_id = this.props.match.params.id;
	}

	render() {
		return (
			<div class="form_wrapper">
				<div class="form_container">
					<div class="title_container">
						<h2>Adaugă un vaccin</h2>
					</div>
					<div class="clearfix">
						<div class="">
							<form onSubmit={this.formSubmit.bind(this)}>
								<div class="input_field" style={{width: '100%'}}>
									<span>
										<i aria-hidden="true" class="fa fa-plus-square"/>
									</span>
									<input type="text" name="name" placeholder="Nume" onChange={this.handleChange.bind(this, "name")}
										minLength="4" required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-percent"/>
									</span>
									<input type="text" value={this.state.fields["quantity"]} name="quantity" placeholder="Cantitate" onChange={this.handleChange.bind(this, "quantity")}
										minLength="1" required />
								</div>
								<input class="button" type="submit" value="Adaugă" />
								<span style={{color: "green", "display": "table", "margin": "0 auto"}}>{this.state.successMessage}</span>
								<span style={{color: "red", "display": "table", "margin": "0 auto"}}>{this.state.errorMessage}</span>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}

	handleChange(field, e) {
		if(field.localeCompare("quantity") === 0) {
			const re = /^[0-9\b]+$/;
			if (e.target.value.localeCompare("") !== 0 && !re.test(e.target.value)) {
				return;
			}
		}

		let fields = this.state.fields;
		fields[field] = e.target.value;		  
		this.setState({fields});
	}
	
	formSubmit(e) {
		e.preventDefault();

		const data = {
			name: this.state.fields["name"],
			available_quantity: this.state.fields["quantity"],
			center_id: this.center_id
		};
		const url = process.env.REACT_APP_API_URL + "/vaccines";

		fetch(url, {
			method: "POST",
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
			this.setState({successMessage: 'Vaccinul a fost adăugat cu succes.'});
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

export default AddVaccine;