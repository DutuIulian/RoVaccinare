import React from 'react';
import ReactDOM from 'react-dom';
import Footer from './Footer';	
import Home from './Home';
import Register from './Register';
import Login from './Login';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
	<Router>
		<div class="header-container">
			<Link to={'/'}><span>Pagina principală</span></Link>
			<Link to={'/'}><span>Testare</span></Link>
			<Link to={'/'}><span>Vaccinare</span></Link>
			<Link to={'/login'}><span>Autentificare</span></Link>
		</div>
		<div id="title">
			<span>
				ROVACCINARE
			</span>
		</div>
		<Switch>
			<Route exact path='/' component={Home} />
			<Route path='/login' component={Login} />
			<Route path='/register' component={Register} />
		</Switch>
	</Router>
	<Footer />
  </React.StrictMode>,
  document.getElementById('root')
);
