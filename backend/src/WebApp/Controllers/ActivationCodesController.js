const express = require('express');

const ActivationCodesRepository = require('../../Infrastructure/PostgreSQL/Repository/ActivationCodesRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    ActivationCodePostBody,
    ActivationCodeResponse
} = require('../Models/ActivationCode.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.put('/', async (req, res) => {
    
    const activationCodeBody = new ActivationCodePutBody(req.body);

    const activationCode = await ActivationCodesRepository.updateAsync(activationCodeBody.Id, activationCodeBody.Code, activationCodeBody.Expiration);

    ResponseFilter.setResponseDetails(res, 201, new ActivationCodeResponse(activationCode), req.originalUrl);
});

Router.get('/', AuthorizationFilter.authorizeRoles('USER', 'SUPPORT', 'ADMIN'), async (req, res) => {

    const activationCode = await ActivationCodesRepository.getByIdAsync(req);

    ResponseFilter.setResponseDetails(res, 200, activationCode);
});

module.exports = Router;