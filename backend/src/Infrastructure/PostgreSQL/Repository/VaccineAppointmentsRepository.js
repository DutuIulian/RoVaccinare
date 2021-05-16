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
};

const updateStatusAsync = async (id, status) => {
    console.info(`Updating vaccine appointment with id ${id}`);
    
    const vaccine_appointments = await queryAsync(
        `UPDATE vaccine_appointments SET status = $1 WHERE id = $2`,
        [status, id]
    );
    return vaccine_appointments[0];
};

const getAllByUserIdAsync = async(user_id) => {
    console.info(`Getting all vaccine appointments with user_id ${user_id}`);

    return await queryAsync(
        `SELECT va.id, va.date_time AT TIME ZONE 'IOT' AS date_time, va.status, va.last_update AT TIME ZONE 'IOT' AS last_update, v.name AS vaccine_name, vc.name AS center_name
            FROM vaccine_appointments va
            JOIN vaccines v ON va.vaccine_id=v.id
            JOIN vaccine_centers vc ON v.center_id=vc.id
            WHERE user_id=$1`,
        [user_id]
    );
};

const getAllActiveByUserIdAsync = async(user_id) => {
    console.info(`Getting all active vaccine appointments with user_id ${user_id}`);

    return await queryAsync(
        `SELECT * FROM vaccine_appointments WHERE user_id=$1 AND status!='Inchis' AND status!='Ratat'`,
        [user_id]
    );
};

const getGraphByUserId = async(user_id) => {
    const reviews = await queryAsync(
        `SELECT DATE(last_update) AT TIME ZONE 'IOT' AS exact_date, COUNT(*) as count
            FROM vaccine_appointments
            WHERE user_id=$1 AND DATE(last_update) AT TIME ZONE 'IOT' > current_date - interval '30' day
            GROUP BY exact_date`,
        [user_id]
    );
    return reviews;
}

const deleteByVaccineIdAsync = async(vaccine_id) => {
    console.info(`Deleting the vaccine appointments with vaccine_id ${vaccine_id} from database`);

    const vaccine_appointments = await queryAsync('DELETE FROM vaccine_appointments WHERE vaccine_id = $1 RETURNING *', [vaccine_id]);
    return vaccine_appointments[0];
};

module.exports = {
    addAsync,
    updateAsync,
    updateStatusAsync,
    getAllByUserIdAsync,
    getAllActiveByUserIdAsync,
    getGraphByUserId,
    deleteByVaccineIdAsync
}