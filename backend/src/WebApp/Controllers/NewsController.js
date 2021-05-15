const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const NewsRepository = require('../../Infrastructure/PostgreSQL/Repository/NewsRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    NewsPostBody,
    NewsPutBody,
    NewsResponse
} = require('../Models/News.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const newsBody = new NewsPostBody(req.body);
    const news = await NewsRepository.addAsync(newsBody.title, newsBody.content);
    ResponseFilter.setResponseDetails(res, 201, new NewsResponse(news), req.originalUrl);
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    const newsBody = new NewsPutBody(req.body);
    const news = await NewsRepository.updateAsync(newsBody.id, newsBody.title, newsBody.content);
    ResponseFilter.setResponseDetails(res, 200, new NewsResponse(news));
});

Router.get('/', async (req, res) => {
    const news = await NewsRepository.getAllAsync();
    ResponseFilter.setResponseDetails(res, 200, news.map(news => new NewsResponse(news)));
});

Router.get('/:id', async (req, res) => {
    let {
        id
    } = req.params;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const news = await NewsRepository.getByIdAsync(id);
    if (!news) {
        throw new ServerError(`News with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new NewsResponse(news));
});

Router.delete('/:id', async (req, res) => {
    let {
        id
    } = req.params;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    
    const news = await NewsRepository.deleteByIdAsync(id);
    if (!news) {
        throw new ServerError(`News with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;