import React from 'react';
import './styles.scss';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			news_list: (
				<tbody>
					<tr><td></td></tr>
					<tr><td></td></tr>
					<tr><td></td></tr>
				</tbody>
			)
		}
	}

	componentDidMount() {
		const url = process.env.REACT_APP_API_URL + "/news";

		fetch(url, {
			method: "GET",
			mode: "cors",
		})
		.then(response => response.json().then(json => this.handleResponse(response.status, json.response)))
		.catch(error => this.handleError());
	}

	render() {
		return (
			<table class="news">
				{this.state.news_list}
			</table>
		);
	}

	handleResponse(status, response) {
		let content = [];

		if(Math.floor(status / 100) === 2) {
			if(!response || !response.length) {
				this.setState({news_list: this.buildTbodyFromString('Nu există știri.')});
			} else {
				response.reverse();
				response.forEach((news) => {
					content.push(<tr className="bold_table_row"><td>{news.title}</td></tr>);
					content.push(<tr className="regular_table_row"><td>{news.time_posted}</td></tr>);
					content.push(<tr className="regular_table_row"><td>{news.content}</td></tr>);
				});
				this.setState({news_list: (
					<tbody>
						{content}
					</tbody>
				)});
			}
		} else {
			this.setState({news_list: this.buildTbodyFromString("A apărut o eroare!")});
		}
	}

	handleError() {
		this.setState({news_list: this.buildTbodyFromString("A apărut o eroare!")});
	}

	buildTbodyFromString(text) {
		return (
			<tbody><tr><td>{text}</td></tr></tbody>
		);
	}
}

export default Home;