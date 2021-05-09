const {
    queryAsync
} = require('..');

const addAsync = async (title, review, user_id, center_id) => {
    console.info(`Adding reviews in database`);

    const reviews = await queryAsync(
        'INSERT INTO vaccine_center_reviews (title, review, user_id, center_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, review, user_id, center_id]
    );

    return reviews[0];
};

const updateAsync = async (id, title, review, date, user_id, center_id) => {
    console.info(`Updating reviews with id ${id}`);

    const reviews = await queryAsync(
        `UPDATE vaccine_center_reviews SET title=$1, review=$2, date=$3, user_id=$4, center_id=$5 WHERE id = $6`,
        [title, review, date, user_id, center_id, id]
    );
    return reviews[0];
}

const getByCenterIdAsync = async(id) => {
    console.info(`Getting reviews for vaccine center with id ${id}`);

    const reviews = await queryAsync(
        `SELECT r.id, r.title, r.review, r.date AT TIME ZONE 'IOT' AS date, CONCAT(u.last_name, ' ', u.first_name) AS user_name
            FROM vaccine_center_reviews r
            JOIN users u ON r.user_id=u.id
            WHERE r.center_id = $1
            ORDER BY r.id DESC`,
        [id]
    );
    return reviews;
};

const getByUserIdCenterIdAsync = async(user_id, center_id) => {
    const reviews = await queryAsync(
        `SELECT id FROM vaccine_center_reviews WHERE user_id = $1 AND center_id = $2`,
        [user_id, center_id]
    );
    return reviews;
};

const getGraphByUserId = async(user_id) => {
    const reviews = await queryAsync(
        `SELECT DATE(date) AT TIME ZONE 'IOT' AS exact_date, COUNT(*) as count
            FROM vaccine_center_reviews
            WHERE user_id=$1 AND DATE(date) AT TIME ZONE 'IOT' > current_date - interval '30' day
            GROUP BY exact_date`,
        [user_id]
    );
    return reviews;
}

module.exports = {
    addAsync,
    updateAsync,
    getByCenterIdAsync,
    getByUserIdCenterIdAsync,
    getGraphByUserId
}