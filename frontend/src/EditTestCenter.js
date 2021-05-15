import React from 'react';
import './register.scss';

class EditTestCenter extends React.Component {
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

		this.id = this.props.match.params.id;
		this.name_ref = React.createRef();
		this.address_ref = React.createRef();
	}

	componentDidMount() {
		const url = process.env.REACT_APP_API_URL + "/test_centers/" + this.id;
		const localitiesUrl = process.env.REACT_APP_API_URL + "/localities";
		
		fetch(url, {
			method: "GET",
			mode: "cors",
			headers: {
				"Authorization": "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetCenterResponse(response.status, json.response)))
		.then(() => {
			fetch(localitiesUrl, {
				method: "GET",
				mode: "cors",
				headers: {
					"Authorization": "Bearer " + this.storedJwt
				}
			})
			.then(response => response.json().then(json => this.handleGetLocalitiesResponse(response.status, json.response)))
		})
		.catch(error => console.log(error));
	}

	handleGetCenterResponse(status, response) {
		if(Math.floor(status / 100) === 2) {
			let fields = {};

			fields["name"] = this.name_ref.current.value = response.name;
			fields["address"] = this.address_ref.current.value = response.address;
			fields["locality"] = response.locality_id;

			this.setState({fields: fields});
		}
	}

	handleGetLocalitiesResponse(status, response) {
		if(Math.floor(status / 100) === 2) {
			let localities = response.map(locality => {
				if(locality.id === this.state.fields["locality"]) {
					return (<option value={locality.id} selected>{locality.name}</option>);
				} else {
					return (<option value={locality.id}>{locality.name}</option>);
				}
			});
			this.setState({localities: localities});
		}
	}

	render() {
		return (
			<div class="form_wrapper">
				<div class="form_container">
					<div class="title_container">
						<h2>Editează centrul de testare</h2>
					</div>
					<div class="clearfix">
						<div class="">
							<form onSubmit={this.formSubmit.bind(this)}>
								<div class="input_field" style={{width: '100%'}}>
									<span>
										<i aria-hidden="true" class="fa fa-book"/>
									</span>
									<input type="text" name="name" placeholder="Nume" onChange={this.handleChange.bind(this, "name")}
										ref={this.name_ref} minLength="4" required />
								</div>
								<div class="input_field">
									<span>
										<i aria-hidden="true" class="fa fa-building"/>
									</span>
									<input type="text" name="address" placeholder="Adresă" onChange={this.handleChange.bind(this, "address")}
										ref={this.address_ref} minLength="4" required />
								</div>
								<div class="input_field select_option">
									<select onChange={this.handleChange.bind(this, "locality")}>
										{this.state.localities}
									</select>
									<div class="select_arrow"></div>
								</div>
								<input class="button" type="submit" value="Editează" />
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
			id: this.id,
			"name": this.state.fields["name"],
			"address": this.state.fields["address"],
			"locality_id": this.state.fields["locality"]
		};
		const url = process.env.REACT_APP_API_URL + "/test_centers";

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
			this.setState({successMessage: 'Centrul de testare a fost modificat cu succes.'});
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

export default EditTestCenter;