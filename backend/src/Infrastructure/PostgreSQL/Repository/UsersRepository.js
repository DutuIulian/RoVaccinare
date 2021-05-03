const {
    queryAsync
} = require('..');

const getAllAsync = async() => {
    console.info ('Getting all users from database');
    
    return await queryAsync('SELECT id, email, role_id FROM users');
};

const addAsync = async (email, password, last_name, first_name, cnp, address, role_id, activation_code_id) => {
    console.info(`Adding user ${email} ${role_id}`);

    const users = await queryAsync(
        'INSERT INTO users (email, password, last_name, first_name, cnp, address, role_id, activation_code_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, role_id',
        [email, password, last_name, first_name, cnp, address, role_id, activation_code_id]
    );
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