const ServerError = require('./ServerError.js');

class TestPostBody {
    constructor (body) {
        this.name = body.name;
        this.available_quantity = body.available_quantity;
        this.center_id = body.center_id;

        if (this.name == null || this.name.length < 4) {
            throw new ServerError("Name is missing", 400);
        }
    
        if (this.available_quantity < 0) {
            throw new ServerError("Available quantity can not be negative", 400);
        }

        if (!this.center_id || this.center_id < 1) {
            throw new ServerError("Id should be a positive integer", 400);
        }
    }

    get FirstName () {
        return this.firstName;
    }

    get LastName () {
        return this.lastName;
    }
}

class TestPutBody extends TestPostBody {
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

class TestResponse {
    constructor(test) {
        this.name = test.name;
        this.available_quantity = test.available_quantity;
        this.center = test.center;
        this.id = test.id;
    }
}

module.exports =  {
    TestPostBody,
    TestPutBody,
    TestResponse
}