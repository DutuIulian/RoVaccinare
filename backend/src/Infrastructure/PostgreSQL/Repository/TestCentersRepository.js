const {
    queryAsync
} = require('..');

const addAsync = async (name, address, locality_id) => {
    console.info(`Adding test center in database`);

    const test_centers = await queryAsync(
        'INSERT INTO test_centers (name, address, locality_id) VALUES ($1, $2, $3) RETURNING *',
        [name, address, locality_id]
    );

    return test_centers[0];
};

const updateAsync = async (id, name, address, locality_id) => {
    console.info(`Updating test center with id ${id}`);
    
    const test_centers = await queryAsync(
        `UPDATE test_centers SET name = $1, address = $2, locality_id= $3 WHERE id = $4 RETURNING *`,
        [name, address, locality_id, id]
    );
    return test_centers[0];
}

const getAllAsync = async() => {
    console.info(`Getting all test centers from database`);

    return await queryAsync(`SELECT tc.id, tc.name, tc.address, loc.name AS locality
                                FROM test_centers tc
                                JOIN localities loc ON tc.locality_id=loc.id
                                ORDER BY tc.id ASC`);
};

const getByIdAsync = async(id) => {
    console.info(`Getting test centers with id ${id} from database`);

    const test_centers = await queryAsync(
        `SELECT id, name, address, locality_id
            FROM test_centers
            WHERE id=$1`,
        [id]
    );

    return test_centers[0];
};

module.exports = {
    addAsync,
    updateAsync,
    getAllAsync,
    getByIdAsync
}