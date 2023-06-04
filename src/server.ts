import express from 'express';
import cors from 'cors';
import { prismaClient } from './database';
import { BookCreateInput } from './database/types';

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000;

app.get('/books', async (request, response) => {
  const books = await prismaClient.book.findMany();
  return response.json(books);
});

app.post('/books', async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  const { description, title } = request.body as BookCreateInput;
  const book = await prismaClient.book.create({
    data: {
      description,
      title,
      isbn: 0,
      author: '',
      price: 0,
      quantity: 0,
    },
  });

  return response
    .status(201)
    .json(book);
});

app.listen(port, () => console.log('Server is running on port ', port));
