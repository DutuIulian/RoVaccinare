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
};

const updateStatusAsync = async (id, status) => {
    console.info(`Updating test appointment with id ${id}`);
    
    const test_appointments = await queryAsync(
        `UPDATE test_appointments SET status = $1 WHERE id = $2`,
        [status, id]
    );
    return test_appointments[0];
};

const getAllByUserIdAsync = async(user_id) => {
    console.info(`Getting all test appointments with user_id ${user_id}`);

    return await queryAsync(
        `SELECT ta.id, ta.date_time AT TIME ZONE 'IOT' AS date_time, ta.status, ta.last_update AT TIME ZONE 'IOT' AS last_update, t.name AS test_name, tc.name AS center_name
            FROM test_appointments ta
            JOIN tests t ON ta.test_id=t.id
            JOIN test_centers tc ON t.center_id=tc.id
            WHERE user_id=$1`,
        [user_id]
    );
};

const getAllActiveByUserIdAsync = async(user_id) => {
    console.info(`Getting all active test appointments with user_id ${user_id}`);

    return await queryAsync(
        `SELECT * FROM test_appointments WHERE user_id=$1 AND status!='Inchis' AND status!='Ratat'`,
        [user_id]
    );
};

const getGraphByUserId = async(user_id) => {
    const reviews = await queryAsync(
        `SELECT DATE(last_update) AT TIME ZONE 'IOT' AS exact_date, COUNT(*) as count
            FROM test_appointments
            WHERE user_id=$1 AND DATE(last_update) AT TIME ZONE 'IOT' > current_date - interval '30' day
            GROUP BY exact_date`,
        [user_id]
    );
    return reviews;
}

const deleteByTestIdAsync = async(test_id) => {
    console.info(`Deleting the test appointments with test_id ${test_id} from database`);

    const test_appointments = await queryAsync('DELETE FROM test_appointments WHERE test_id = $1 RETURNING *', [test_id]);
    return test_appointments[0];
};

const deleteByUserIdAsync = async(user_id) => {
    console.info(`Deleting the test appointments with user_id ${user_id} from database`);

    const test_appointments = await queryAsync('DELETE FROM test_appointments WHERE user_id = $1 RETURNING *', [user_id]);
    return test_appointments[0];
};

module.exports = {
    addAsync,
    updateAsync,
    updateStatusAsync,
    getAllByUserIdAsync,
    getAllActiveByUserIdAsync,
    getGraphByUserId,
    deleteByTestIdAsync,
    deleteByUserIdAsync
}