const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const TestAppointmentsRepository = require('../../Infrastructure/PostgreSQL/Repository/TestAppointmentsRepository.js');
const TestsRepository = require('../../Infrastructure/PostgreSQL/Repository/TestsRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const ServerError = require('../../WebApp/Models/ServerError.js');

const {
    TestAppointmentPostBody,
    TestAppointmentPutBody,
    TestAppointmentResponse,
    GraphResponse
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

Router.put('/status', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let id = req.body.id;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const appointment = await TestAppointmentsRepository.getByIdAsync(id);
    if (!appointment) {
        throw new ServerError(`Test appointment with id ${id} does not exist!`, 404);
    }

    if (appointment.user_id !== req.user.userId
            && req.user.userRole.localeCompare("ADMIN") !== 0
            && req.user.userRole.localeCompare("SUPPORT") !== 0) {
        throw new ServerError("Only ADMIN and SUPPORT users can update appointments for other users", 401);
    }

    let status = req.body.status;
    if(!status) {
        throw new ServerError("Missing status", 400);
    } else if(status.localeCompare("Ratat") === 0 || status.localeCompare("Anulat") === 0) {
        await TestsRepository.increaseQuantityById(appointment.test_id, +1);
    } else if(status.localeCompare("Inchis") !== 0) {
        throw new ServerError("Invalid status", 400);
    }

    await TestAppointmentsRepository.updateStatusAsync(id, status);
    ResponseFilter.setResponseDetails(res, 200, "The status was updated.");
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const testAppointmentBody = new TestAppointmentPutBody(req);
    await TestAppointmentsRepository.updateAsync(testAppointmentBody.id, testAppointmentBody.name, testAppointmentBody.address, testAppointmentBody.locality_id);
});

Router.get('/graph/:user_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    let {
        user_id
    } = req.params;
    const graph = await TestAppointmentsRepository.getGraphByUserId(user_id);

    var today = new Date(new Date().toDateString());
    var d = new Date();
    d.setDate(today.getDate() - 30);
    while (d <= today) {
        const exists = (r) => {
            return new Date(r.exact_date).getTime() === d.getTime();
        };
        if(!graph.some(exists)) {
            graph.push({count: '0', exact_date: new Date(d)});
        }
        d.setDate(d.getDate() + 1);
    }

    graph.sort((g1, g2) => {
        if(g1.exact_date < g2.exact_date) {
            return -1;
        } else {
            return 1;
        }
    });
    ResponseFilter.setResponseDetails(res, 200, graph.map(r => new GraphResponse(r)));
});

Router.get('/:user_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        user_id
    } = req.params;
    if (!user_id || user_id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const testAppointments = await TestAppointmentsRepository.getAllByUserIdAsync(user_id);
    ResponseFilter.setResponseDetails(res, 200, testAppointments.map(testAppointment => new TestAppointmentResponse(testAppointment)));
});

module.exports = Router;