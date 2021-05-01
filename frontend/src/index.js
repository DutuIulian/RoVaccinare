import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Home';
import Header from './Header';
import Footer from './Footer';

ReactDOM.render(
  <React.StrictMode>
	<Header />
	<Home />
	<Footer />
  </React.StrictMode>,
  document.getElementById('root')
);
