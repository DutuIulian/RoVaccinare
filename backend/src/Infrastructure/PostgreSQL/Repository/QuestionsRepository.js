const {
    queryAsync
} = require('..');

const addAsync = async (title, question, user_id) => {
    console.info(`Adding questions in database`);

    const questions = await queryAsync(
        'INSERT INTO questions (title, question, user_id) VALUES ($1, $2, $3) RETURNING *',
        [title, question, user_id]
    );

    return questions[0];
};

const updateAsync = async (id, title, question, answer, user_id, support_user_id, pinned) => {
    console.info(`Updating question with id ${id}`);
    
    const questions = await queryAsync(
        `UPDATE questions SET title = $1, question = $2, answer= $3, user_id = $4, support_user_id = $5, pinned = $6 WHERE id = $7`,
        [title, question, answer, user_id, support_user_id, pinned, id]
    );
    return questions[0];
}

const updatePinnedAsync = async(id, pinned) => {
    console.info(`Updating question with id ${id} RETURNING *`);
    
    const questions = await queryAsync(
        `UPDATE questions SET pinned = $1 WHERE id = $2`,
        [pinned, id]
    );
    return questions[0];
};

const updateAnswer = async(id, answer, support_user_id) => {
    console.info(`Updating question with id ${id}`);
    
    const questions = await queryAsync(
        `UPDATE questions SET answer = $1, support_user_id = $2 WHERE id = $3 RETURNING *`,
        [answer, support_user_id, id]
    );
    return questions[0];
};

const updateSupportUserIdAsync = async(support_user_id, new_support_user_id) => {
    console.info(`Updating questions with support_user_id ${support_user_id}`);
    
    const questions = await queryAsync(
        `UPDATE questions SET support_user_id = $1 WHERE support_user_id = $2 RETURNING *`,
        [new_support_user_id, support_user_id]
    );
    return questions;
};

const getByIdAsync = async(id) => {
    console.info(`Getting question with id ${id}`);

    const questions = await queryAsync(
        `SELECT q.id, q.title, q.question, q.answer,
                CONCAT(u1.last_name, ' ', u1.first_name) AS user_name,
                CONCAT(u2.last_name, ' ', u2.first_name) AS support_user_name
            FROM questions q
            JOIN users u1 ON q.user_id=u1.id
            JOIN users u2 ON q.support_user_id=u2.id
            WHERE q.id=$1`,
        [id]
    );
    return questions[0];
};

const getAllPinnedAsync = async() => {
    console.info(`Getting all pinned questions`);

    const questions = await queryAsync(
        `SELECT q.id, q.title, q.question, q.answer,
                CONCAT(u1.last_name, ' ', u1.first_name) AS user_name,
                CONCAT(u2.last_name, ' ', u2.first_name) AS support_user_name
            FROM questions q
            JOIN users u1 ON q.user_id=u1.id
            JOIN users u2 ON q.support_user_id=u2.id
            WHERE q.pinned=true
            ORDER BY q.id DESC`
    );
    return questions;
};

const getAllUnansweredAsync = async() => {
    console.info(`Getting all unanswered questions`);

    const questions = await queryAsync(
        `SELECT q.id, q.title, q.question, q.answer,
                CONCAT(u1.last_name, ' ', u1.first_name) AS user_name,
                CONCAT(u2.last_name, ' ', u2.first_name) AS support_user_name
            FROM questions q
            JOIN users u1 ON q.user_id=u1.id
            JOIN users u2 ON q.support_user_id=u2.id
            WHERE q.answer IS NULL
            ORDER BY q.id ASC`
    );
    return questions;
};

const getAllAnsweredAsync = async() => {
    console.info(`Getting all answered questions`);

    const questions = await queryAsync(
        `SELECT q.id, q.title, q.question, q.answer,
                CONCAT(u1.last_name, ' ', u1.first_name) AS user_name,
                CONCAT(u2.last_name, ' ', u2.first_name) AS support_user_name
            FROM questions q
            JOIN users u1 ON q.user_id=u1.id
            JOIN users u2 ON q.support_user_id=u2.id
            WHERE q.answer IS NOT NULL AND q.pinned=false
            ORDER BY q.id DESC`
    );
    return questions;
};

const getAllByUserIdAsync = async(user_id) => {
    console.info(`Getting all pinned questions`);

    const questions = await queryAsync(
        `SELECT q.title, q.question, q.answer,
                CONCAT(u1.last_name, ' ', u1.first_name) AS user_name,
                CONCAT(u2.last_name, ' ', u2.first_name) AS support_user_name
            FROM questions q
            JOIN users u1 ON q.user_id=u1.id
            JOIN users u2 ON q.support_user_id=u2.id
            WHERE q.user_id=$1`,
            [user_id]
    );
    return questions;
};

const deleteByUserIdAsync = async(user_id) => {
    console.info(`Deleting the questions with user_id ${user_id} from database`);

    const questions = await queryAsync('DELETE FROM questions WHERE user_id = $1 RETURNING *', [user_id]);
    return questions[0];
};

module.exports = {
    addAsync,
    updateAsync,
    updatePinnedAsync,
    updateAnswer,
    updateSupportUserIdAsync,
    getByIdAsync,
    getAllPinnedAsync,
    getAllUnansweredAsync,
    getAllAnsweredAsync,
    getAllByUserIdAsync,
    deleteByUserIdAsync
}