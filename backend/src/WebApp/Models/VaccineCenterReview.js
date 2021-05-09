const ServerError = require('./ServerError.js');

class VaccineCenterReviewPostBody {
    constructor (req) {
        this.title = req.body.title;
        this.review = req.body.review;
        this.user_id = req.body.user_id;
        this.center_id = req.body.center_id;

        if (this.title == null || this.title.length < 4) {
            throw new ServerError("Title is missing", 400);
        }

        if (this.review == null || this.review.length < 4) {
            throw new ServerError("Review is missing", 400);
        }

        if (!this.user_id || this.user_id < 1) {
            this.user_id = req.user.userId;
        }

        if (this.user_id !== req.user.userId
                && req.user.userRole.localeCompare("ADMIN") !== 0
                && req.user.userRole.localeCompare("SUPPORT") !== 0) {
            throw new ServerError("Only ADMIN and SUPPORT users can create appointments for other users", 401);
        }

        if(!this.center_id || this.center_id < 1) {
            throw new ServerError("Center id should be a positive integer", 400);
        }
    }

    get Title () {
        return this.title;
    }

    get Review () {
        return this.review;
    }

    get UserId () {
        return this.user_id;
    }

    get CenterId () {
        return this.center_id;
    }
}

class VaccineCenterReviewPutBody extends VaccineCenterReviewPostBody {
    constructor (req, id) {
        super(req);
        this.id = parseInt(id);
        this.date = req.body.date;

        if (!this.id || this.id < 1) {
            throw new ServerError("Id should be a positive integer", 400);
        }

        if (!this.date) {
            throw new ServerError("Date is missing", 400);
        }
    }

    get Id () {
        return this.id;
    }

    get Date () {
        return this.date;
    }
}

class VaccineCenterReviewResponse {
    constructor(vaccineCenterReview) {
        this.id = vaccineCenterReview.id;
        this.title = vaccineCenterReview.title;
        this.review = vaccineCenterReview.review;
        this.date = vaccineCenterReview.date.toISOString().replace(/T/, ' ').replace(/\..+/, '');;
        this.user_name = vaccineCenterReview.user_name;
    }
}

class GraphResponse {
    constructor(vaccineCenterReview) {
        this.count = vaccineCenterReview.count;
        this.exact_date = vaccineCenterReview.exact_date.toISOString()
        this.exact_date = this.exact_date.substr(0, this.exact_date.indexOf('T'))
    }
}

module.exports =  {
    VaccineCenterReviewPostBody,
    VaccineCenterReviewPutBody,
    VaccineCenterReviewResponse,
    GraphResponse
}