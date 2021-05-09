import React from 'react';
import { Line } from 'react-chartjs-2';

class TestGraph extends React.Component {
    constructor(props) {
        super(props);
        this.user_id = props.userId;
        this.storedJwt = localStorage.getItem('token');

        this.state = {
            labels: [],
            datasets: [{
                label: 'Test Appointments',
                fill: false,
                lineTension: 0.5,
                backgroundColor: 'rgba(0,32,194,1)',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: []
            }]
        }

        const url = process.env.REACT_APP_API_URL + "/test_appointments/graph/" + this.user_id;

		fetch(url, {
			method: "GET",
			mode: "cors",
            headers: {
				"Authorization": "Bearer " + this.storedJwt
			}
		})
        .then(response => response.json().then(json => this.handleResponse(response.status, json.response)))
    }

    render() {
        return (
          <div>
            <Line data={this.state} />
          </div>
        );
    }

    handleResponse(status, response) {
        if(Math.floor(status / 100) === 2) {
            let datasets = this.state.datasets;
            datasets[0].data = response.map(row => parseInt(row.count));
            this.setState({datasets: datasets});

            let labels = response.map(row => row.exact_date);
            this.setState({labels: labels});
        }
    }
}

export default TestGraph;