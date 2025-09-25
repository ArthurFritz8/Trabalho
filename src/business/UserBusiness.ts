import { User } from '../types/interfaces';
import { UserRepository } from '../data/UserRepository';

export class UserBusiness {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  getAllUsers(): User[] {
    return this.userRepository.getAllUsers();
  }

  getUserById(id: number): User | undefined {
    return this.userRepository.getUserById(id);
  }

  getUsersByAgeRange(minAge?: number, maxAge?: number): User[] {
    return this.userRepository.getUsersByAgeRange(minAge, maxAge);
  }

  updateUser(userId: number, userData: User): { success: boolean; user?: User; errors?: string[] } {
    const errors: string[] = [];

    if (!userData.name) errors.push('O campo "name" é obrigatório');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email) {
      errors.push('O campo "email" é obrigatório');
    } else if (!emailRegex.test(userData.email)) {
      errors.push('Formato de email inválido');
    }

    if (userData.age === undefined) {
      errors.push('O campo "age" é obrigatório');
    } else if (typeof userData.age !== 'number' || userData.age < 0) {
      errors.push('Age deve ser um número positivo');
    }

    if (!userData.role) {
      errors.push('O campo "role" é obrigatório');
    } else if (userData.role !== 'admin' && userData.role !== 'user') {
      errors.push('Role deve ser "admin" ou "user"');
    }

    if (userData.email && this.userRepository.isEmailInUse(userData.email, userId)) {
      errors.push('Email duplicado');
      return { success: false, errors };
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    const updatedUser = this.userRepository.updateUser(userId, userData);
    if (!updatedUser) {
      return { success: false, errors: ['Usuário não encontrado'] };
    }

    return { success: true, user: updatedUser };
  }
}