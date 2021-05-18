const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const VaccinesRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccinesRepository.js');
const VaccineAppointmentsRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccineAppointmentsRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    VaccinePostBody,
    VaccinePutBody,
    VaccineResponse
} = require('../Models/Vaccine.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const vaccineBody = new VaccinePostBody(req.body);
    const vaccine = await VaccinesRepository.addAsync(vaccineBody.name, vaccineBody.available_quantity, vaccineBody.center_id);
    ResponseFilter.setResponseDetails(res, 201, new VaccineResponse(vaccine), req.originalUrl);
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const vaccineBody = new VaccinePutBody(req.body, req.body.id);
    const vaccine = await VaccinesRepository.updateAsync(vaccineBody.id, vaccineBody.name, vaccineBody.available_quantity);
    ResponseFilter.setResponseDetails(res, 200, new VaccineResponse(vaccine));
});

Router.get('/vaccine_center/:center_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        center_id
    } = req.params;
    if (!center_id || center_id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const vaccines = await VaccinesRepository.getAllByCenterIdAsync(center_id);
    ResponseFilter.setResponseDetails(res, 200, vaccines.map(vaccine => new VaccineResponse(vaccine)));
});

Router.get('/:id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        id
    } = req.params;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const vaccine = await VaccinesRepository.getByIdAsync(id);
    if (!vaccine) {
        throw new ServerError(`Vaccine with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new VaccineResponse(vaccine));
});

Router.delete('/:id', async (req, res) => {
    let {
        id
    } = req.params;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    
    await VaccineAppointmentsRepository.deleteByVaccineIdAsync(id);
    const vaccine = await VaccinesRepository.deleteByIdAsync(id);
    if (!vaccine) {
        throw new ServerError(`Vaccine with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;