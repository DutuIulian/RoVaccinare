const {
    query
} = require('..');

const addAsync = async (value) => {
    console.info(`Adding role in database`);

    const roles = await query('INSERT INTO roles (value) VALUES ($1) RETURNING *', [value]);

    return roles[0];
};

const getAllAsync = async() => {
    console.info(`Getting all roles from database`);

    return await query('SELECT * FROM roles');
};

module.exports = {
    addAsync,
    getAllAsync
}