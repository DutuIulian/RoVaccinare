const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const VaccineCenterReviewsRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccineCenterReviewsRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    VaccineCenterReviewPostBody,
    VaccineCenterReviewPutBody,
    VaccineCenterReviewResponse,
    GraphResponse
} = require('../Models/VaccineCenterReview.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');
const ServerError = require('../Models/ServerError.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const vaccineCenterReviewBody = new VaccineCenterReviewPostBody(req);

    const userReviews = await VaccineCenterReviewsRepository.getByUserIdCenterIdAsync(vaccineCenterReviewBody.user_id, vaccineCenterReviewBody.center_id);
    if(userReviews.length > 0) {
        throw new ServerError("Only one review per user is allowed for each center!", 403);
    }

    const vaccineCenterReview = await VaccineCenterReviewsRepository.addAsync(vaccineCenterReviewBody.title, vaccineCenterReviewBody.review, vaccineCenterReviewBody.user_id, vaccineCenterReviewBody.center_id);
    ResponseFilter.setResponseDetails(res, 201, new VaccineCenterReviewResponse(vaccineCenterReview), req.originalUrl);
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT'), async (req, res) => {
    const vaccineCenterReviewBody = new VaccineCenterReviewPutBody(req);
    await VaccineCenterReviewsRepository.updateAsync(vaccineCenterReviewBody.title, vaccineCenterReviewBody.review, vaccineCenterReviewBody.date, vaccineCenterReviewBody.user_id, vaccineCenterReviewBody.center_id);
});

Router.get('/graph/:user_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    let {
        user_id
    } = req.params;
    const graph = await VaccineCenterReviewsRepository.getGraphByUserId(user_id);

    var today = new Date(new Date().toDateString());
    var d = new Date();
    d.setDate(today.getDate() - 30);
    while (d <= today) {
        const exists = (r) => {
            return r.exact_date.getTime() === d.getTime();
        };
        if(!graph.some(exists)) {
            graph.push({count: '0', exact_date: new Date(d)});
        }
        d.setDate(d.getDate() + 1);
    }

    graph.sort((g1, g2) => {
        if(g1.exact_date < g2.exact_date) {
            return -1;
        } else {
            return 1;
        }
    });
    ResponseFilter.setResponseDetails(res, 200, graph.map(r => new GraphResponse(r)));
});

Router.get('/:center_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        center_id
    } = req.params;

    const vaccineCenterReviews = await VaccineCenterReviewsRepository.getByCenterIdAsync(center_id);
    ResponseFilter.setResponseDetails(res, 200, vaccineCenterReviews.map(vaccineCenterReview => new VaccineCenterReviewResponse(vaccineCenterReview)));
});

module.exports = Router;