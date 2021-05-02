import './register.scss';
import { Link } from 'react-router-dom';

function Login() {
	const sty = {width: '100%'};
	return (
		<div class="form_wrapper">
			<div class="form_container">
				<div class="title_container">
					<h2>Autentificare utilizator</h2>
				</div>
				<div class="clearfix">
					<div class="">
						<form>
							<div class="input_field" style={sty}>
								<span>
									<i aria-hidden="true" class="fa fa-envelope"/>
								</span>
								<input type="email" name="email" placeholder="E-mail" required />
							</div>
							<div class="input_field">
								<span>
									<i aria-hidden="true" class="fa fa-lock"/>
								</span>
								<input type="password" name="password" placeholder="Parola" required />
							</div>
							<input class="button" type="submit" value="Autentificare"/>
						</form>
					</div>
				</div>
			</div>
			Nu ai cont?&nbsp;
			<Link to={'/register' }>
				<span>Creează cont nou</span>
			</Link>
		</div>
	);
}

export default Login;