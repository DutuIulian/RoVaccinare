const {
    queryAsync
} = require('..');

const addAsync = async (name, author_id, publisher_id, price) => {
    const books = await queryAsync('INSERT INTO books (name, author_id) VALUES ($1, $2) RETURNING *', [name, author_id]);
	await queryAsync('INSERT INTO publishers_books (book_id, publisher_id, price) VALUES ($1, $2, $3)', [books[0].id, publisher_id, price]);
    return books[0];
};

const getAllAsync = async () => {
    console.info(`Getting all books from database async...`);

    return await queryAsync('SELECT id, name FROM books');
};

const getByIdAsync = async (id) => {
    console.info(`Getting the book with id ${id} from database async...`);

    const books = await queryAsync(
		`SELECT books.id as id, books.name as name,
			authors.id AS author_id, authors.first_name AS author_first_name, authors.last_name AS author_last_name,
			publishers.id AS publisher_id, publishers.name AS publisher_name
		FROM books
		JOIN authors ON books.author_id = authors.id
		JOIN publishers_books ON books.id = publishers_books.book_id
		JOIN publishers ON publishers.id = publishers_books.publisher_id
		WHERE books.id = $1`, [id]);
    return books[0];
};

const getByAuthorIdAsync = async (author_id) => {
    console.info(`Getting the books with author id ${author_id} from database async...`);

    const books = await queryAsync(
		`SELECT books.id as id, books.name as name,
			publishers.id AS publisher_id, publishers.name AS publisher_name
		FROM books
		JOIN publishers_books ON books.id = publishers_books.book_id
		JOIN publishers ON publishers.id = publishers_books.publisher_id
		WHERE books.author_id = $1`, [author_id]);
    return books;
};

const updateByIdAsync = async (id, name, author_id, publisher_id, price) => {
    console.info(`Updating the book with id ${id} from database async...`);

console.log([name, author_id, id]);
console.log([publisher_id, price, id]);
    await queryAsync('UPDATE books SET name = $1, author_id = $2 WHERE id = $3', [name, author_id, id]);
    await queryAsync('UPDATE publishers_books SET publisher_id = $1, price = $2 WHERE book_id = $3', [publisher_id, price, id]);

	const book = getByIdAsync(id);
	return book;
};

const deleteByIdAsync = async (id) => {
    console.info(`Deleting the book with id ${id} from database async...`);

	await queryAsync('DELETE FROM publishers_books WHERE book_id = $1', [id]);
	const books = await queryAsync('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    return books[0];
    
};

module.exports = {
    addAsync,
    getAllAsync,
    getByIdAsync,
	getByAuthorIdAsync,
    updateByIdAsync,
    deleteByIdAsync
}