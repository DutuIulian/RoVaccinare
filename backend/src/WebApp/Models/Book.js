const ServerError = require('./ServerError.js');

class BookPostBody {
    constructor (body) {
        this.name = body.name;
        this.authorId = parseInt(body.authorId);
		this.publisherId = parseInt(body.publisherId);
		this.price = parseInt(body.price);

        if (this.name == null || this.name.length < 1) {
            throw new ServerError("Name is missing", 400);
        }
    
        if (this.authorId < 0) {
            throw new ServerError("Author Id is missing", 400);
        }
		
		if (this.publisherId < 0) {
            throw new ServerError("Publisher Id is missing", 400);
        }
		if (this.price <= 0) {
            throw new ServerError("Price is missing", 400);
        }
    }

    get Name () {
        return this.name;
    }

    get AuthorId () {
        return this.authorId;
    }
	
	get PublisherId () {
        return this.publisherId;
    }
	
	get Price () {
        return this.price;
    }
}

class BookPutBody extends BookPostBody {
    constructor (body, id) {
        super(body);
        this.id = parseInt(id);

        if (!this.id || this.id < 1) {
            throw new ServerError("Id should be a positive integer", 400);
        }
    }

    get Id () {
        return this.id;
    }
}

module.exports =  {
    BookPostBody,
    BookPutBody
}