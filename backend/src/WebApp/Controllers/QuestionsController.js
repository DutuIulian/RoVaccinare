const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const QuestionsRepository = require('../../Infrastructure/PostgreSQL/Repository/QuestionsRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    QuestionPostBody,
    QuestionPutBody,
    QuestionResponse
} = require('../Models/Question.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const questionBody = new QuestionPostBody(req);
    const question = await QuestionsRepository.addAsync(questionBody.title, questionBody.question);
    ResponseFilter.setResponseDetails(res, 201, new QuestionResponse(question), req.originalUrl);
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT'), async (req, res) => {
    const questionBody = new QuestionPutBody(req);
    await QuestionsRepository.updateAsync(questionBody.title, questionBody.question, questionBody.answer, questionBody.user_id, questionBody.support_user_id, questionBody.pinned);
});

Router.get('/pinned', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const questions = await QuestionsRepository.getAllPinnedAsync();
    ResponseFilter.setResponseDetails(res, 200, questions.map(questions => new QuestionResponse(questions)));
});

Router.get('/:id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT'), async (req, res) => {
    let {
        id
    } = req.params;

    const question = await QuestionsRepository.getByIdAsync(id);
    ResponseFilter.setResponseDetails(res, 200, new QuestionResponse(question));
});

module.exports = Router;