const Router = require('express')();

const RolesController = require('./RolesController.js');
const UsersController = require('./UsersController.js');
const JWTFilter = require('../Filters/JWTFilter.js');

Router.use('/v1/roles', JWTFilter.authorizeAndExtractTokenAsync, RolesController);
Router.use('/v1/users', UsersController);

module.exports = Router;
