const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const VaccinesRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccinesRepository.js');
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
    const vaccineBody = new VaccinePutBody(req.body);
    await VaccinesRepository.updateAsync(vaccineBody.id, vaccineBody.name, vaccineBody.available_quantity, vaccineBody.center_id);
});

Router.get('/:center_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        center_id
    } = req.params;
    const vaccines = await VaccinesRepository.getAllByCenterIdAsync(center_id);
    ResponseFilter.setResponseDetails(res, 200, vaccines.map(vaccine => new VaccineResponse(vaccine)));
});

module.exports = Router;