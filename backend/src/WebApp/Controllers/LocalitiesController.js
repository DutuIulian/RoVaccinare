const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const LocalitiesRepository = require('../../Infrastructure/PostgreSQL/Repository/LocalitiesRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    LocalityPostBody,
    LocalityPutBody,
    LocalityResponse
} = require('../Models/Locality.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const localityBody = new LocalitiesPostBody(req.body);
    const locality = await LocalitiesRepository.addAsync(localityBody.title, localityBody.content);
    ResponseFilter.setResponseDetails(res, 201, new LocalityResponse(locality), req.originalUrl);
});

Router.get('/', async (req, res) => {
    const localities = await LocalitiesRepository.getAllAsync();
    ResponseFilter.setResponseDetails(res, 200, localities.map(locality => new LocalityResponse(locality)));
});

module.exports = Router;