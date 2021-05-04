import React from 'react';
import ReactDOM from 'react-dom';
import Footer from './Footer';	
import Home from './Home';
import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import Activate from './Activate';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

let storedJwt = localStorage.getItem('token');
let accountLink = '';

if(storedJwt) {
	accountLink = (<Link to={'/logout'}><span>Deconectare</span></Link>);
} else {
	accountLink = (<Link to={'/login'}><span>Autentificare</span></Link>);
}

ReactDOM.render(
  <React.StrictMode>
	<Router>
		<div class="header-container">
			<Link to={'/'}><span>Pagina principală</span></Link>
			<Link to={'/'}><span>Testare</span></Link>
			<Link to={'/'}><span>Vaccinare</span></Link>
			{ accountLink }
		</div>
		<div id="title">
			<span>
				ROVACCINARE
			</span>
		</div>
		<Switch>
			<Route exact path='/' component={Home} />
			<Route path='/login' component={Login} />
			<Route path='/logout' component={Logout} />
			<Route path='/register' component={Register} />
			<Route path='/users/activate/:code' component={Activate} />
		</Switch>
	</Router>
	<Footer />
  </React.StrictMode>,
  document.getElementById('root')
);
