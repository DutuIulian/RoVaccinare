const express = require('express');

const PublishersDataAccess = require('../../Infrastructure/PostgreSQL/Repository/PublishersDataAccess.js');
const ServerError = require('../Models/ServerError.js');
const { PublisherPostBody, PublisherPutBody } = require('../Models/Publisher.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const Router = express.Router();

Router.post('/', AuthorizationFilter.authorizeRoles('MANAGER', 'ADMIN'), async (req, res) => {
    
    const PublisherBody = new PublisherPostBody(req.body);

    const Publisher = await PublishersDataAccess.addAsync(PublisherBody.Name);

    ResponseFilter.setResponseDetails(res, 201, Publisher, req.originalUrl);
});

Router.get('/', AuthorizationFilter.authorizeRoles('USER', 'MANAGER'), AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {

    const Publishers = await PublishersDataAccess.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, Publishers);
});

Router.get('/:id', AuthorizationFilter.authorizeRoles('USER', 'MANAGER'), AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    let {
        id
    } = req.params;

    id = parseInt(id);

    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
       
    const Publisher = await PublishersDataAccess.getByIdAsync(id);
    
    if (!Publisher) {
        throw new ServerError(`Publisher with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, Publisher);
});

Router.put('/:id', AuthorizationFilter.authorizeRoles('MANAGER', 'ADMIN'), async (req, res) => {

    const PublisherBody = new PublisherPutBody(req.body, req.params.id);

    const Publisher = await PublishersDataAccess.updateByIdAsync(PublisherBody.Id, PublisherBody.Name);
        
    if (!Publisher) {
		let {
			id
		} = req.params;

		id = parseInt(id);
        throw new ServerError(`Publisher with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, Publisher);
});

Router.delete('/:id', AuthorizationFilter.authorizeRoles('MANAGER', 'ADMIN'), async (req, res) => {
    const {
        id
    } = req.params;

    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    
    const Publisher = await PublishersDataAccess.deleteByIdAsync(parseInt(id));
    
    if (!Publisher) {
        throw new ServerError(`Publisher with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;