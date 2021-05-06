const {
    queryAsync
} = require('..');

const addAsync = async (title, question) => {
    console.info(`Adding questions in database`);

    const questions = await queryAsync(
        'INSERT INTO questions (title, question) VALUES ($1, $2) RETURNING *',
        [title, question]
    );

    return questions[0];
};

const updateAsync = async (id, title, question, answer, user_id, support_user_id, pinned) => {
    console.info(`Updating questions with id ${id}`);
    
    const questions = await queryAsync(
        `UPDATE questions SET title = $1, question = $2, answer= $3, user_id = $4, support_user_id = $5, pinned = $6 WHERE id = $7`,
        [title, question, answer, user_id, support_user_id, pinned, id]
    );
    return questions[0];
}

const getByIdAsync = async(id) => {
    console.info(`Getting question with id ${id}`);

    const questions = await queryAsync(`SELECT * FROM questions WHERE id = $1`, [id]);
    return questions[0];
};

const getAllPinnedAsync = async() => {
    console.info(`Getting all pinned questions`);

    const questions = await queryAsync(
        `SELECT q.title, q.question, q.answer,
                CONCAT(u1.last_name, ' ', u1.first_name) AS user_name,
                CONCAT(u2.last_name, ' ', u2.first_name) AS support_user_name
            FROM questions q
            JOIN users u1 ON q.user_id=u1.id
            JOIN users u2 ON q.support_user_id=u2.id
            WHERE q.pinned=true`
    );
    return questions;
};

module.exports = {
    addAsync,
    updateAsync,
    getByIdAsync,
    getAllPinnedAsync
}