const {
    queryAsync
} = require('..');

const addAsync = async (name, available_quantity, center_id) => {
    console.info(`Adding test in database`);

    const tests = await queryAsync(
        'INSERT INTO tests (name, available_quantity, center_id) VALUES ($1, $2, $3) RETURNING *',
        [name, available_quantity, center_id]
    );

    return tests[0];
};

const updateAsync = async (id, name, available_quantity, center_id) => {
    console.info(`Updating test with id ${id}`);
    
    const tests = await queryAsync(
        `UPDATE tests SET name = $1, available_quantity = $2, center_id= $3 WHERE id = $4`,
        [name, available_quantity, center_id, id]
    );
    return tests[0];
}

const getAllByCenterIdAsync = async(center_id) => {
    console.info(`Getting all tests with center_id ${center_id}`);

    return await queryAsync(`SELECT * FROM tests WHERE center_id=$1`, [center_id]);
};

const increaseQuantityById = async(id, extra_quantity) => {
    console.info(`Increasing quantity for test with id ${id}`);

    return await queryAsync(
        `UPDATE tests SET available_quantity=available_quantity+$1 WHERE id=$2`,
        [extra_quantity, id]
    );
};

module.exports = {
    addAsync,
    updateAsync,
    getAllByCenterIdAsync,
    increaseQuantityById
}