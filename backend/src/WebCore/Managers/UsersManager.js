const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const RolesRepository = require('../../Infrastructure/PostgreSQL/Repository/RolesRepository.js');
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

const registerAsync = async (email, plainTextPassword, last_name, first_name, cnp, address, role) => {
    const salt = await bcrypt.genSalt(10);
    const encryptedPasword = await bcrypt.hash(plainTextPassword, salt);
    const roles = await RolesRepository.getAllAsync();
    
    let role_id = "-1";
    for(let i = 0; i < roles.length; i++) {
        if(roles[i]["value"].localeCompare(role) === 0) {
            role_id = roles[i]["id"];
            console.log(roles[i]["id"]);
            console.log(roles[i]["value"]);
            console.log('jeje0');
        }
    }
    
    if("-1".localeCompare(role_id) === 0) {
        console.log('jeje');
        throw new ServerError(`Invalid user role!`, 400);
    }
    
    const user = await UsersRepository.addAsync(email, encryptedPasword, last_name, first_name, cnp, address, role_id);
    const registeredUser = new RegisteredUserDto(user.id, user.email, user.role_id);
    
    return registeredUser;
};

module.exports = {
    authenticateAsync,
    registerAsync
}