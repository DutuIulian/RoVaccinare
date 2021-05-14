import React from 'react';
import { Link } from 'react-router-dom';
import './centers.scss';

class Tests extends React.Component {
    constructor(props) {
        super(props);

        this.storedJwt = localStorage.getItem('token');
        if(this.storedJwt === null || this.storedJwt.localeCompare('') === 0) {
            const history = this.props.history;
            history.push("/login");
        }

        this.state = {
            test_list: <tbody><tr><td>Lista se încarcă...</td></tr></tbody>
        }
    }

    componentDidMount() {
        this.id = this.props.match.params.id;
        this.fetchData(this.id);
    }

    fetchData = id => {
        const url = process.env.REACT_APP_API_URL + "/tests/" + id;

        fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                Authorization: "Bearer " + this.storedJwt
            }
        })
        .then(response => response.json().then(json => this.handleResponse(response.status, json.response)))
        .catch(error => this.handleError());
    }

    render() {
        if('ADMIN'.localeCompare(localStorage.getItem('role')) === 0) {
            return (
                <table class="centers-box">
                    <thead><tr><td></td><td></td><td></td><td></td><td><Link to={'/add_test/' + this.id}><input type="submit" value="Adaugă" /></Link></td></tr></thead>
                    { this.state.test_list }
                </table>
            );
        } else {
            return (
                <table class="centers-box">
                    { this.state.test_list }
                </table>
            );
        }
    }

    handleResponse(status, response) {
        let content = [];

        if(Math.floor(status / 100) === 2) {
            if(!response || !response.length) {
                this.setState({test_list: this.buildTbodyFromString('Nu există niciun test disponibil.')});
            } else {
                response.forEach((test) => {
                    if(test.available_quantity > 0) {
                        content.push(
                            <tr>
                                <td>{test.name}</td>
                                <td>{test.available_quantity}</td>
                                <td>
                                    <Link to={'/schedule_test/' + test.id}><span>Programează-te</span></Link>
                                </td>
                            </tr>
                        );
                    }
                });
                this.setState({test_list: (
                    <>
                        <thead>
                            <tr>
                                <td>Tip</td>
                                <td>Numar</td>
                            </tr>
                        </thead>
                        <tbody>
                            {content}
                        </tbody>
                    </>
                )});
            }
        } else {
            this.setState({test_list: this.buildTbodyFromString("A apărut o eroare!")});
        }
    }
    
    handleError() {
        this.setState({test_list: this.buildTbodyFromString("A apărut o eroare!")});
    }

    buildTbodyFromString(text) {
        return (
            <tbody><tr><td>{text}</td></tr></tbody>
        );
    }
}

export default Tests;