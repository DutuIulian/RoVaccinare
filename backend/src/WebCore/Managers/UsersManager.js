const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const RolesRepository = require('../../Infrastructure/PostgreSQL/Repository/RolesRepository.js');
const ActivationCodesRepository = require('../../Infrastructure/PostgreSQL/Repository/ActivationCodesRepository.js');
const AuthenticatedUserDto = require('../DTOs/AuthenticatedUserDto.js');
const RegisteredUserDto = require('../DTOs/RegisteredUserDto.js');
const ServerError = require('../../WebApp/Models/ServerError.js');
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

const makeCode = async (length) => {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }

    return result.join('');
}

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
        throw new ServerError(`Invalid user role!`, 400);
    }
    
    const code = await makeCode(16);
    const expiration = new Date(Date.now() + 15 * 60000);
    const activationCode = await ActivationCodesRepository.addAsync(code, expiration);
    
    const user = await UsersRepository.addAsync(email, encryptedPasword, last_name, first_name, cnp, address, role_id, activationCode.id);
    const registeredUser = new RegisteredUserDto(user.id, user.email, user.role_id);
    
    return registeredUser;
};

module.exports = {
    authenticateAsync,
    registerAsync
}