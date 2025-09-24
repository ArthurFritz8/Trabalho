import express, { Request, Response } from 'express';

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
  console.log(`📋 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

// ===== ENDPOINTS =====

app.get('/users', (_req: Request, res: Response) => {
  console.log('📋 GET /users - Listando todos os usuários');
  
  const response: ApiResponse<User[]> = {
    success: true,
    message: 'Usuários recuperados com sucesso',
    data: users,
    total: users.length
  };
  
  return res.status(200).json(response);
});

// 🔧 EXERCÍCIO 1: GET com Route Parameter
// GET /users/:id - Buscar um usuário específico pelo ID
app.get('/users/:id', (req: Request, res: Response) => {
  console.log(`📋 GET /users/${req.params.id} - Buscando usuário por ID`);

  const userId = parseInt(req.params.id);
  
  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido. O ID deve ser um número.',
      errors: ['ID inválido']
    });
  }
  
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado',
      errors: ['Usuário não encontrado com o ID fornecido']
    });
  }
  
  const response: ApiResponse<User> = {
    success: true,
    message: 'Usuário encontrado com sucesso',
    data: user
  };
  
  return res.status(200).json(response);
});

// 🔧 EXERCÍCIO 2: GET com Query Parameters Avançados
// GET /users/age-range - Filtrar usuários por faixa etária
app.get('/users/age-range', (req: Request, res: Response) => {
  console.log('📋 GET /users/age-range - Filtrando usuários por faixa etária');

  const { min, max } = req.query;
  const errors: string[] = [];

  const minAge = min ? parseInt(min as string) : undefined;
  const maxAge = max ? parseInt(max as string) : undefined;

  if (min && isNaN(minAge!)) {
    errors.push('O parâmetro "min" deve ser um número válido');
  }

  if (max && isNaN(maxAge!)) {
    errors.push('O parâmetro "max" deve ser um número válido');
  }

  if (minAge && maxAge && minAge > maxAge) {
    errors.push('A idade mínima não pode ser maior que a idade máxima');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Parâmetros inválidos',
      errors
    });
  }

  let filteredUsers = [...users];

  if (minAge !== undefined) {
    filteredUsers = filteredUsers.filter(user => user.age >= minAge);
  }

  if (maxAge !== undefined) {
    filteredUsers = filteredUsers.filter(user => user.age <= maxAge);
  }

  const response: ApiResponse<User[]> = {
    success: true,
    message: 'Usuários filtrados com sucesso',
    data: filteredUsers,
    total: filteredUsers.length
  };

  return res.status(200).json(response);
});

// 🔧 EXERCÍCIO 3: POST com Validações Personalizadas
// POST /posts - Criar um novo post
app.post('/posts', (req: Request, res: Response) => {
  console.log('📋 POST /posts - Criando um novo post');

  const { title, content, authorId } = req.body;
  const errors: string[] = [];

  if (!title || typeof title !== 'string' || title.length < 3) {
    errors.push('O título deve ter no mínimo 3 caracteres');
  }

  if (!content || typeof content !== 'string' || content.length < 10) {
    errors.push('O conteúdo deve ter no mínimo 10 caracteres');
  }

  if (!authorId) {
    errors.push('O ID do autor é obrigatório');
  } else {
    const authorExists = users.some(user => user.id === authorId);
    if (!authorExists) {
      errors.push('O autor informado não existe');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors
    });
  }

  const newPost: Post = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    title,
    content,
    authorId,
    createdAt: new Date(),
    published: false 
  };

  posts.push(newPost);

  const response: ApiResponse<Post> = {
    success: true,
    message: 'Post criado com sucesso',
    data: newPost
  };

  return res.status(201).json(response);
});

// 🔧 EXERCÍCIO 4: PUT - Atualização Completa
// PUT /users/:id - Atualizar um usuário completamente
app.put('/users/:id', (req: Request, res: Response) => {
  console.log(`📋 PUT /users/${req.params.id} - Atualizando usuário completamente`);

  const userId = parseInt(req.params.id);

  if (isNaN(userId)) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido. O ID deve ser um número.',
      errors: ['ID inválido']
    });
  }

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado',
      errors: ['Usuário não encontrado com o ID fornecido']
    });
  }

  const { name, email, age, role } = req.body;
  const errors: string[] = [];

  if (!name) errors.push('O campo "name" é obrigatório');
  if (!email) errors.push('O campo "email" é obrigatório');
  if (age === undefined) errors.push('O campo "age" é obrigatório');
  if (!role) errors.push('O campo "role" é obrigatório');

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos. Todos os campos são obrigatórios.',
      errors
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Email inválido',
      errors: ['Formato de email inválido']
    });
  }

  const emailExists = users.some((u, index) => 
    u.email === email && index !== userIndex
  );

  if (emailExists) {
    return res.status(409).json({
      success: false,
      message: 'Email já está em uso por outro usuário',
      errors: ['Email duplicado']
    });
  }

  if (role !== 'admin' && role !== 'user') {
    return res.status(400).json({
      success: false,
      message: 'Role inválida',
      errors: ['Role deve ser "admin" ou "user"']
    });
  }

  if (typeof age !== 'number' || age < 0) {
    return res.status(400).json({
      success: false,
      message: 'Idade inválida',
      errors: ['Age deve ser um número positivo']
    });
  }


  users[userIndex] = {
    id: userId, 
    name,
    email,
    age,
    role
  };

  const response: ApiResponse<User> = {
    success: true,
    message: 'Usuário atualizado com sucesso',
    data: users[userIndex]
  };

  return res.status(200).json(response);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log('📝 Endpoints disponíveis:');
  console.log('  GET  /users');
  console.log('  GET  /users/:id');
  console.log('  GET  /users/age-range');
  console.log('  POST /posts');
  console.log('  PUT  /users/:id');
});