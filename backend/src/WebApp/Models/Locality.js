const ServerError = require('./ServerError.js');

class LocalityPostBody {
    constructor (body) {
        this.name = body.name;
        this.county_id = body.county_id;

        if (this.name == null || this.name.length < 4) {
            throw new ServerError("Name is missing", 400);
        }

        if (!this.county_id || this.county_id < 1) {
            throw new ServerError("Countt id should be a positive integer", 400);
        }
    }

    get Name () {
        return this.name;
    }

    get CountyId () {
        return this.county_id;
    }
}

class LocalityPutBody extends LocalityPostBody {
    constructor (body) {
        super(body);
        this.id = body.id;

        if (!this.id || this.id < 1) {
            throw new ServerError("Id should be a positive integer", 400);
        }
    }

    get Id () {
        return this.id;
    }
}

class LocalityResponse {
    constructor(Locality) {
        this.name = Locality.name;
        this.county_id = Locality.county_id;
        this.id = Locality.id;
    }
}

module.exports =  {
    LocalityPostBody,
    LocalityPutBody,
    LocalityResponse
}