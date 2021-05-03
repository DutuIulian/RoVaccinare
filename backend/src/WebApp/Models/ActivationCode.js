const ServerError = require('./ServerError.js');

class ActivationCodePutBody {
    constructor (body) {

        if (!body.id) {
            throw new ServerError("Id is missing", 400);
        }

        if (!body.code) {
            throw new ServerError("Code is missing", 400);
        }

        if (!body.expiration) {
            throw new ServerError("Expiration is missing", 400);
        }

        this.id = body.id;
        this.code = body.code;
        this.expiration = body.expiration;
    }

    get Id () {
        return this.id;
    }

    get Code () {
        return this.code;
    }

    get Expiration () {
        return this.expiration;
    }
}

class ActivationCodeResponse {
    constructor(activationCode) {
        this.code = activationCode.code;
        this.expiration = activationCode.expiration;
        this.id = activationCode.id;
    }
}

module.exports =  {
    ActivationCodePutBody,
    ActivationCodeResponse
}