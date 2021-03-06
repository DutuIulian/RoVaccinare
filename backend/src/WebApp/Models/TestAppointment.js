const ServerError = require('./ServerError.js');

class TestAppointmentPostBody {
    constructor (req) {
        this.date_time = req.body.date_time;
        this.test_id = req.body.test_id;
        this.user_id = req.body.user_id;

        if (this.date_time == null) {
            throw new ServerError("Date/time is missing", 400);
        }
    
        if (!this.test_id || this.test_id < 1) {
            throw new ServerError("Test id should be a positive integer", 400);
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

    get TestId () {
        return this.test_id;
    }
}

class TestAppointmentPutBody extends TestAppointmentPostBody {
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

class TestAppointmentResponse {
    constructor(test_center) {
        this.date_time = test_center.date_time.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        this.status = test_center.status;
        this.user_id = test_center.user_id;
        this.test_name = test_center.test_name;
        this.center_name = test_center.center_name;
        this.last_update = test_center.last_update.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        this.id = test_center.id;
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
    TestAppointmentPostBody,
    TestAppointmentPutBody,
    TestAppointmentResponse,
    GraphResponse
}