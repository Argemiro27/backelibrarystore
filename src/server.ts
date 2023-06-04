import express, { Request, Response } from 'express';
import cors from 'cors';
import { prismaClient } from './database';
import { BookCreateInput } from './database/types';

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 4000;

app.get('/books', async (request: Request, response: Response) => {
  const books = await prismaClient.book.findMany();
  return response.json(books);
});

app.post('/books', async (request: Request, response: Response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

  const { description, title, author, isbn, price, quantity }: BookCreateInput = request.body;
  const book = await prismaClient.book.create({
    data: {
      description,
      title,
      author,
      isbn,
      price,
      quantity,
    },
  });

  return response
    .status(201)
    .json(book);
});

app.delete('/books/:id', async (request: Request, response: Response) => {
  const { id } = request.params;

  try {
    const existingBook = await prismaClient.book.findUnique({
      where: {
        id: id.toString()
      }
    });

    if (!existingBook) {
      return response.status(404).json({ error: 'Livro não encontrado' });
    }

    await prismaClient.book.delete({
      where: {
        id: id.toString()
      }
    });

    return response.json({ message: 'Livro excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    return response.status(500).json({ error: 'Ocorreu um erro ao excluir o livro' });
  }
});


app.listen(port, () => console.log('Server is running on port ', port));
