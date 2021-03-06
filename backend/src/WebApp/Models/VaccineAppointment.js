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
    constructor(vaccine_appointment) {
        this.date_time = vaccine_appointment.date_time.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        this.status = vaccine_appointment.status;
        this.user_id = vaccine_appointment.user_id;
        this.vaccine_name = vaccine_appointment.vaccine_name;
        this.center_name = vaccine_appointment.center_name;
        this.last_update = vaccine_appointment.last_update.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        this.id = vaccine_appointment.id;
    }
}

class GraphResponse {
    constructor(testCenterReview) {
        this.count = testCenterReview.count;
        this.exact_date = testCenterReview.exact_date.toISOString()
        this.exact_date = this.exact_date.substr(0, this.exact_date.indexOf('T'))
    }
}

module.exports =  {
    VaccineAppointmentPostBody,
    VaccineAppointmentPutBody,
    VaccineAppointmentResponse,
    GraphResponse
}