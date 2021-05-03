const express = require('express');

const UsersManager = require('../../WebCore/Managers/UsersManager.js');
const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const JWTFilter = require('../Filters/JWTFilter.js');
const ServerError = require('../Models/ServerError.js');

const {
    UserBody,
    UserRegisterResponse,
    UserLoginResponse
} = require ('../Models/Users.js');
const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const Router = express.Router();

Router.post('/register', async (req, res) => {
    console.log(req.body);
    const userBody = new UserBody(req.body);

    try {
        const user = await UsersManager.registerAsync(
            userBody.email, userBody.password, userBody.last_name, userBody.first_name,
            userBody.cnp, userBody.address, userBody.role
        );
        ResponseFilter.setResponseDetails(res, 201, new UserRegisterResponse(user));
    } catch(error) {
        console.log(error);
        throw new ServerError(`Username already exists!`, 409);
    }
});

Router.post('/login', async (req, res) => {

    const userBody = new UserBody(req.body);
    const userDto = await UsersManager.authenticateAsync(userBody.Username, userBody.Password);
    const user = new UserLoginResponse(userDto.Token, userDto.Role);

    ResponseFilter.setResponseDetails(res, 200, user);
});

Router.get('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {

    const users = await UsersRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, users.map(user => new UserRegisterResponse(user)));
});

Router.put('/:userId/role/:roleId', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    let {
        userId,
        roleId
    } = req.params;

    userId = parseInt(userId);
    roleId = parseInt(roleId);
    
    await UsersRepository.updateRole(userId, roleId);
});

module.exports = Router;