/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (name == null) {
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    name, year, author, summary, publisher, pageCount, readPage, finished, reading, id, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      'status': 'success',
      'message': 'Buku berhasil ditambahkan',
      'data': {
        'bookId': id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    'status': 'error',
    'message': 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const {name, finished, reading} = request.query;

  let filteredBook = books;

  if (name !== undefined) {
    filteredBook = books.filter((book)=>book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    filteredBook = books.filter((book)=>book.reading==reading);
  }

  if (finished !== undefined) {
    filteredBook = books.filter((book)=>book.finished==finished);
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  return response;
};

const getBookByIdHandler = (request, h) => {
  const {id} = request.params;

  const book = books.filter((book)=>book.id===id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book: book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h)=>{
  const {id} = request.params;

  const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
  const updatedAt = new Date().toISOString();

  if (name == null) {
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      'status': 'fail',
      'message': 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book)=>book.id===id);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (response, h) => {
  const {id} = response.params;

  const index = books.findIndex((book)=>book.id===id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const responsee = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  responsee.code(404);
  return responsee;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
