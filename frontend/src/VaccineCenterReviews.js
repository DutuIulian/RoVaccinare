import React from 'react';
import './register.scss';

class VaccineCenterReviews extends React.Component {
	constructor(props){
		super(props);

		this.storedJwt = localStorage.getItem('token');
		if(this.storedJwt === null || this.storedJwt.localeCompare('') === 0) {
			const history = this.props.history;
			history.push("/login");
		}

		this.vaccine_center_id = this.props.match.params.id;

		this.state = {
			reviews_list: (
				<tbody>
					<tr><td></td></tr>
					<tr><td></td></tr>
					<tr><td></td></tr>
				</tbody>
			),
			fields: {},
			successMessage: "",
			errorMessage: ""
		}
	}

	componentDidMount() {
		const url = process.env.REACT_APP_API_URL + "/vaccine_center_reviews/" + this.vaccine_center_id;

		fetch(url, {
			method: "GET",
			mode: "cors",
			headers: {
				Authorization: "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetResponse(response.status, json.response)))
		.catch(error => this.handleGetError());
	}

	render() {
		return (
			<>
				<table class="news">
					<tbody><tr className="title_table_row"><td>Recenzii</td></tr></tbody>
					{this.state.reviews_list}
				</table>
				<div class="form_wrapper">
					<div class="form_container">
						<div class="title_container">
							<h2>Lasă o recenzie</h2>
						</div>
						<div class="clearfix">
							<div class="">
								<form onSubmit={this.formSubmit.bind(this)}>
									<div class="input_field" style={{width: '100%'}}>
										<span>
											<i aria-hidden="true" class="fa fa-envelope"/>
										</span>
										<input type="text" name="title" placeholder="Titlu" onChange={this.handleChange.bind(this, "title")}
											minLength="4" required />
									</div>
									<div class="input_field">
										<textarea name="review" placeholder="Recenzie" onChange={this.handleChange.bind(this, "review")}
											rows="10" style={{width: '100%'}} minLength="4" required />
									</div>
									<input class="button" type="submit" value="Trimite" />
									<span style={{color: "green", "display": "table", "margin": "0 auto"}}>{this.state.successMessage}</span>
									<span style={{color: "red", "display": "table", "margin": "0 auto"}}>{this.state.errorMessage}</span>
								</form>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}

	handleGetResponse(status, response) {
		let content = [];

		if(Math.floor(status / 100) === 2) {
			if(!response || !response.length) {
				this.setState({reviews_list: this.buildTbodyFromString('Nu există recenzii.')});
			} else {
				response.forEach((review) => {
					content.push(<tr className="regular_table_row"><td>{review.title}</td></tr>);
					content.push(<tr className="regular_table_row"><td>{review.review}</td></tr>);
					content.push(<tr><td>{review.date}</td></tr>);
					content.push(<tr><td>{review.user_name}</td></tr>);
					content.push(<tr><td><hr /></td></tr>);
				});
				this.setState({reviews_list: (
					<tbody>
						{content}
					</tbody>
				)});
			}
		} else {
			this.setState({reviews_list: this.buildTbodyFromString("A apărut o eroare!")});
		}
	}

	handleGetError() {
		this.setState({reviews_list: this.buildTbodyFromString("A apărut o eroare!")});
	}

	buildTbodyFromString(text) {
		return (
			<tbody><tr><td>{text}</td></tr></tbody>
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
			"title": this.state.fields["title"],
			"review": this.state.fields["review"],
			"center_id": this.vaccine_center_id
		};
		const url = process.env.REACT_APP_API_URL + "/vaccine_center_reviews";

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

	handleStatus(status, token) {
		if(Math.floor(status / 100) === 2) {
			this.setState({successMessage: 'Recenzia a fost adăugată cu succes.'});
			this.setState({errorMessage: ''});
			this.componentDidMount();
		} else if(status === 403) {
			this.setState({errorMessage: 'Puteți avea o singură recenzie pentru fiecare centru.'});
			this.setState({successMessage: ''});
		} else {
			this.setState({errorMessage: 'A apărut o eroare!'});
			this.setState({successMessage: ''});
		}
	}

	handleError() {
		this.setState({errorMessage: 'A apărut o eroare!'});
		this.setState({successMessage: ''});
	}
}

export default VaccineCenterReviews;