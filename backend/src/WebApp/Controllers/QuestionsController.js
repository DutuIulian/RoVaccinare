const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const QuestionsRepository = require('../../Infrastructure/PostgreSQL/Repository/QuestionsRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');
const ServerError = require('../../WebApp/Models/ServerError.js');

const {
    QuestionPostBody,
    QuestionPutBody,
    QuestionResponse
} = require('../Models/Question.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const questionBody = new QuestionPostBody(req);
    const question = await QuestionsRepository.addAsync(questionBody.title, questionBody.question, questionBody.user_id);
    ResponseFilter.setResponseDetails(res, 201, new QuestionResponse(question), req.originalUrl);
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT'), async (req, res) => {
    const questionBody = new QuestionPutBody(req);
    await QuestionsRepository.updateAsync(questionBody.title, questionBody.question, questionBody.answer, questionBody.user_id, questionBody.support_user_id, questionBody.pinned);
});

Router.put('/pin/:id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT'), async (req, res) => {
    let {
        id
    } = req.params;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const question = await QuestionsRepository.updatePinnedAsync(id, true);
    if (!question) {
        throw new ServerError(`Question with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new QuestionResponse(question));
});

Router.put('/unpin/:id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT'), async (req, res) => {
    let {
        id
    } = req.params;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const question = await QuestionsRepository.updatePinnedAsync(id, false);
    if (!question) {
        throw new ServerError(`Question with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new QuestionResponse(question));
});

Router.put('/answer', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT'), async (req, res) => {
    let id = req.body.id;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    let answer = req.body.answer;
    if (!answer) {
        throw new ServerError("Answer is missing", 400);
    }

    let support_user_id = req.body.support_user_id;
    if (!support_user_id || support_user_id < 1) {
        throw new ServerError("Support user id should be a positive integer", 400);
    }

    const question = await QuestionsRepository.updateAnswer(id, answer, support_user_id);
    if (!question) {
        throw new ServerError(`Question with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new QuestionResponse(question));
});

Router.get('/pinned', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const questions = await QuestionsRepository.getAllPinnedAsync();
    ResponseFilter.setResponseDetails(res, 200, questions.map(question => new QuestionResponse(question)));
});

Router.get('/unanswered', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT'), async (req, res) => {
    const questions = await QuestionsRepository.getAllUnansweredAsync();
    ResponseFilter.setResponseDetails(res, 200, questions.map(question => new QuestionResponse(question)));
});

Router.get('/answered', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT'), async (req, res) => {
    const questions = await QuestionsRepository.getAllAnsweredAsync();
    ResponseFilter.setResponseDetails(res, 200, questions.map(question => new QuestionResponse(question)));
});

Router.get('/:id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT'), async (req, res) => {
    let {
        id
    } = req.params;
    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const question = await QuestionsRepository.getByIdAsync(id);
    if (!question) {
        throw new ServerError(`Question with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, new QuestionResponse(question));
});

Router.get('/user/:user_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        user_id
    } = req.params;
    if (!user_id || user_id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }

    const questions = await QuestionsRepository.getAllByUserIdAsync(user_id);
    ResponseFilter.setResponseDetails(res, 200, questions.map(question => new QuestionResponse(question)));
});

module.exports = Router;