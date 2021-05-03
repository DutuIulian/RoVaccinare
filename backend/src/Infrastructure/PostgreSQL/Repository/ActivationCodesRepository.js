const {
    queryAsync
} = require('..');

const addAsync = async (code, expiration) => {
    console.info(`Adding activation code in database`);

    const roles = await queryAsync('INSERT INTO activation_codes (code, expiration) VALUES ($1, $2) RETURNING *', [code, expiration]);

    return roles[0];
};

const getByIdAsync = async(id) => {
    console.info(`Getting activation code with id ${id} from database`);

    return await queryAsync('SELECT * FROM activation_codes WHERE id=$1', [id]);
};

module.exports = {
    addAsync,
    getByIdAsync
}