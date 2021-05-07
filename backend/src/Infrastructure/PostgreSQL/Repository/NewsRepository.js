const {
    queryAsync
} = require('..');

const addAsync = async (title, content) => {
    console.info(`Adding news in database`);

    const news = await queryAsync(
        'INSERT INTO news (title, content) VALUES ($1, $2) RETURNING *',
        [title, content]
    );

    return news[0];
};

const updateAsync = async (id, title, content) => {
    console.info(`Updating news with id ${id}`);
    
    const news = await queryAsync(
        `UPDATE news SET title = $1, content = $2 WHERE id = $3 RETURNING *`,
        [title, content, id]
    );
    return news[0];
}

const getAllAsync = async() => {
    console.info(`Getting all news`);

    return await queryAsync(`SELECT id, title, content, time_posted AT TIME ZONE 'IOT' AS time_posted
            FROM news ORDER BY id DESC`);
};

const getByIdAsync = async(id) => {
    console.info(`Getting news with id ${id}`);

    const news = await queryAsync(
        `SELECT id, title, content, time_posted AT TIME ZONE 'IOT' AS time_posted FROM news WHERE id=$1`,
        [id]
    );
    return news[0];
};

module.exports = {
    addAsync,
    updateAsync,
    getAllAsync,
    getByIdAsync
}