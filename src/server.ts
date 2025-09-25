import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRouter';
import postRouter from './routes/postRouter';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors()); 

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.use('/users', userRouter);
app.use('/posts', postRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('Endpoints disponíveis:');
  console.log('  GET  /users');
  console.log('  GET  /users/:id');
  console.log('  GET  /users/age-range');
  console.log('  PUT  /users/:id');
  console.log('  DELETE /users/cleanup-inactive');
  console.log('  POST /posts');
  console.log('  GET  /posts');
  console.log('  GET  /posts/:id');
  console.log('  PATCH /posts/:id');
  console.log('  DELETE /posts/:id');
});

export default app; 