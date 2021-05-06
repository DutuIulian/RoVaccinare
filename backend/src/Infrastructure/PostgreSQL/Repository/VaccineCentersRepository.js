const {
    queryAsync
} = require('..');

const addAsync = async (name, address, locality_id) => {
    console.info(`Adding vaccine center in database`);

    const vaccine_centers = await queryAsync(
        'INSERT INTO vaccine_centers (name, address, locality_id) VALUES ($1, $2, $3) RETURNING *',
        [name, address, locality_id]
    );

    return vaccine_centers[0];
};

const updateAsync = async (id, name, address, locality_id) => {
    console.info(`Updating vaccine center with id ${id}`);
    
    const vaccine_centers = await queryAsync(
        `UPDATE vaccine_centers SET name = $1, address = $2, locality_id= $3 WHERE id = $4`,
        [name, address, locality_id, id]
    );
    return vaccine_centers[0];
}

const getAllAsync = async() => {
    console.info(`Getting all vaccine centers from database`);

    return await queryAsync(`SELECT tc.id, tc.name, tc.address, loc.name AS locality
                                FROM vaccine_centers tc
                                JOIN localities loc ON tc.locality_id=loc.id`);
};

module.exports = {
    addAsync,
    updateAsync,
    getAllAsync
}