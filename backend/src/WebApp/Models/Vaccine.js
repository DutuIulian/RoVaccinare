const ServerError = require('./ServerError.js');

class VaccinePostBody {
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

    get Name () {
        return this.name;
    }

    get AvailableQuantity () {
        return this.available_quantity;
    }

    get CenterId () {
        return this.center_id;
    }
}

class VaccinePutBody extends VaccinePostBody {
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

class VaccineResponse {
    constructor(vaccine) {
        this.name = vaccine.name;
        this.available_quantity = vaccine.available_quantity;
        this.center_id = vaccine.center_id;
        this.id = vaccine.id;
    }
}

module.exports =  {
    VaccinePostBody,
    VaccinePutBody,
    VaccineResponse
}