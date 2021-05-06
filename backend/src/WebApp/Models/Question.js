const ServerError = require('./ServerError.js');

class QuestionPostBody {
    constructor (req) {
        this.title = req.body.title;
        this.question = req.body.question;
        this.user_id = req.body.user_id;

        if (this.title == null || this.title.length < 4) {
            throw new ServerError("Title is missing", 400);
        }

        if (this.question == null || this.question.length < 4) {
            throw new ServerError("Content is missing", 400);
        }

        if (!this.id || this.id < 1) {
            this.id = req.user.id;
        }
    }

    get Title () {
        return this.title;
    }

    get Question () {
        return this.question;
    }
}

class QuestionPutBody extends QuestionPostBody {
    constructor (req, id) {
        super(req);
        this.id = parseInt(id);
        this.user_id = req.body.user_id;
        this.support_user_id = req.body.support_user_id;
        this.pinned = req.body.pinned;

        if (!this.id || this.id < 1) {
            throw new ServerError("Id should be a positive integer", 400);
        }

        if (!this.user_id || this.user_id < 1) {
            throw new ServerError("User id should be a positive integer", 400);
        }

        if (!this.support_user_id || this.support_user_id < 1) {
            throw new ServerError("Support user id should be a positive integer", 400);
        }
    }

    get Id () {
        return this.id;
    }
}

class QuestionResponse {
    constructor(question) {
        this.title = question.title;
        this.question = question.question;
        this.answer = question.answer;
        this.user_name = question.user_name;
        this.support_user_name = question.support_user_name;
    }
}

module.exports =  {
    QuestionPostBody,
    QuestionPutBody,
    QuestionResponse
}