import React from 'react';
import { useHistory } from "react-router-dom";

function Logout() {
	localStorage.setItem('token', '');
	const storedJwt = localStorage.getItem('token');
	const history = useHistory();
	history.push("/");
	window.location.reload();
	return (<></>);
}

export default Logout;