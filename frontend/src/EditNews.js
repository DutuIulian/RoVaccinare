import React from 'react';
import './register.scss';

class EditNews extends React.Component {
	constructor(props){
		super(props);

		this.storedJwt = localStorage.getItem('token');
		if(''.localeCompare(this.storedJwt) === 0
				|| this.storedJwt === null
				|| 'ADMIN'.localeCompare(localStorage.getItem('role')) !== 0) {
			const history = this.props.history;
			history.push("/");
		}

		this.news_id = this.props.match.params.id;
		this.title_ref = React.createRef();
		this.content_ref = React.createRef();

		this.state = {
			fields: {},
			successMessage: "",
			errorMessage: ""
		}
	}

	componentDidMount() {
		const url = process.env.REACT_APP_API_URL + "/news/" + this.news_id;

		fetch(url, {
			method: "GET",
			mode: "cors",
		})
		.then(response => response.json().then(json => this.handleGetResponse(response.status, json.response)))
		.catch(error => {});
	}

	render() {
		return (
			<div class="form_wrapper">
				<div class="form_container">
					<div class="title_container">
						<h2>Editează știrea</h2>
					</div>
					<div class="clearfix">
						<div class="">
							<form onSubmit={this.formSubmit.bind(this)}>
								<div class="input_field" style={{width: '100%'}}>
									<span>
										<i aria-hidden="true" class="fa fa-envelope"/>
									</span>
									<input type="text" name="title" placeholder="Titlu" onChange={this.handleChange.bind(this, "title")}
										ref={this.title_ref} minLength="4" required />
								</div>
								<div class="input_field">
									<textarea name="content" placeholder="Text" onChange={this.handleChange.bind(this, "content")}
										ref={this.content_ref} rows="10" style={{width: '100%'}} minLength="4" required />
								</div>
								<input class="button" type="submit" value="Modifică" />
								<span style={{color: "green", "display": "table", "margin": "0 auto"}}>{this.state.successMessage}</span>
								<span style={{color: "red", "display": "table", "margin": "0 auto"}}>{this.state.errorMessage}</span>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}

	handleGetResponse(status, response) {
		if(Math.floor(status / 100) === 2) {
			let fields = {};
			fields["title"] = response.title;
			fields["content"] = response.content;
			this.setState({fields: fields});

			this.title_ref.current.value = response.title;
			this.content_ref.current.value = response.content;
		}
	}

	handleChange(field, e){			
		let fields = this.state.fields;
		fields[field] = e.target.value;		  
		this.setState({fields});
	}
	
	formSubmit(e) {
		e.preventDefault();

		const data = {
			"id": this.news_id,
			"title": this.state.fields["title"],
			"content": this.state.fields["content"]
		};
		const url = process.env.REACT_APP_API_URL + "/news";

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
			this.setState({successMessage: 'Știrea a fost modificată cu succes.'});
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

export default EditNews;