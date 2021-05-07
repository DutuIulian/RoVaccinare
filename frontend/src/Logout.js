import React from 'react';
import { useHistory } from "react-router-dom";

function Logout() {
	localStorage.setItem('token', '');
	localStorage.setItem('role', '');
	localStorage.setItem('id', -1);
	const history = useHistory();
	history.push("/");
	window.location.reload();
	return (<></>);
}

export default Logout;