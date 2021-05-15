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
    const testBody = new TestPutBody(req.body, req.body.id);
    const test = await TestsRepository.updateAsync(testBody.id, testBody.name, testBody.available_quantity);
    ResponseFilter.setResponseDetails(res, 200, new TestResponse(test));
});

Router.get('/test_center/:center_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        center_id
    } = req.params;
    if (!center_id || center_id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const tests = await TestsRepository.getAllByCenterIdAsync(center_id);
    ResponseFilter.setResponseDetails(res, 200, tests.map(test => new TestResponse(test)));
});

Router.get('/:id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        id
    } = req.params;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const test = await TestsRepository.getByIdAsync(id);
    if (!newtests) {
        throw new ServerError(`Test with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new TestResponse(test));
});


Router.delete('/:id', async (req, res) => {
    let {
        id
    } = req.params;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    
    const test = await TestsRepository.deleteByIdAsync(id);
    if (!test) {
        throw new ServerError(`Test with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;