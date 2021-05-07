const ServerError = require('./ServerError.js');

class VaccineAppointmentPostBody {
    constructor (req) {
        this.date_time = req.body.date_time;
        this.vaccine_id = req.body.vaccine_id;
        this.user_id = req.body.user_id;

        if (this.date_time == null) {
            throw new ServerError("Date/time is missing", 400);
        }
    
        if (!this.vaccine_id || this.vaccine_id < 1) {
            throw new ServerError("Vaccine id should be a positive integer", 400);
        }

        if (!this.user_id || this.user_id < 1) {
            this.user_id = req.user.userId;
        }

        if (this.user_id !== req.user.userId
                && req.user.userRole.localeCompare("ADMIN") !== 0
                && req.user.userRole.localeCompare("SUPPORT") !== 0) {
            throw new ServerError("Only ADMIN and SUPPORT users can create appointments for other users", 401);
        }
    }

    get DateTime () {
        return this.date_time;
    }

    get VaccineId () {
        return this.vaccine_id;
    }

    get UserId () {
        return this.user_id;
    }
}

class VaccineAppointmentPutBody extends VaccineAppointmentPostBody {
    constructor (req, id, status) {
        super(req);
        this.id = parseInt(id);
        this.status = status;

        if (!this.id || this.id < 1) {
            throw new ServerError("Id should be a positive integer", 400);
        }

        if (this.status == null || this.status.length < 4) {
            throw new ServerError("Status is missing", 400);
        }
    }

    get Id () {
        return this.id;
    }

    get Status () {
        return this.status;
    }
}

class VaccineAppointmentResponse {
    constructor(vaccine_center) {
        this.date_time = vaccine_center.date_time;
        this.status = vaccine_center.status;
        this.vaccine_id = vaccine_center.vaccine_id;
        this.user_id = vaccine_center.user_id;
    }
}

module.exports =  {
    VaccineAppointmentPostBody,
    VaccineAppointmentPutBody,
    VaccineAppointmentResponse
}