import React from 'react';
import './styles.scss';
import { Link } from 'react-router-dom';

class SupportMenu extends React.Component {
	constructor(props) {
		super(props);

		this.storedJwt = localStorage.getItem('token');
		if(''.localeCompare(this.storedJwt) === 0
				|| this.storedJwt === null
				|| ('ADMIN'.localeCompare(localStorage.getItem('role')) !== 0 && 'SUPPORT'.localeCompare(localStorage.getItem('role')) !== 0)) {
			const history = this.props.history;
			history.push("/");
		}

		this.state = {
			questions_list: (
				<tbody>
					<tr><td></td></tr>
					<tr><td></td></tr>
					<tr><td></td></tr>
				</tbody>
			),
			unanswered_questions_list: (
				<tbody>
					<tr><td></td></tr>
					<tr><td></td></tr>
					<tr><td></td></tr>
				</tbody>
			),
			answered_questions_list: (
				<tbody>
					<tr><td></td></tr>
					<tr><td></td></tr>
					<tr><td></td></tr>
				</tbody>
			)
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

		const unansweredQuestionsUrl = process.env.REACT_APP_API_URL + "/questions/unanswered";
		fetch(unansweredQuestionsUrl, {
			method: "GET",
			mode: "cors",
			headers: {
				Authorization: "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetResponse(response.status, json.response, 'unanswered_questions_list')))
		.catch(error => this.handleGetError('unanswered_questions_list'));

		const answeredQuestionsUrl = process.env.REACT_APP_API_URL + "/questions/answered";
		fetch(answeredQuestionsUrl, {
			method: "GET",
			mode: "cors",
			headers: {
				Authorization: "Bearer " + this.storedJwt
			}
		})
		.then(response => response.json().then(json => this.handleGetResponse(response.status, json.response, 'answered_questions_list')))
		.catch(error => this.handleGetError('answered_questions_list'));
	}

	render() {
		return (
			<table class="news">
				<tbody><tr className="title_table_row"><td>Întrebări importante</td></tr></tbody>
				{this.state.questions_list}
				<tr><td> </td></tr>
				<tbody><tr className="title_table_row"><td>Întrebări care așteaptă răspuns</td></tr></tbody>
				{this.state.unanswered_questions_list}
				<tbody><tr className="title_table_row"><td>Celelalte întrebări</td></tr></tbody>
				{this.state.answered_questions_list}
			</table>
		);
	}

	handleGetResponse(status, response, key) {
		let content = [];

		if(Math.floor(status / 100) === 2) {
			if(!response || !response.length) {
				this.setState({[key]: this.buildTbodyFromString('Nu există întrebări.')});
			} else {
				response.forEach((question) => {
					content.push(<tr className="regular_table_row"><td>{question.title}</td></tr>);
					content.push(<tr className="regular_table_row"><td>{question.question}</td></tr>);
					if(key.localeCompare('questions_list') === 0) {
						content.push(<tr className="regular_table_row"><td>{question.answer}</td></tr>);
						content.push(<tr className="regular_table_row"><td><Link onClick={this.unpinQuestion.bind(this, question.id)}>Nu mai afișa ca întrebare importantă</Link></td></tr>);
					} else if(key.localeCompare('unanswered_questions_list') === 0) {
						content.push(<tr className="regular_table_row"><td><Link to={"/answer_question/" + question.id}><span>Răspunde</span></Link></td></tr>);
					} else {
						content.push(<tr className="regular_table_row"><td>{question.answer}</td></tr>);
						content.push(<tr className="regular_table_row"><td><Link onClick={this.pinQuestion.bind(this, question.id)}>Afișează ca întrebare importantă</Link></td></tr>);
					}
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

	pinQuestion(id) {
		const answeredQuestionsUrl = process.env.REACT_APP_API_URL + "/questions/pin/" + id;
		fetch(answeredQuestionsUrl, {
			method: "PUT",
			mode: "cors",
			headers: {
				Authorization: "Bearer " + this.storedJwt
			}
		})
		.then(response => window.location.reload());
	}

	unpinQuestion(id) {
		const answeredQuestionsUrl = process.env.REACT_APP_API_URL + "/questions/unpin/" + id;
		fetch(answeredQuestionsUrl, {
			method: "PUT",
			mode: "cors",
			headers: {
				Authorization: "Bearer " + this.storedJwt
			}
		})
		.then(response => window.location.reload());
	}
}

export default SupportMenu;