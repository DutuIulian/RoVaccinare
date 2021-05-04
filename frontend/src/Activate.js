import React from 'react';
import { withRouter } from "react-router";
import './activate.scss';

class Activate extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            message: ""
        }
    }

    componentDidMount() {
        const code = this.props.match.params.code;
        this.fetchData(code);
    }

    fetchData = code => {
        const url = process.env.REACT_APP_API_URL + "/users/activate/" + code;
        fetch(url, {
            method: "PUT",
            mode: "cors",
        })
        .then(response => this.handleStatus(response.status))
        .catch(error => this.handleError());
    };
    
    handleStatus(status) {
        if(Math.floor(status / 100) === 2) {
            this.setState({message: "Succes! Contul a fost activat."});
        } else if(status === 410) {
            this.setState({message: "Codul a expirat!"});
        } else {
            this.setState({message: "Eroare!"});
        }
    }

    handleError() {
        this.setState({message: "Eroare!"});
    }

    render() {
        return (
            <p class="message-box" >{this.state.message}</p>
        );
    }
}

export default withRouter(Activate);
