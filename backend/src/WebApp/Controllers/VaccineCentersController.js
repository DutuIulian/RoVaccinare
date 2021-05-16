const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const VaccineCentersRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccineCentersRepository.js');
const VaccineCenterReviewsRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccineCenterReviewsRepository.js');
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
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const vaccineCenter = await VaccineCentersRepository.getByIdAsync(id);
    if (!vaccineCenter) {
        throw new ServerError(`Vaccine center with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new VaccineCenterResponse2(vaccineCenter));
});

Router.get('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const vaccineCenters = await VaccineCentersRepository.getAllAsync();
    ResponseFilter.setResponseDetails(res, 200, vaccineCenters.map(vaccineCenter => new VaccineCenterResponse(vaccineCenter)));
});

Router.delete('/:id', async (req, res) => {
    let {
        id
    } = req.params;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    
    await VaccineCenterReviewsRepository.deleteByVaccineCenterIdAsync(id);
    const vaccine_center = await VaccineCentersRepository.deleteByIdAsync(id);
    if (!vaccine_center) {
        throw new ServerError(`Vaccine center with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;