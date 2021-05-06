import React from 'react';
import './styles.scss';

class Questions extends React.Component {
	constructor(props) {
		super(props);

		this.storedJwt = localStorage.getItem('token');
		if(this.storedJwt === null || this.storedJwt.localeCompare('') === 0) {
			const history = this.props.history;
			history.push("/login");
		}

		this.state = {
			questions_list: (
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
		const url = process.env.REACT_APP_API_URL + "/questions/pinned";

		fetch(url, {
			method: "GET",
			mode: "cors",
			headers: {
				Authorization: "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetResponse(response.status, json.response)))
		.catch(error => this.handleError());
	}

	render() {
		return (
			<>
				<table class="news">
					{this.state.questions_list}
				</table>
				<div class="form_wrapper">
					<div class="form_container">
						<div class="title_container">
							<h2>Nu ai găsit răspunsul? Întreabă!</h2>
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
										<textarea name="question" placeholder="Întrebare" onChange={this.handleChange.bind(this, "question")}
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

	handleChange(field, e){			
		let fields = this.state.fields;
		fields[field] = e.target.value;		  
		this.setState({fields});
	}

	formSubmit(e) {
		e.preventDefault();

		const data = {
			"title": this.state.fields["title"],
			"question": this.state.fields["question"],
		};
		const url = process.env.REACT_APP_API_URL + "/questions";

		fetch(url, {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + this.storedJwt
			},
			body: JSON.stringify(data)
		})
		.then(response => response.json().then(json => this.handlePostResponse(response.status, json.response.token))) 
		.catch(error => this.handleError());
	}

	handleGetResponse(status, response) {
		let content = [];

		if(Math.floor(status / 100) === 2) {
			if(!response || !response.length) {
				this.setState({questions_list: this.buildTbodyFromString('Nu există întrebări.')});
			} else {
				response.reverse();
				response.forEach((question) => {
					content.push(<tr><td>{question.title}</td></tr>);
					content.push(<tr><td>{question.question}</td></tr>);
					content.push(<tr><td>{question.answer}</td></tr>);
				});
				this.setState({questions_list: (
					<tbody>
						{content}
					</tbody>
				)});
			}
		} else {
			this.setState({questions_list: this.buildTbodyFromString("A apărut o eroare!")});
		}
	}

	buildTbodyFromString(text) {
		return (
			<tbody><tr><td>{text}</td></tr></tbody>
		);
	}

	handlePostResponse(status, response) {
		if(Math.floor(status / 100) === 2) {
			this.setState({successMessage: "Întrebarea a fost trimisă cu succes."});
			this.setState({errorMessage: ""});
		} else {
			this.setState({errorMessage: "A apărut o eroare!"});
			this.setState({successMessage: ""});
		}
	}

	handleError() {
		this.setState({errorMessage: "A apărut o eroare!"});
		this.setState({successMessage: ""});
	}
}

export default Questions;