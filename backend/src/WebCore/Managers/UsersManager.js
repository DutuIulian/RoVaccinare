const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const AuthenticatedUserDto = require('../DTOs/AuthenticatedUserDto.js');
const RegisteredUserDto = require('../DTOs/RegisteredUserDto.js');
const MyJwt = require('../Security/Jwt/index.js');
const JwtPayloadDto = require('../DTOs/JwtPayloadDto.js');
const bcrypt = require('bcryptjs');

const authenticateAsync = async (username, hashedPassword) => {

    console.info(`Authenticates user with username ${username}`);

    const user = await UsersRepository.getByUsernameWithRoleAsync(username);
    
    if (!user) {
        throw new ServerError(`Utilizatorul cu username ${username} nu exista in sistem!`, 404);
    }

    /**
     * TODO
     * 
     * pas 1: verifica daca parola este buna (hint: functia compareAsync)
     * pas 1.1.: compare returneaza true sau false. Daca parola nu e buna, arunca eroare
     * pas 2: genereaza token cu payload-ul JwtPayload
     * pas 3: returneaza AuthenticatedUserDto
     */
	 
	bcrypt.compare(hashedPassword, user.password).then(function(result) {
		if(result === false) {
			throw new ServerError("Wrong password", 401);
		}
	});

	const payload = new JwtPayloadDto(user.id, user.role);
	const token = await MyJwt.generateTokenAsync(payload);
	const authenticatedUserDto = new AuthenticatedUserDto(token, user.username, user.role);
	
	return authenticatedUserDto;
};

const registerAsync = async (username, plainTextPassword) => {
    /**
     * TODO
     * 
     * pas 1: cripteaza parola
     * pas 2: adauga (username, parola criptata) in baza de date folosind UsersRepository.addAsync
     * pas 3: returneaza RegisteredUserDto
     * 
     */
	 
	 const salt = await bcrypt.genSalt(10);
	 const encryptedPasword = await bcrypt.hash(plainTextPassword, salt);
	 const user = await UsersRepository.addAsync(username, encryptedPasword);
	 const registeredUser = new RegisteredUserDto(user.id, user.username, user.role_id);
	 
	 return registeredUser;
};

module.exports = {
    authenticateAsync,
    registerAsync
}