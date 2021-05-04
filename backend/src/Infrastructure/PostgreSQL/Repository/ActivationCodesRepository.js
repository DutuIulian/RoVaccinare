const {
    queryAsync
} = require('..');

const addAsync = async (code, expiration) => {
    console.info(`Adding activation code in database`);

    const activation_codes = await queryAsync('INSERT INTO activation_codes (code, expiration) VALUES ($1, $2) RETURNING *', [code, expiration]);
    return activation_codes[0];
};

const getByIdAsync = async(id) => {
    console.info(`Getting activation code with id ${id} from database`);

    const activation_codes = await queryAsync('SELECT * FROM activation_codes WHERE id=$1', [id]);
    return activation_codes[0];
};

const getByCodeAsync = async(code) => {
    console.info(`Getting activation code with code ${code} from database`);

    const activation_codes = await queryAsync('SELECT * FROM activation_codes WHERE code=$1', [code]);
    return activation_codes[0];
};

module.exports = {
    addAsync,
    getByIdAsync,
    getByCodeAsync
}