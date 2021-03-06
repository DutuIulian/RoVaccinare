const Router = require('express')();

const RolesController = require('./RolesController.js');
const ActivationCodesController = require('./ActivationCodesController.js');
const UsersController = require('./UsersController.js');
const TestCentersController = require('./TestCentersController.js');
const TestsController = require('./TestsController.js');
const TestAppointmentsController = require('./TestAppointmentsController.js');
const TestCenterReviewsController = require('./TestCenterReviewsController.js');
const VaccineCentersController = require('./VaccineCentersController.js');
const VaccinesController = require('./VaccinesController.js');
const VaccineAppointmentsController = require('./VaccineAppointmentsController.js');
const VaccineCenterReviewsController = require('./VaccineCenterReviewsController.js');
const NewsController = require('./NewsController.js');
const QuestionsController = require('./QuestionsController.js');
const LocalitiesController = require('./LocalitiesController.js');
const JWTFilter = require('../Filters/JWTFilter.js');

Router.use('/v1/roles', JWTFilter.authorizeAndExtractTokenAsync, RolesController);
Router.use('/v1/activation_codes', JWTFilter.authorizeAndExtractTokenAsync, ActivationCodesController);
Router.use('/v1/users', UsersController);
Router.use('/v1/test_centers', TestCentersController);
Router.use('/v1/tests', TestsController);
Router.use('/v1/test_appointments', TestAppointmentsController);
Router.use('/v1/test_center_reviews', TestCenterReviewsController);
Router.use('/v1/vaccine_centers', VaccineCentersController);
Router.use('/v1/vaccines', VaccinesController);
Router.use('/v1/vaccine_appointments', VaccineAppointmentsController);
Router.use('/v1/vaccine_center_reviews', VaccineCenterReviewsController);
Router.use('/v1/news', NewsController);
Router.use('/v1/questions', QuestionsController);
Router.use('/v1/localities', LocalitiesController);

module.exports = Router;