const {
    queryAsync
} = require('..');

const addAsync = async (name, available_quantity, center_id) => {
    console.info(`Adding vaccine in database`);

    const vaccines = await queryAsync(
        'INSERT INTO vaccines (name, available_quantity, center_id) VALUES ($1, $2, $3) RETURNING *',
        [name, available_quantity, center_id]
    );

    return vaccines[0];
};

const updateAsync = async (id, name, available_quantity) => {
    console.info(`Updating vaccine with id ${id}`);
    
    const vaccines = await queryAsync(
        `UPDATE vaccines SET name = $1, available_quantity = $2 WHERE id = $3 RETURNING *`,
        [name, available_quantity, id]
    );
    return vaccines[0];
}

const getAllByCenterIdAsync = async(center_id) => {
    console.info(`Getting all vaccines with center_id ${center_id}`);

    return await queryAsync(`SELECT * FROM vaccines WHERE center_id=$1 ORDER BY id ASC`, [center_id]);
};

const getByIdAsync = async(id) => {
    console.info(`Getting vaccine with id ${id}`);

    const vaccines = await queryAsync(`SELECT * FROM vaccines WHERE id=$1`, [id]);
    return vaccines[0];
};

const increaseQuantityById = async(id, extra_quantity) => {
    console.info(`Increasing quantity for vaccine with id ${id}`);

    return await queryAsync(
        `UPDATE vaccines SET available_quantity=available_quantity+$1 WHERE id=$2`,
        [extra_quantity, id]
    );
};

module.exports = {
    addAsync,
    updateAsync,
    getAllByCenterIdAsync,
    getByIdAsync,
    increaseQuantityById
}