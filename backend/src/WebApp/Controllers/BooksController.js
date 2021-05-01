const express = require('express');

const BooksDataAccess = require('../../Infrastructure/PostgreSQL/Repository/BooksDataAccess.js');
const ServerError = require('../Models/ServerError.js');
const { BookPostBody, BookPutBody } = require('../Models/Book.js');

const ResponseFilter = require('../Filters/ResponseFilter.js');
const AuthorizationFilter = require('../Filters/AuthorizationFilter.js');

const Router = express.Router();

Router.post('/', AuthorizationFilter.authorizeRoles('MANAGER', 'ADMIN'), async (req, res) => {
    
    const BookBody = new BookPostBody(req.body);

    const Book = await BooksDataAccess.addAsync(BookBody.Name, BookBody.AuthorId, BookBody.PublisherId, BookBody.Price);

    ResponseFilter.setResponseDetails(res, 201, Book, req.originalUrl);
});

Router.get('/', AuthorizationFilter.authorizeRoles('USER', 'MANAGER', 'ADMIN'), async (req, res) => {

    const Books = await BooksDataAccess.getAllAsync();

    ResponseFilter.setResponseDetails(res, 200, Books);
});

Router.get('/:id', AuthorizationFilter.authorizeRoles('USER', 'MANAGER', 'ADMIN'), async (req, res) => {
    let {
        id
    } = req.params;

    id = parseInt(id);

    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
       
    const Book = await BooksDataAccess.getByIdAsync(id);
    
    if (!Book) {
        throw new ServerError(`Book with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, Book);
});

Router.put('/:id', AuthorizationFilter.authorizeRoles('MANAGER', 'ADMIN'), async (req, res) => {

    const BookBody = new BookPutBody(req.body, req.params.id);

    const Book = await BooksDataAccess.updateByIdAsync(BookBody.Id, BookBody.Name, BookBody.AuthorId, BookBody.PublisherId, BookBody.Price);
        
    if (!Book) {
		let {
			id
		} = req.params;

		id = parseInt(id);
        throw new ServerError(`Book with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 200, Book);
});

Router.delete('/:id', AuthorizationFilter.authorizeRoles('MANAGER', 'ADMIN'), async (req, res) => {
    const {
        id
    } = req.params;

    if (!id || id < 1) {
        throw new ServerError("Id should be a positive integer", 400);
    }
    
    const Book = await BooksDataAccess.deleteByIdAsync(parseInt(id));
    
    if (!Book) {
        throw new ServerError(`Book with id ${id} does not exist!`, 404);
    }

    ResponseFilter.setResponseDetails(res, 204, "Entity deleted succesfully");
});

module.exports = Router;