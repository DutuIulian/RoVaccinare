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
        `UPDATE vaccine_centers SET name = $1, address = $2, locality_id= $3 WHERE id = $4 RETURNING *`,
        [name, address, locality_id, id]
    );
    return vaccine_centers[0];
}

const getAllAsync = async() => {
    console.info(`Getting all vaccine centers from database`);

    return await queryAsync(
        `SELECT vc.id, vc.name, vc.address, loc.name AS locality, COUNT(v.id) AS vaccine_count
            FROM vaccine_centers vc
            JOIN localities loc ON vc.locality_id=loc.id
            LEFT JOIN vaccines v ON vc.id=v.center_id
            GROUP BY loc.name, vc.id
            ORDER BY vc.id ASC`
    );
};

const getByIdAsync = async(id) => {
    console.info(`Getting vaccine centers with id ${id} from database`);

    const vaccine_centers = await queryAsync(
        `SELECT id, name, address, locality_id
            FROM vaccine_centers
            WHERE id=$1`,
        [id]
    );

    return vaccine_centers[0];
};

const deleteByIdAsync = async(id) => {
    console.info(`Deleting the vaccine center with id ${id} from database`);

    const vaccines = await queryAsync('DELETE FROM vaccine_centers WHERE id = $1 RETURNING *', [id]);
    return vaccines[0];
};

module.exports = {
    addAsync,
    updateAsync,
    getAllAsync,
    getByIdAsync,
    deleteByIdAsync
}