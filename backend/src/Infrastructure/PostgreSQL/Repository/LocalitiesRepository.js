const {
    queryAsync
} = require('..');

const addAsync = async (name, county_id) => {
    console.info(`Adding news in database`);

    const localities = await queryAsync(
        'INSERT INTO localities (name, county_id) VALUES ($1, $2) RETURNING *',
        [name, county_id]
    );

    return localities[0];
};

const getAllAsync = async() => {
    console.info(`Getting all localities`);

    return await queryAsync(`SELECT * FROM localities ORDER BY id ASC`);
};

module.exports = {
    addAsync,
    getAllAsync
}