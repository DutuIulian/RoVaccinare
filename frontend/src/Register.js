import './register.scss';

function Register() {
	return (
		<div class="form_wrapper">
			<div class="form_container">
				<div class="title_container">
					<h2>Înregistrare utilizator</h2>
				</div>
				<div class="clearfix">
					<div class="">
						<form>
							<div class="input_field">
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
							<div class="input_field">
								<span>
									<i aria-hidden="true" class="fa fa-lock"/>
								</span>
								<input type="password" name="password" placeholder="Parola (confirmare)" required />
							</div>
							<div class="input_field">
								<span>
									<i aria-hidden="true" class="fa fa-user"/>
								</span>
								<input type="text" name="name" placeholder="Nume"/>
							</div>
							<div class="input_field">
								<span>
									<i aria-hidden="true" class="fa fa-user"/>
								</span>
								<input type="text" name="name" placeholder="Prenume" required />
							</div>
							<div class="input_field">
								<span>
									<i aria-hidden="true" class="fa fa-address-card"/>
								</span>
								<input type="text" name="cnp" placeholder="CNP" required />
							</div>
							<div class="input_field">
								<span>
									<i aria-hidden="true" class="fa fa-address-card"/>
								</span>
								<input type="text" name="address" placeholder="Adresă" required />
							</div>
							<input class="button" type="submit" value="Înregistrare"/>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;