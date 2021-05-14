import React from 'react';
import { Link } from 'react-router-dom';
import './centers.scss';

class Vaccines extends React.Component {
    constructor(props) {
        super(props);

        this.storedJwt = localStorage.getItem('token');
        if(this.storedJwt === null || this.storedJwt.localeCompare('') === 0) {
            const history = this.props.history;
            history.push("/login");
        }

        this.state = {
            vaccine_list: <tbody><tr><td>Lista se încarcă...</td></tr></tbody>
        }
    }

    componentDidMount() {
        this.id = this.props.match.params.id;
        this.fetchData(this.id);
    }

    fetchData = id => {
        const url = process.env.REACT_APP_API_URL + "/vaccines/" + id;

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
                    <thead><tr><td></td><td></td><td></td><td></td><td><Link to={'/add_vaccine/' + this.id}><input type="submit" value="Adaugă" /></Link></td></tr></thead>
                    { this.state.vaccine_list }
                </table>
            );
        } else {
            return (
                <table class="centers-box">
                    { this.state.vaccine_list }
                </table>
            );
        }
    }

    handleResponse(status, response) {
        let content = [];

        if(Math.floor(status / 100) === 2) {
            if(!response || !response.length) {
                this.setState({vaccine_list: this.buildTbodyFromString('Nu există niciun vaccin disponibil.')});
            } else {
                response.forEach((vaccine) => {
                    if(vaccine.available_quantity > 0) {
                        content.push(
                            <tr>
                                <td>{vaccine.name}</td>
                                <td>{vaccine.available_quantity}</td>
                                <td>
                                    <Link to={'/schedule_vaccine/' + vaccine.id}><span>Programează-te</span></Link>
                                </td>
                            </tr>
                        );
                    }
                });
                this.setState({vaccine_list: (
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
            this.setState({vaccine_list: this.buildTbodyFromString("A apărut o eroare!")});
        }
    }
    
    handleError() {
        this.setState({vaccine_list: this.buildTbodyFromString("A apărut o eroare!")});
    }

    buildTbodyFromString(text) {
        return (
            <tbody><tr><td>{text}</td></tr></tbody>
        );
    }
}

export default Vaccines;