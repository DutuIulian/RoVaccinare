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
import TestCenterReviews from './TestCenterReviews'
import VaccineCenters from './VaccineCenters';
import Vaccines from './Vaccines';
import ScheduleVaccine from './ScheduleVaccine'
import VaccineCenterReviews from './VaccineCenterReviews'
import Questions from './Questions'
import AddNews from './AddNews'
import EditNews from './EditNews'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

let storedJwt = localStorage.getItem('token');
let links = '';

if(storedJwt !== null && storedJwt.localeCompare('') !== 0) {
	links = (
		<>
			<Link to={'/test_centers'}><span>Testare</span></Link>
			<Link to={'/vaccine_centers'}><span>Vaccinare</span></Link>
			<Link to={'/questions'}><span>Întrebări</span></Link>
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
			<Route path='/test_center_reviews/:id' component={TestCenterReviews} />
			<Route path='/vaccine_centers/' component={VaccineCenters} />
			<Route path='/vaccines/:id' component={Vaccines} />
			<Route path='/schedule_vaccine/:id' component={ScheduleVaccine} />
			<Route path='/vaccine_center_reviews/:id' component={VaccineCenterReviews} />
			<Route path='/questions' component={Questions} />
			<Route path='/add_news' component={AddNews} />
			<Route path='/edit_news/:id' component={EditNews} />
		</Switch>
	</Router>
	<Footer />
  </React.StrictMode>,
  document.getElementById('root')
);
