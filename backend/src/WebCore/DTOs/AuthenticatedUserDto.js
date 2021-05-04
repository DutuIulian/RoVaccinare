class AuthenticatedUserDto {
    constructor (token, email, role) {
        this.token = token;
        this.email = email;
        this.role = role;
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
}

module.exports = AuthenticatedUserDto;