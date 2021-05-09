const ServerError = require('./ServerError.js');

class UserLoginBody {
    constructor (body) {
        if (!body.email) {
            throw new ServerError("E-mail is missing", 400);
        }

        if (!body.password) {
            throw new ServerError("Password is missing", 400);
        }

        this.email = body.email;
        this.password = body.password;
    }

    get Email () {
        return this.email;
    }

    get Password () {
        return this.password;
    }
}

class UserPutBody {
    constructor (body) {
        if (!body.id) {
            throw new ServerError("Id is missing", 400);
        }

        if (!body.email) {
            throw new ServerError("E-mail is missing", 400);
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

        if (body.activated === null) {
            throw new ServerError("Activated is missing", 400);
        }

        if (!body.role) {
            throw new ServerError("Role is missing", 400);
        }

        this.id = body.id;
        this.email = body.email;
        this.last_name = body.last_name;
        this.first_name = body.first_name;
        this.cnp = body.cnp;
        this.address = body.address;
        this.role = body.role;
        this.activated = body.activated;
    }

    get Email () {
        return this.email;
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

    get Activated () {
        return this.activated;
    }
}

class UserRegisterBody extends UserPutBody {
    constructor (body) {
        if (!body.password) {
            throw new ServerError("Password is missing", 400);
        }

        if (body.password.length < 4) {
            throw new ServerError("Password is too short!", 400);
        }

        this.password = body.password;
    }

    get Password () {
        return this.password;
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
    constructor(token, role, id) {
        this.role = role;
        this.token = token;
        this.id = id;
    }
}

class UserResponse {
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.last_name = user.last_name;
        this.first_name = user.first_name;
        this.cnp = user.cnp;
        this.address = user.address;
        this.activated = user.activated;
        this.role = user.role;
    }
}

module.exports =  {
    UserRegisterBody,
    UserLoginBody,
    UserPutBody,
    UserLoginResponse,
    UserRegisterResponse,
    UserResponse
}