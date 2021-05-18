const express = require('express');

const UsersManager = require('../../WebCore/Managers/UsersManager.js');
const UsersRepository = require('../../Infrastructure/PostgreSQL/Repository/UsersRepository.js');
const TestAppointmentsRepository = require('../../Infrastructure/PostgreSQL/Repository/TestAppointmentsRepository.js');
const TestCenterReviewsRepository = require('../../Infrastructure/PostgreSQL/Repository/TestCenterReviewsRepository.js');
const VaccineAppointmentsRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccineAppointmentsRepository.js');
const VaccineCenterReviewsRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccineCenterReviewsRepository.js');
const QuestionsRepository = require('../../Infrastructure/PostgreSQL/Repository/QuestionsRepository.js');
const JWTFilter = require('../Filters/JWTFilter.js');
const ServerError = require('../Models/ServerError.js');

const {
    UserRegisterBody,
    UserLoginBody,
    UserPutBody,
    UserRegisterResponse,
    UserLoginResponse,
    UserResponse
} = require ('../Models/Users.js');
const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const Router = express.Router();

Router.post('/register', async (req, res) => {
    const userBody = new UserRegisterBody(req.body);

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
    const userBody = new UserLoginBody(req.body);
    const userDto = await UsersManager.authenticateAsync(userBody.Email, userBody.Password);
    const user = new UserLoginResponse(userDto.Token, userDto.Role, userDto.Id);

    ResponseFilter.setResponseDetails(res, 200, user);
});

Router.put('/activate/:code', async (req, res) => {
    let {
        code
    } = req.params;

    const result = await UsersManager.activateAsync(code);

    if(result.localeCompare("success") === 0) {
        ResponseFilter.setResponseDetails(res, 200, result);
    } else {
        ResponseFilter.setResponseDetails(res, 400, result);
    }
});

Router.get('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const users = await UsersRepository.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, users.map(user => new UserResponse(user)));
});

Router.get('/:id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    let {
        id
    } = req.params;
    const user = await UsersRepository.getByIdAsync(id);

    ResponseFilter.setResponseDetails(res, 200, new UserResponse(user));
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

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const userBody = new UserPutBody(req.body);
    const user = await UsersRepository.updateById(userBody.id, userBody.email,
        userBody.last_name, userBody.first_name, userBody.cnp, userBody.address, userBody.role, userBody.activated);

    ResponseFilter.setResponseDetails(res, 200, new UserResponse(user));
});

Router.delete('/:id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    let {
        id
    } = req.params;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    
    await TestAppointmentsRepository.deleteByUserIdAsync(id);
    await TestCenterReviewsRepository.deleteByUserIdAsync(id);
    await VaccineAppointmentsRepository.deleteByUserIdAsync(id);
    await VaccineCenterReviewsRepository.deleteByUserIdAsync(id);
    await QuestionsRepository.deleteByUserIdAsync(id);
    const admins = await UsersRepository.getAllByRole("ADMIN");
    await QuestionsRepository.updateSupportUserIdAsync(id, admins[0].id);

    const user = await UsersRepository.deleteByIdAsync(id);
    if (!user) {
        throw new ServerError(`User with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;