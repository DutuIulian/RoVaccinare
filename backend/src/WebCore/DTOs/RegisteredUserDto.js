class RegisteredUserDto {
    constructor (id, email, role_id) {
        this.id = id;
        this.email = email;
        this.role_id = role_id;
    }

    get Id() {
        return this.id;
    }

    get Email() {
        return this.email;
    }

    get RoleId() {
        return this.roleId;
    }
}

module.exports = RegisteredUserDto;
