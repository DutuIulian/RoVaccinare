const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const VaccineCenterReviewsRepository = require('../../Infrastructure/PostgreSQL/Repository/VaccineCenterReviewsRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    VaccineCenterReviewPostBody,
    VaccineCenterReviewPutBody,
    VaccineCenterReviewResponse
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

Router.get('/:center_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        center_id
    } = req.params;

    const vaccineCenterReviews = await VaccineCenterReviewsRepository.getByCenterIdAsync(center_id);
    ResponseFilter.setResponseDetails(res, 200, vaccineCenterReviews.map(vaccineCenterReview => new VaccineCenterReviewResponse(vaccineCenterReview)));
});

module.exports = Router;