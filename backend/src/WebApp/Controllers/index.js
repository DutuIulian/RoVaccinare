const Router = require('express')();

const RolesController = require('./RolesController.js');
const ActivationCodesController = require('./ActivationCodesController.js');
const UsersController = require('./UsersController.js');
const TestCentersController = require('./TestCentersController.js');
const TestsController = require('./TestsController.js');
const JWTFilter = require('../Filters/JWTFilter.js');

Router.use('/v1/roles', JWTFilter.authorizeAndExtractTokenAsync, RolesController);
Router.use('/v1/activation_codes', JWTFilter.authorizeAndExtractTokenAsync, ActivationCodesController);
Router.use('/v1/users', UsersController);
Router.use('/v1/test_centers', TestCentersController);
Router.use('/v1/tests', TestsController);

module.exports = Router;
