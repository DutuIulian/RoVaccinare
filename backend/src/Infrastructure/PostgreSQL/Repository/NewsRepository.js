const {
    queryAsync
} = require('..');

const addAsync = async (title, content, time_posted) => {
    console.info(`Adding news in database`);

    const news = await queryAsync(
        'INSERT INTO news (title, content, time_posted) VALUES ($1, $2, $3) RETURNING *',
        [title, content, time_posted]
    );

    return news[0];
};

const updateAsync = async (id, title, content, time_posted) => {
    console.info(`Updating news with id ${id}`);
    
    const news = await queryAsync(
        `UPDATE news SET title = $1, content = $2, time_posted= $3 WHERE id = $4`,
        [title, content, time_posted, id]
    );
    return news[0];
}

const getAllAsync = async() => {
    console.info(`Getting all news`);

    return await queryAsync(`SELECT * FROM news`);
};

module.exports = {
    addAsync,
    updateAsync,
    getAllAsync
}