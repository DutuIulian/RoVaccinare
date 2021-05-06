const ServerError = require('./ServerError.js');

class NewsPostBody {
    constructor (body) {
        this.title = body.title;
        this.content = body.content;
        this.time_posted = body.time_posted;

        if (this.title == null || this.title.length < 4) {
            throw new ServerError("Title is missing", 400);
        }

        if (this.content == null || this.content.length < 4) {
            throw new ServerError("Content is missing", 400);
        }

        if (this.time_posted == null) {
            throw new ServerError("Time posted is missing", 400);
        }
    }

    get Title () {
        return this.title;
    }

    get Content () {
        return this.content;
    }

    get TimePosted () {
        return this.time_posted;
    }
}

class NewsPutBody extends NewsPostBody {
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

class NewsResponse {
    constructor(news) {
        this.title = news.title;
        this.content = news.content;
        this.time_posted = news.time_posted.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        this.id = news.id;
    }
}

module.exports =  {
    NewsPostBody,
    NewsPutBody,
    NewsResponse
}