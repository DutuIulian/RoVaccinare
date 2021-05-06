class AuthenticatedUserDto {
    constructor (token, email, role, id) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.id = id;
    }

    get Token() {
        return this.token;
    }
    
    get Email() {
        return this.email;
    }

    get Role() {
        return this.role;
    }

    get Id() {
        return this.id;
    }
}

module.exports = AuthenticatedUserDto;