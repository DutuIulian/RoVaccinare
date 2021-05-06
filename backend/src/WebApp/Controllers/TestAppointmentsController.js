const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const TestAppointmentsRepository = require('../../Infrastructure/PostgreSQL/Repository/TestAppointmentsRepository.js');
const TestsRepository = require('../../Infrastructure/PostgreSQL/Repository/TestsRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const ServerError = require('../../WebApp/Models/ServerError.js');

const {
    TestAppointmentPostBody,
    TestAppointmentPutBody,
    TestAppointmentResponse
} = require('../Models/TestAppointment.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const testAppointmentBody = new TestAppointmentPostBody(req);
    const userActiveAppointments = await TestAppointmentsRepository.getAllActiveByUserIdAsync(testAppointmentBody.user_id);
    if(userActiveAppointments.length > 0) {
        throw new ServerError("Only one active appointment per user is permitted", 403);
    }

    const testAppointment = await TestAppointmentsRepository.addAsync(testAppointmentBody.date_time, testAppointmentBody.test_id, testAppointmentBody.user_id);
    await TestsRepository.increaseQuantityById(testAppointmentBody.test_id, -1);
    ResponseFilter.setResponseDetails(res, 201, new TestAppointmentResponse(testAppointment), req.originalUrl);
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const testAppointmentBody = new TestAppointmentPutBody(req);
    await TestAppointmentsRepository.updateAsync(testAppointmentBody.id, testAppointmentBody.name, testAppointmentBody.address, testAppointmentBody.locality_id);
});

Router.get('/:user_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        user_id
    } = req.params;
    const testAppointments = await TestAppointmentsRepository.getAllByUserIdAsync(user_id);
    ResponseFilter.setResponseDetails(res, 200, testAppointments.map(testAppointment => new TestAppointmentResponse(testAppointment)));
});

module.exports = Router;