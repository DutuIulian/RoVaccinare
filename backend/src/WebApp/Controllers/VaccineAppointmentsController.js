const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const VaccineAppointmentsRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccineAppointmentsRepository.js');
const VaccinesRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccinesRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const ServerError = require('../../WebApp/Models/ServerError.js');

const {
    VaccineAppointmentPostBody,
    VaccineAppointmentPutBody,
    VaccineAppointmentResponse
} = require('../Models/VaccineAppointment.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const vaccineAppointmentBody = new VaccineAppointmentPostBody(req);
    const userActiveAppointments = await VaccineAppointmentsRepository.getAllActiveByUserIdAsync(vaccineAppointmentBody.user_id);
    if(userActiveAppointments.length > 0) {
        throw new ServerError("Only one active appointment per user is permitted", 403);
    }

    const vaccineAppointment = await VaccineAppointmentsRepository.addAsync(vaccineAppointmentBody.date_time, vaccineAppointmentBody.vaccine_id, vaccineAppointmentBody.user_id);
    await VaccinesRepository.increaseQuantityById(vaccineAppointmentBody.vaccine_id, -1);
    ResponseFilter.setResponseDetails(res, 201, new VaccineAppointmentResponse(vaccineAppointment), req.originalUrl);
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const vaccineAppointmentBody = new VaccineAppointmentPutBody(req);
    await VaccineAppointmentsRepository.updateAsync(vaccineAppointmentBody.id, vaccineAppointmentBody.name, vaccineAppointmentBody.address, vaccineAppointmentBody.locality_id);
});

Router.get('/:user_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        user_id
    } = req.params;
    const vaccineAppointments = await VaccineAppointmentsRepository.getAllByUserIdAsync(user_id);
    ResponseFilter.setResponseDetails(res, 200, vaccineAppointments.map(vaccineAppointment => new VaccineAppointmentResponse(vaccineAppointment)));
});

module.exports = Router;