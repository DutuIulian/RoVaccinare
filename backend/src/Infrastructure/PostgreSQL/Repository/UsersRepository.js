const {
    queryAsync
} = require('..');

const getAllAsync = async() => {
    console.info ('Getting all users from database');
    
    return await queryAsync(`SELECT u.id, u.email, u.last_name, u.first_name, u.cnp, u.address, u.activated, r.value AS role
        FROM users u
        JOIN roles r
        ON u.role_id=r.id
        ORDER BY u.id ASC`);
};

const addAsync = async (email, password, last_name, first_name, cnp, address, role_id, activation_code_id) => {
    console.info(`Adding user ${email} ${role_id}`);

    const users = await queryAsync(
        'INSERT INTO users (email, password, last_name, first_name, cnp, address, role_id, activation_code_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, role_id',
        [email, password, last_name, first_name, cnp, address, role_id, activation_code_id]
    );
    return users[0];
};

const getByUsernameWithRoleAsync = async (email) => {
    console.info(`Getting user with username ${email}`);
    
    const users = await queryAsync(`SELECT u.id, u.email, u.password, u.activated, r.value as role FROM users u 
                                     JOIN roles r ON r.id = u.role_id
                                     WHERE u.email = $1`, [email]);
    return users[0];
};

const getByActivationCodeIdAsync = async (activation_code_id) => {
    console.info (`Getting user with activation_code_id ${activation_code_id}`);
    
    const users = await queryAsync('SELECT id, email, role_id FROM users WHERE activation_code_id=$1', [activation_code_id]);
    return users[0];
};

const getByIdAsync = async (id) => {
    console.info (`Getting user with id ${id}`);
    
    const users = await queryAsync(`SELECT u.id, u.email, u.last_name, u.first_name, u.cnp, u.address, u.activated, r.value AS role
        FROM users u
        JOIN roles r
        ON u.role_id=r.id
        WHERE u.id=$1`,
        [id]
    );
    return users[0];
};

const updateRole = async (userId, roleId) => {
    console.info(`Updating user with userId ${userId}`);
    
    const users = await queryAsync(`UPDATE users SET role_id=$1 WHERE id=$2`, [roleId, userId]);
    return users[0];
};

const updateActivatedAsync = async (userId, activated) => {
    console.info(`Updating user with userId ${userId}`);
    
    const users = await queryAsync(`UPDATE users SET activated=$1 WHERE id=$2`, [activated, userId]);
    return users[0];
};

const updateById = async (id, email, last_name, first_name, cnp, address, role, activated) => {
    console.info(`Updating user with id ${id}`);
    
    const roles = await queryAsync(
        `SELECT id FROM roles WHERE value=$1`,
        [role]
    );

    const users = await queryAsync(
        `UPDATE users SET email=$1, last_name=$2, first_name=$3, cnp=$4, address=$5, role_id=$6, activated=$7 WHERE id = $8 RETURNING *`,
        [email, last_name, first_name, cnp, address, roles[0].id, activated, id]
    );
    return users[0];
}

module.exports = {
    getAllAsync,
    addAsync,
    getByUsernameWithRoleAsync,
    getByActivationCodeIdAsync,
    getByIdAsync,
    updateRole,
    updateActivatedAsync,
    updateById
}