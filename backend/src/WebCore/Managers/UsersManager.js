const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const RolesRepository = require('../../Infrastructure/PostgreSQL/Repository/RolesRepository.js');
const ActivationCodesRepository = require('../../Infrastructure/PostgreSQL/Repository/ActivationCodesRepository.js');
const AuthenticatedUserDto = require('../DTOs/AuthenticatedUserDto.js');
const RegisteredUserDto = require('../DTOs/RegisteredUserDto.js');
const ServerError = require('../../WebApp/Models/ServerError.js');
const MyJwt = require('../Security/Jwt/index.js');
const JwtPayloadDto = require('../DTOs/JwtPayloadDto.js');
const bcrypt = require('bcryptjs');

const authenticateAsync = async (email, hashedPassword) => {
    console.info(`Authenticates user with username ${email}`);

    const user = await UsersRepository.getByUsernameWithRoleAsync(email);
    
    if (!user) {
        throw new ServerError(`Utilizatorul cu username ${email} nu exista in sistem!`, 404);
    }
     
    bcrypt.compare(hashedPassword, user.password).then(function(result) {
        if(result === false) {
            throw new ServerError("Wrong password", 401);
        }
    });

    const payload = new JwtPayloadDto(user.id, user.role);
    const token = await MyJwt.generateTokenAsync(payload);
    const authenticatedUserDto = new AuthenticatedUserDto(token, user.email, user.role);
    
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

const sendMail = async (email, activationCode) => {
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Înregistrare ROVACCINARE',
        text: 'Bună ziua! Vă puteți activa contul urmărind acest link: http://localhost:3005/users/activate/' + activationCode
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.info('Email sent: ' + info.response);
        }
    });
}

const registerAsync = async (email, plainTextPassword, last_name, first_name, cnp, address, role) => {
    console.info(`Registers user with username ${email}`);
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
    sendMail(email, code);
    
    return registeredUser;
};

const activateAsync = async(code) => {
    console.info(`Activates user with code ${code}`);

    const activationCode = await ActivationCodesRepository.getByCodeAsync(code);
    if(!activationCode) {
        throw new ServerError(`Codul de activare ${code} nu exista in sistem!`, 404);
    }
    
    const user = await UsersRepository.getByActivationCodeIdAsync(activationCode.id);
    if (!user) {
        throw new ServerError(`Utilizatorul cu activation code id ${activationCode.id} nu exista in sistem!`, 404);
    }
    
    if(new Date(activationCode.expiration) < new Date()) {
        throw new ServerError(`Codul de activare a expirat!`, 410);
    }
    
    UsersRepository.updateActivatedAsync(user.id, true);
    return "success";
};

module.exports = {
    authenticateAsync,
    registerAsync,
    activateAsync
}