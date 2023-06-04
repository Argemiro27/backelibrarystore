import express from 'express';
import cors from 'cors';
import { prismaClient } from './database';

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:4000'
}));

const port = process.env.PORT || 4000;

app.get('/books', async (request, response) => {
  const books = await prismaClient.book.findMany();
  return response.json(books);
});

app.post('/books', async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  const { description, name } = request.body;
  const book = await prismaClient.book.create({
    data: {
      description,
      name,
    },
  });
  return response.json(book);
});

app.listen(port, () => console.log('Server is running on port ', port));
