const express = require('express');
const JWTFilter = require('../Filters/JWTFilter.js');

const TestCenterReviewsRepository = require('../../Infrastructure/PostgreSQL/Repository/TestCenterReviewsRepository.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const {
    TestCenterReviewPostBody,
    TestCenterReviewPutBody,
    TestCenterReviewResponse,
    GraphResponse
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

Router.get('/graph/:user_id', JWTFilter.authorizeAndExtractTokenAsync, AuthorizationFilter.authorizeRoles('ADMIN'), async (req, res) => {
    let {
        user_id
    } = req.params;
    const graph = await TestCenterReviewsRepository.getGraphByUserId(user_id);

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

    const testCenterReviews = await TestCenterReviewsRepository.getByCenterIdAsync(center_id);
    ResponseFilter.setResponseDetails(res, 200, testCenterReviews.map(testCenterReview => new TestCenterReviewResponse(testCenterReview)));
});

module.exports = Router;