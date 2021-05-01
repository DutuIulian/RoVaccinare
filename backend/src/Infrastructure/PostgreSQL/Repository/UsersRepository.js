const {
    queryAsync
} = require('..');

const getAllAsync = async() => {
    console.info ('Getting all users from database');
    
    return await queryAsync('SELECT id, username, role_id FROM users');
};

const addAsync = async (username, password) => {
    console.info(`Adding user ${username}`);

    const users = await queryAsync('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, role_id', [username, password]);
    return users[0];
};

const getByUsernameWithRoleAsync = async (username) => {
    console.info(`Getting user with username ${username}`);
    
    const users = await queryAsync(`SELECT u.id, u.password, r.value as role FROM users u 
                                     JOIN roles r ON r.id = u.role_id
                                     WHERE u.username = $1`, [username]);
    return users[0];
};

const updateRole = async (userId, roleId) => {
    console.info(`Updating user with username ${username}`);
    
    const users = await queryAsync(`UPDATE users SET role_id = $1 WHERE id = $2`, [roleId, userId]);
    return users[0];
};

module.exports = {
    getAllAsync,
    addAsync,
    getByUsernameWithRoleAsync,
	updateRole
}