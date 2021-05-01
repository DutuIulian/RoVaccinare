const Router = require('express')();

const AuthorsController = require('./AuthorsController.js');
const BooksController = require('./BooksController.js');
const PublishersController = require('./PublishersController.js');
const RolesController = require('./RolesController.js');
const UsersController = require('./UsersController.js');
const JWTFilter = require('../Filters/JWTFilter.js');

Router.use('/v1/authors', JWTFilter.authorizeAndExtractTokenAsync, AuthorsController);
Router.use('/v1/books', JWTFilter.authorizeAndExtractTokenAsync, BooksController);
Router.use('/v1/publishers', JWTFilter.authorizeAndExtractTokenAsync, PublishersController);
Router.use('/v1/roles', JWTFilter.authorizeAndExtractTokenAsync, RolesController);
Router.use('/v1/users', UsersController);

module.exports = Router;
