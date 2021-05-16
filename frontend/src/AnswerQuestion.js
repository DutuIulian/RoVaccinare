import React from 'react';
import './styles.scss';

class AnswerQuestion extends React.Component {
	constructor(props) {
		super(props);

		this.storedJwt = localStorage.getItem('token');
		if(''.localeCompare(this.storedJwt) === 0
				|| this.storedJwt === null
				|| ('ADMIN'.localeCompare(localStorage.getItem('role')) !== 0 && 'SUPPORT'.localeCompare(localStorage.getItem('role')) !== 0)) {
			const history = this.props.history;
			history.push("/");
		}

		this.question_id = this.props.match.params.id;
		this.user_id = localStorage.getItem('id');
		this.state = {
			question: (
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
		const otherUsersQuestionsUrl = process.env.REACT_APP_API_URL + "/questions/" + this.question_id;

		fetch(otherUsersQuestionsUrl, {
			method: "GET",
			mode: "cors",
			headers: {
				Authorization: "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetResponse(response.status, json.response, 'question')))
		.catch(error => this.handleGetError('question'));
	}

	render() {
		return (
			<>
				<table class="news">
					{this.state.question}
				</table>
				<div class="form_wrapper">
					<div class="form_container">
						<div class="title_container">
							<h2>Răspunde la întrebare</h2>
						</div>
						<div class="clearfix">
							<div class="">
								<form onSubmit={this.formSubmit.bind(this)}>
									<div class="input_field">
										<textarea name="answer" placeholder="Răspuns" onChange={this.handleChange.bind(this, "answer")}
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
			"id": this.question_id,
			"answer": this.state.fields["answer"],
			"support_user_id": this.user_id
		};
		const url = process.env.REACT_APP_API_URL + "/questions/answer";

		fetch(url, {
			method: "PUT",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + this.storedJwt
			},
			body: JSON.stringify(data)
		})
		.then(response => this.handlePostResponse(response.status)) 
		.catch(error => this.handlePostError());
	}

	handleGetResponse(status, question, key) {
		let content = [];

		if(Math.floor(status / 100) === 2) {
			if(!question) {
				this.setState({[key]: this.buildTbodyFromString("A apărut o eroare!")});
			} else {
				content.push(<tr className="regular_table_row"><td>{question.title}</td></tr>);
				content.push(<tr className="regular_table_row"><td>{question.question}</td></tr>);
				content.push(<tr className="regular_table_row"><td>{question.user_name}</td></tr>);

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

	handlePostResponse(status) {
		if(Math.floor(status / 100) === 2) {
			this.setState({successMessage: "Răspunsul a fost trimis cu succes."});
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

export default AnswerQuestion;