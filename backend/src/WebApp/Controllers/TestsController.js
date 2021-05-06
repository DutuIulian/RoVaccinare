const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const TestsRepository = require('../../Infrastructure/PostgreSQL/Repository/TestsRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    TestPostBody,
    TestPutBody,
    TestResponse
} = require('../Models/Test.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const testBody = new TestPostBody(req.body);
    const test = await TestsRepository.addAsync(testBody.name, testBody.available_quantity, testBody.center_id);
    ResponseFilter.setResponseDetails(res, 201, new TestResponse(test), req.originalUrl);
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const testBody = new TestPutBody(req.body);
    await TestsRepository.updateAsync(testBody.id, testBody.name, testBody.available_quantity, testBody.center_id);
});

Router.get('/:center_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        center_id
    } = req.params;
    const tests = await TestsRepository.getAllByCenterIdAsync(center_id);
    ResponseFilter.setResponseDetails(res, 200, tests.map(test => new TestResponse(test)));
});

module.exports = Router;