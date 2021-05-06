const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const VaccineCentersRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccineCentersRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    VaccineCenterPostBody,
    VaccineCenterPutBody,
    VaccineCenterResponse
} = require('../Models/VaccineCenter.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const vaccineCenterBody = new VaccineCenterPostBody(req.body);
    const vaccineCenter = await VaccineCentersRepository.addAsync(vaccineCenterBody.name, vaccineCenterBody.address, vaccineCenterBody.locality_id);
    ResponseFilter.setResponseDetails(res, 201, new VaccineCenterResponse(vaccineCenter), req.originalUrl);
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const vaccineCenterBody = new VaccineCenterPutBody(req.body);
    await VaccineCentersRepository.updateAsync(vaccineCenterBody.id, vaccineCenterBody.name, vaccineCenterBody.address, vaccineCenterBody.locality_id);
});

Router.get('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const vaccineCenters = await VaccineCentersRepository.getAllAsync();
    ResponseFilter.setResponseDetails(res, 200, vaccineCenters.map(vaccineCenter => new VaccineCenterResponse(vaccineCenter)));
});

module.exports = Router;