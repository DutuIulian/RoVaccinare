const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const TestCentersRepository = require('../../Infrastructure/PostgreSQL/Repository/TestCentersRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    TestCenterPostBody,
    TestCenterPutBody,
    TestCenterResponse,
    TestCenterResponse2
} = require('../Models/TestCenter.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const testCenterBody = new TestCenterPostBody(req.body);
    const testCenter = await TestCentersRepository.addAsync(testCenterBody.name, testCenterBody.address, testCenterBody.locality_id);
    ResponseFilter.setResponseDetails(res, 201, new TestCenterResponse(testCenter), req.originalUrl);
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const testCenterBody = new TestCenterPutBody(req.body, req.body.id);
    const testCenter = await TestCentersRepository.updateAsync(testCenterBody.id, testCenterBody.name, testCenterBody.address, testCenterBody.locality_id);
    ResponseFilter.setResponseDetails(res, 200, new TestCenterResponse(testCenter));
});

Router.get('/:id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        id
    } = req.params;
    const testCenter = await TestCentersRepository.getByIdAsync(id);
    ResponseFilter.setResponseDetails(res, 200, new TestCenterResponse2(testCenter));
});

Router.get('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const testCenters = await TestCentersRepository.getAllAsync();
    ResponseFilter.setResponseDetails(res, 200, testCenters.map(testCenter => new TestCenterResponse(testCenter)));
});

module.exports = Router;