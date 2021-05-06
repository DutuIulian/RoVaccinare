const {
    queryAsync
} = require('..');

const addAsync = async (date_time, vaccine_id, user_id) => {
    console.info(`Adding vaccine appointment in database`);

    const vaccine_appointments = await queryAsync(
        'INSERT INTO vaccine_appointments (date_time, vaccine_id, user_id) VALUES ($1, $2, $3) RETURNING *',
        [date_time, vaccine_id, user_id]
    );

    return vaccine_appointments[0];
};

const updateAsync = async (id, date_time, status, vaccine_id, user_id) => {
    console.info(`Updating vaccine appointment with id ${id}`);
    
    const vaccine_appointments = await queryAsync(
        `UPDATE vaccine_appointments SET date_time = $1, status = $2, vaccine_id = $3, user_id = $4 WHERE id = $5`,
        [date_time, status, vaccine_id, user_id, id]
    );
    return vaccine_appointments[0];
}

const getAllByUserIdAsync = async(user_id) => {
    console.info(`Getting all vaccine appointments with user_id ${user_id}`);

    return await queryAsync(`SELECT * FROM vaccine_appointments WHERE user_id=$1`, [user_id]);
};

const getAllActiveByUserIdAsync = async(user_id) => {
    console.info(`Getting all active vaccine appointments with user_id ${user_id}`);

    return await queryAsync(
        `SELECT * FROM vaccine_appointments WHERE user_id=$1 AND status!='Inchis'`,
        [user_id]
    );
};

module.exports = {
    addAsync,
    updateAsync,
    getAllByUserIdAsync,
    getAllActiveByUserIdAsync
}