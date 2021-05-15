const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const VaccineCentersRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccineCentersRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    VaccineCenterPostBody,
    VaccineCenterPutBody,
    VaccineCenterResponse,
    VaccineCenterResponse2
} = require('../Models/VaccineCenter.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const vaccineCenterBody = new VaccineCenterPostBody(req.body);
    const vaccineCenter = await VaccineCentersRepository.addAsync(vaccineCenterBody.name, vaccineCenterBody.address, vaccineCenterBody.locality_id);
    ResponseFilter.setResponseDetails(res, 201, new VaccineCenterResponse(vaccineCenter), req.originalUrl);
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const vaccineCenterBody = new VaccineCenterPutBody(req.body, req.body.id);
    const vaccineCenter = await VaccineCentersRepository.updateAsync(vaccineCenterBody.id, vaccineCenterBody.name, vaccineCenterBody.address, vaccineCenterBody.locality_id);
    ResponseFilter.setResponseDetails(res, 200, new VaccineCenterResponse(vaccineCenter));
});

Router.get('/:id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        id
    } = req.params;
    const vaccineCenter = await VaccineCentersRepository.getByIdAsync(id);
    ResponseFilter.setResponseDetails(res, 200, new VaccineCenterResponse2(vaccineCenter));
});

Router.get('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const vaccineCenters = await VaccineCentersRepository.getAllAsync();
    ResponseFilter.setResponseDetails(res, 200, vaccineCenters.map(vaccineCenter => new VaccineCenterResponse(vaccineCenter)));
});

module.exports = Router;