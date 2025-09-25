import express, { Request, Response } from 'express';
import userRouter from './routes/userRouter';
import postRouter from './routes/postRouter';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  age: number;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: Date;
  published: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  total?: number;
  errors?: string[];
}

const users: User[] = [
  { id: 1, name: 'Admin Flavio', email: 'admin@example.com', role: 'admin', age: 35 },
  { id: 2, name: 'Bela', email: 'Bela@example.com', role: 'user', age: 28 },
  { id: 3, name: 'Antonio Smith', email: 'Smith@example.com', role: 'user', age: 24 },
  { id: 4, name: 'Baiana', email: 'Baiana@example.com', role: 'user', age: 42 }
];

const posts: Post[] = [];

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, _res, next) => {
  console.log(` ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// Configuração das rotas
app.use('/users', userRouter);
app.use('/posts', postRouter);
app.listen(PORT, () => {
  console.log(`  Servidor rodando em http://localhost:${PORT}`);
  console.log('  Endpoints disponíveis:');
  console.log('  GET  /users');
  console.log('  GET  /users/:id');
  console.log('  GET  /users/age-range');
  console.log('  PUT  /users/:id');
  console.log('  POST /posts');
  console.log('  PATCH /posts/:id');
});
