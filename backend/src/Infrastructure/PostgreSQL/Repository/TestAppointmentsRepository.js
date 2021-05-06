const {
    queryAsync
} = require('..');

const addAsync = async (date_time, test_id, user_id) => {
    console.info(`Adding test appointment in database`);

    const test_appointments = await queryAsync(
        'INSERT INTO test_appointments (date_time, test_id, user_id) VALUES ($1, $2, $3) RETURNING *',
        [date_time, test_id, user_id]
    );

    return test_appointments[0];
};

const updateAsync = async (id, date_time, status, test_id, user_id) => {
    console.info(`Updating test appointment with id ${id}`);
    
    const test_appointments = await queryAsync(
        `UPDATE test_appointments SET date_time = $1, status = $2, test_id = $3, user_id = $4 WHERE id = $5`,
        [date_time, status, test_id, user_id, id]
    );
    return test_appointments[0];
}

const getAllByUserIdAsync = async(user_id) => {
    console.info(`Getting all test appointments with user_id ${user_id}`);

    return await queryAsync(`SELECT * FROM test_appointments WHERE user_id=$1`, [user_id]);
};

const getAllActiveByUserIdAsync = async(user_id) => {
    console.info(`Getting all active test appointments with user_id ${user_id}`);

    return await queryAsync(
        `SELECT * FROM test_appointments WHERE user_id=$1 AND status!='Inchis'`,
        [user_id]
    );
};

module.exports = {
    addAsync,
    updateAsync,
    getAllByUserIdAsync,
    getAllActiveByUserIdAsync
}