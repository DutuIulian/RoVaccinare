const {
    queryAsync
} = require('..');

const addAsync = async (name) => {
    console.info(`Adding author in database async...`);

    const publishers = await queryAsync('INSERT INTO publishers (name) VALUES ($1) RETURNING *', [name]);
    return publishers[0];
};

const getAllAsync = async () => {
    console.info(`Getting all publishers from database async...`);

    return await queryAsync('SELECT * FROM publishers');
};

const getByIdAsync = async (id) => {
    console.info(`Getting the author with id ${id} from database async...`);

    const publishers = await queryAsync('SELECT * FROM publishers WHERE id = $1', [id]);
    publishers[0]['books'] = await queryAsync(
		`SELECT books.id as id, books.name as name,
			authors.id AS author_id, authors.first_name AS author_first_name, authors.last_name AS author_last_name
		FROM books
		JOIN authors ON books.author_id = authors.id
		JOIN publishers_books ON books.id = publishers_books.book_id
		WHERE publishers_books.publisher_id = $1`, [id]);
    return publishers[0];
};

const updateByIdAsync = async (id, name) => {
    console.info(`Updating the author with id ${id} from database async...`);

    await queryAsync('UPDATE publishers SET name = $1 WHERE id = $2', [name, id]);
    
	const publisher = getByIdAsync(id);
	return publisher;
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting the author with id ${id} from database async...`);

    const publishers = await queryAsync('DELETE FROM publishers WHERE id = $1 RETURNING *', [id]);
    return publishers[0];
    
};

module.exports = {
    addAsync,
    getAllAsync,
    getByIdAsync,
    updateByIdAsync,
    deleteByIdAsync
}