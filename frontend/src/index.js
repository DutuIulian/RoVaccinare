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
import AnswerQuestion from './AnswerQuestion'
import AddNews from './AddNews'
import EditNews from './EditNews'
import AdminMenu from './AdminMenu'
import AdministerUser from './AdministerUser'
import SupportMenu from './SupportMenu'
import AddUser from './AddUser'
import AddTestCenter from './AddTestCenter'
import EditTestCenter from './EditTestCenter'
import AddTest from './AddTest'
import EditTest from './EditTest'
import AddVaccineCenter from './AddVaccineCenter'
import EditVaccineCenter from './EditVaccineCenter'
import AddVaccine from './AddVaccine'
import EditVaccine from './EditVaccine'
import Appointments from './Appointments'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

let storedJwt = localStorage.getItem('token');
let links = '';

if(storedJwt !== null && storedJwt.localeCompare('') !== 0) {
	links = [
		<Link to={'/test_centers'}><span>Test</span></Link>,
		<Link to={'/vaccine_centers'}><span>Vaccin</span></Link>,
		<Link to={'/questions'}><span>Întrebări</span></Link>
	];
	if('ADMIN'.localeCompare(localStorage.getItem('role')) === 0) {
		links.push(<Link to={'/admin'}><span>Administrare</span></Link>);
	}
	if('ADMIN'.localeCompare(localStorage.getItem('role')) === 0
			|| 'SUPPORT'.localeCompare(localStorage.getItem('role')) === 0) {
		links.push(<Link to={'/support'}><span>Support</span></Link>);
	}
	if('USER'.localeCompare(localStorage.getItem('role')) === 0) {
		links.push(<Link to={'/appointments'}><span>Programări</span></Link>);
	}
	links.push(<Link to={'/logout'}><span>Deconectare</span></Link>);
} else {
	links = (<Link to={'/login'}><span>Autentificare</span></Link>);
}

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<div class="header-container">
				<Link to={'/'}><span>Acasă</span></Link>
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
				<Route path='/answer_question/:id' component={AnswerQuestion} />
				<Route path='/add_news' component={AddNews} />
				<Route path='/edit_news/:id' component={EditNews} />
				<Route path='/admin' component={AdminMenu} />
				<Route path='/administer_user/:id' component={AdministerUser} />
				<Route path='/support' component={SupportMenu} />
				<Route path='/add_user' component={AddUser} />
				<Route path='/add_test_center' component={AddTestCenter} />
				<Route path='/edit_test_center/:id' component={EditTestCenter} />
				<Route path='/add_test/:id' component={AddTest} />
				<Route path='/edit_test/:id' component={EditTest} />
				<Route path='/add_vaccine_center' component={AddVaccineCenter} />
				<Route path='/edit_vaccine_center/:id' component={EditVaccineCenter} />
				<Route path='/add_vaccine/:id' component={AddVaccine} />
				<Route path='/edit_vaccine/:id' component={EditVaccine} />
				<Route path='/appointments' component={Appointments} />
			</Switch>
		</Router>
		<Footer />
	</React.StrictMode>,
	document.getElementById('root')
);
