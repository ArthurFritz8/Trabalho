// Armazenamento de dados em memória
import { User, Post } from '../types/interfaces';

// Dados iniciais
export const users: User[] = [
  { id: 1, name: 'Admin Flavio', email: 'admin@example.com', role: 'admin', age: 35 },
  { id: 2, name: 'Bela', email: 'Bela@example.com', role: 'user', age: 28 },
  { id: 3, name: 'Antonio Smith', email: 'Smith@example.com', role: 'user', age: 24 },
  { id: 4, name: 'Baiana', email: 'Baiana@example.com', role: 'user', age: 42 }
];

export const posts: Post[] = [];