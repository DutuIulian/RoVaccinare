const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const TestCenterReviewsRepository = require('../../Infrastructure/PostgreSQL/Repository/TestCenterReviewsRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    TestCenterReviewPostBody,
    TestCenterReviewPutBody,
    TestCenterReviewResponse
} = require('../Models/TestCenterReview.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');
const ServerError = require('../Models/ServerError.js');

const Router = express.Router();

Router.post('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    const testCenterReviewBody = new TestCenterReviewPostBody(req);

    const userReviews = await TestCenterReviewsRepository.getByUserIdCenterIdAsync(testCenterReviewBody.user_id, testCenterReviewBody.center_id);
    if(userReviews.length > 0) {
        throw new ServerError("Only one review per user is allowed for each center!", 403);
    }

    const testCenterReview = await TestCenterReviewsRepository.addAsync(testCenterReviewBody.title, testCenterReviewBody.review, testCenterReviewBody.user_id, testCenterReviewBody.center_id);
    ResponseFilter.setResponseDetails(res, 201, new TestCenterReviewResponse(testCenterReview), req.originalUrl);
});

Router.put('/', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT'), async (req, res) => {
    const testCenterReviewBody = new TestCenterReviewPutBody(req);
    await TestCenterReviewsRepository.updateAsync(testCenterReviewBody.title, testCenterReviewBody.review, testCenterReviewBody.date, testCenterReviewBody.user_id, testCenterReviewBody.center_id);
});

Router.get('/:center_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN', 'SUPPORT', 'USER'), async (req, res) => {
    let {
        center_id
    } = req.params;

    const testCenterReviews = await TestCenterReviewsRepository.getByCenterIdAsync(center_id);
    ResponseFilter.setResponseDetails(res, 200, testCenterReviews.map(testCenterReview => new TestCenterReviewResponse(testCenterReview)));
});

module.exports = Router;