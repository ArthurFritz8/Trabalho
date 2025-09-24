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
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', age: 35 },
  { id: 2, name: 'John Doe', email: 'john@example.com', role: 'user', age: 28 },
  { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'user', age: 24 },
  { id: 4, name: 'Robert Johnson', email: 'robert@example.com', role: 'user', age: 42 }
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

app.get('/users/search', (req: Request, res: Response) => {
  console.log('📋 GET /users/search - Buscando usuários com filtros');
  
  const { role, minAge, maxAge } = req.query;
  
  let filteredUsers = [...users];
  
  if (role) {
    filteredUsers = filteredUsers.filter(user => 
      user.role === role
    );
  }
  
  if (minAge && !isNaN(Number(minAge))) {
    filteredUsers = filteredUsers.filter(user => 
      user.age >= Number(minAge)
    );
  }
  
  if (maxAge && !isNaN(Number(maxAge))) {
    filteredUsers = filteredUsers.filter(user => 
      user.age <= Number(maxAge)
    );
  }

  const response: ApiResponse<User[]> = {
    success: true,
    message: 'Busca realizada com sucesso',
    data: filteredUsers,
    total: filteredUsers.length
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

// 🔧 EXERCÍCIO 2: POST para Criar Recurso
// POST /users - Criar um novo usuário
app.post('/users', (req: Request, res: Response) => {
  console.log('📋 POST /users - Criando um novo usuário');

  const { name, email, age, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos. Os campos "name" e "email" são obrigatórios.',
      errors: ['"name" e "email" são obrigatórios']
    });
  }

  const newUser: User = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name,
    email,
    age: age || 0,
    role: role || 'user'
  };

  users.push(newUser);

  const response: ApiResponse<User> = {
    success: true,
    message: 'Usuário criado com sucesso',
    data: newUser
  };

  return res.status(201).json(response);
});

// 🔧 EXERCÍCIO 3: PUT para Atualizar Recurso
// PUT /users/:id - Atualizar um usuário existente
app.put('/users/:id', (req: Request, res: Response) => {
  console.log(`📋 PUT /users/${req.params.id} - Atualizando usuário`);

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

  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    age: age || users[userIndex].age,
    role: role || users[userIndex].role
  };

  const response: ApiResponse<User> = {
    success: true,
    message: 'Usuário atualizado com sucesso',
    data: users[userIndex]
  };

  return res.status(200).json(response);
});

// 🔧 EXERCÍCIO 4: PUT - Atualização Completa
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

  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Usuário não encontrado',
      errors: ['Usuário não encontrado com o ID fornecido']
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
  console.log('  GET  /users/search');
  console.log('  GET  /users/:id');
  console.log('  POST /users');
  console.log('  PUT  /users/:id');
});
