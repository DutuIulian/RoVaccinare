const ServerError = require('./ServerError.js');

class VaccineCenterPostBody {
    constructor (body) {
        this.name = body.name;
        this.address = body.address;
        this.locality_id = body.locality_id;

        if (this.name == null || this.name.length < 4) {
            throw new ServerError("Name is missing", 400);
        }
    
        if (this.address == null || this.address.length < 4) {
            throw new ServerError("Address is missing", 400);
        }

        if (!this.locality_id || this.locality_id < 1) {
            throw new ServerError("Id should be a positive integer", 400);
        }
    }

    get Name () {
        return this.name;
    }

    get Address () {
        return this.address;
    }

    get LocalityId () {
        return this.locality_id;
    }
}

class VaccineCenterPutBody extends VaccineCenterPostBody {
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

class VaccineCenterResponse {
    constructor(vaccine_center) {
        this.name = vaccine_center.name;
        this.address = vaccine_center.address;
        this.locality = vaccine_center.locality;
        this.vaccine_count = parseInt(vaccine_center.vaccine_count);
        this.id = vaccine_center.id;
    }
}

class VaccineCenterResponse2 {
    constructor(test_center) {
        this.name = test_center.name;
        this.address = test_center.address;
        this.locality_id = test_center.locality_id;
        this.id = test_center.id;
    }
}

module.exports =  {
    VaccineCenterPostBody,
    VaccineCenterPutBody,
    VaccineCenterResponse,
    VaccineCenterResponse2
}