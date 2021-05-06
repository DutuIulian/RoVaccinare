import React from 'react';
import ReactDOM from 'react-dom';
import Footer from './Footer';	
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import Activate from './Activate';
import TestCenters from './TestCenters';
import Tests from './Tests';
import ScheduleTest from './ScheduleTest'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

let storedJwt = localStorage.getItem('token');
let links = '';

if(storedJwt.localeCompare('') !== 0) {
	links = (
		<>
			<Link to={'/test_centers'}><span>Testare</span></Link>
			<Link to={'/vaccine_centers'}><span>Vaccinare</span></Link>
			<Link to={'/logout'}><span>Deconectare</span></Link>
		</>
	);
} else {
	links = (<Link to={'/login'}><span>Autentificare</span></Link>);
}

ReactDOM.render(
  <React.StrictMode>
	<Router>
		<div class="header-container">
			<Link to={'/'}><span>Pagina principală</span></Link>
			{ links }
		</div>
		<div id="title">
			<span>
				ROVACCINARE
			</span>
		</div>
		<Switch>
			<Route exact path='/' component={Home} />
			<Route path='/register' component={Register} />
			<Route path='/users/activate/:code' component={Activate} />
			<Route path='/login' component={Login} />
			<Route path='/logout' component={Logout} />
			<Route path='/test_centers/' component={TestCenters} />
			<Route path='/tests/:id' component={Tests} />
			<Route path='/schedule_test/:id' component={ScheduleTest} />
			<Route path='/vaccine_centers' component={TestCenters} />
		</Switch>
	</Router>
	<Footer />
  </React.StrictMode>,
  document.getElementById('root')
);
