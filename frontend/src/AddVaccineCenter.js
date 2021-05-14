import React from 'react';
import './register.scss';

class AddVaccineCenter extends React.Component {
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
			localities: ""
		}
	}

	componentDidMount() {
        const rolesUrl = process.env.REACT_APP_API_URL + "/localities";
		fetch(rolesUrl, {
			method: "GET",
			mode: "cors",
			headers: {
				"Authorization": "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetLocalitiesResponse(response.status, json.response)))
    }

	handleGetLocalitiesResponse(status, response) {
		if(Math.floor(status / 100) === 2) {
			let localities = response.map(locality => <option value={locality.id}>{locality.name}</option>);
			let fields = this.state.fields;
			fields["locality"] = response[0].id;
			this.setState({
				localities: localities,
				fields:fields
			});
		}
	}

	render() {
		return (
			<div class="form_wrapper">
				<div class="form_container">
					<div class="title_container">
						<h2>Adaugă un centru de vaccinare</h2>
					</div>
					<div class="clearfix">
						<div class="">
							<form onSubmit={this.formSubmit.bind(this)}>
								<div class="input_field" style={{width: '100%'}}>
									<span>
										<i aria-hidden="true" class="fa fa-book"/>
									</span>
									<input type="text" name="name" placeholder="Nume" onChange={this.handleChange.bind(this, "name")}
										minLength="4" required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-building"/>
									</span>
									<input type="text" name="address" placeholder="Adresă" onChange={this.handleChange.bind(this, "address")}
										minLength="4" required />
								</div>
								<div class="input_field select_option">
									<select onChange={this.handleChange.bind(this, "locality")}>
										{this.state.localities}
									</select>
									<div class="select_arrow"></div>
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

	handleChange(field, e){			
		let fields = this.state.fields;
		fields[field] = e.target.value;		  
		this.setState({fields});
	}
	
	formSubmit(e) {
		e.preventDefault();

		const data = {
			"name": this.state.fields["name"],
			"address": this.state.fields["address"],
			"locality_id": this.state.fields["locality"]
		};
		console.log(JSON.stringify(data));
		const url = process.env.REACT_APP_API_URL + "/vaccine_centers";

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
			this.setState({successMessage: 'Centrul de vaccinare a fost adăugat cu succes.'});
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

export default AddVaccineCenter;