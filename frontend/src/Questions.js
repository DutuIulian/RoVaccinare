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
			user_questions_list: (
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
		const otherUsersQuestionsUrl = process.env.REACT_APP_API_URL + "/questions/pinned";

		fetch(otherUsersQuestionsUrl, {
			method: "GET",
			mode: "cors",
			headers: {
				Authorization: "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetResponse(response.status, json.response, 'questions_list')))
		.catch(error => this.handleGetError('questions_list'));

		const user_id = localStorage.getItem('id');
		const userQuestionsUrl = process.env.REACT_APP_API_URL + "/questions/user/" + user_id;

		fetch(userQuestionsUrl, {
			method: "GET",
			mode: "cors",
			headers: {
				Authorization: "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetResponse(response.status, json.response, 'user_questions_list')))
		.catch(error => this.handleGetError('user_questions_list'));
	}

	render() {
		return (
			<>
				<table class="news">
					<tbody><tr className="title_table_row"><td>Întrebările altora</td></tr></tbody>
					{this.state.questions_list}
					<tr><td> </td></tr>
					<tbody><tr className="title_table_row"><td>Întrebările tale</td></tr></tbody>
					{this.state.user_questions_list}
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
		.catch(error => this.handlePostError());
	}

	handleGetResponse(status, response, key) {
		let content = [];

		if(Math.floor(status / 100) === 2) {
			if(!response || !response.length) {
				this.setState({[key]: this.buildTbodyFromString('Nu există întrebări.')});
			} else {
				response.reverse();
				response.forEach((question) => {
					content.push(<tr className="regular_table_row"><td>{question.title}</td></tr>);
					content.push(<tr className="regular_table_row"><td>{question.question}</td></tr>);
					content.push(<tr className="regular_table_row"><td>{question.answer}</td></tr>);
					content.push(<tr className="regular_table_row"><td><hr /></td></tr>);
				});
				this.setState({[key]: (
					<tbody>
						{content}
					</tbody>
				)});
			}
		} else {
			this.setState({[key]: this.buildTbodyFromString("A apărut o eroare!")});
		}
	}

	handleGetError(key) {
		this.setState({[key]: this.buildTbodyFromString("A apărut o eroare!")});
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

	handlePostError() {
		this.setState({errorMessage: "A apărut o eroare!"});
		this.setState({successMessage: ""});
	}
}

export default Questions;