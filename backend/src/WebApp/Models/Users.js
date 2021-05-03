const ServerError = require('./ServerError.js');

class UserBody {
    constructor (body) {

        if (!body.email) {
            throw new ServerError("E-mail is missing", 400);
        }
    
        if (!body.password) {
            throw new ServerError("Password is missing", 400);
        }

        if (body.password.length < 4) {
            throw new ServerError("Password is too short!", 400);
        }

        if (!body.last_name) {
            throw new ServerError("Last name is missing", 400);
        }

        if (!body.first_name) {
            throw new ServerError("First name is missing", 400);
        }

        if (!body.cnp) {
            throw new ServerError("CNP is missing", 400);
        }

        if (!body.address) {
            throw new ServerError("Address is missing", 400);
        }

        if (!body.role) {
            body.role = "USER";
        }

        this.email = body.email;
        this.password = body.password;
        this.last_name = body.last_name;
        this.first_name = body.first_name;
        this.cnp = body.cnp;
        this.address = body.address;
        this.role = body.role;
    }

    get Email () {
        return this.email;
    }

    get Password () {
        return this.password;
    }

    get LastName () {
        return this.last_name;
    }

    get FirstName () {
        return this.first_name;
    }

    get CNP () {
        return this.cnp;
    }

    get Address () {
        return this.address;
    }

    get Role () {
        return this.role;
    }
}

class UserRegisterResponse {
    constructor(user) {
        this.email = user.email;
        this.id = user.id;
        this.role_id = user.role_id;
    }
}
class UserLoginResponse {
    constructor(token, role) {
        this.role = role;
        this.token = token;
    }
}
module.exports =  {
    UserBody,
    UserLoginResponse,
    UserRegisterResponse
}