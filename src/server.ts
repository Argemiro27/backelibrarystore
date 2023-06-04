import express from 'express';
import cors from 'cors';
import { prismaClient } from './database';

const app = express();
app.use(express.json());
app.use(cors());
app.options('*', cors());

const port = process.env.PORT || 4000;

app.get('/books', async (request, response) => {
  const books = await prismaClient.book.findMany();
  return response.json(books);
});

app.post('/books', async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  const { description, title, isbn, author, price, quantity} = request.body;
  const book = await prismaClient.book.create({
    data: {
      description,
      title,
      isbn,
      author,
      price,
      quantity,
    },
  });

  return response
    .status(201)
    .json(book);
});



app.listen(port, () => console.log('Server is running on port ', port));

