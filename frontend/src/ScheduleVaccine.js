import React from 'react';
import DatePicker from "react-datepicker";
import { setHours } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import './register.scss';
import "./customDatePickerWidth.scss";

class ScheduleVaccine extends React.Component {
	constructor(props){
		super(props);

		this.storedJwt = localStorage.getItem('token');
		if(this.storedJwt.localeCompare('') === 0) {
			const history = this.props.history;
			history.push("/login");
		}

		this.vaccine_id = this.props.match.params.id;

		this.state = {
			successMessage: "",
			errorMessage: "",
			date: new Date()
		}
	}

	render() {
		return (
			<div class="form_wrapper">
				<div class="form_container">
					<div class="title_container">
						<h2>Alegeți data și ora</h2>
					</div>
					<div class="clearfix">
						<div class="">
							<form onSubmit={this.formSubmit.bind(this)}>
								<div class="input_field" style={{width: '100%'}}>
									<span>
										<i aria-hidden="true" class="fa fa-envelope"/>
									</span>
									<div className="customDatePickerWidth">
										<DatePicker selected={this.state.date}
											onChange={date => this.setState({date: date})}
											showTimeSelect dateFormat="dd/MM/yyy HH:mm"
											timeFormat="HH:mm"
											timeIntervals="60"
											minTime={setHours(new Date(), 8)}
											maxTime={setHours(new Date(), 19)}
											minDate={Date.now()}
											maxDate={Date.now() + 14 * 24 * 3600 * 1000} />
									</div>
								</div>
								<input class="button" type="submit" value="Programare" />
								<span style={{color: "green", "display": "table", "margin": "0 auto"}}>{this.state.successMessage}</span>
								<span style={{color: "red", "display": "table", "margin": "0 auto"}}>{this.state.errorMessage}</span>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
	
	formSubmit(e) {
		e.preventDefault();

		const data = {
			"date_time": this.state.date,
			"vaccine_id": this.vaccine_id
		};
		const url = process.env.REACT_APP_API_URL + "/vaccine_appointments";

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
			this.setState({successMessage: 'Programarea a fost adăugată cu succes.'});
			this.setState({errorMessage: ''});
		} else if(status === 403) {
			this.setState({errorMessage: 'Puteți avea o singură programare activă.'});
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

export default ScheduleVaccine;