import { User } from '../types/interfaces';
import { UserRepository } from '../data/UserRepository';
import { PostRepository } from '../data/PostRepository';

export class UserBusiness {
  private userRepository: UserRepository;
  private postRepository: PostRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.postRepository = new PostRepository();
  }

  getAllUsers(): User[] {
    return this.userRepository.getAllUsers();
  }

  getUserById(id: number): User | undefined {
    return this.userRepository.getUserById(id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.userRepository.getUserByEmail(email);
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

  cleanupInactiveUsers(confirm: boolean): { success: boolean; removedUsers?: User[]; errors?: string[] } {
    if (!confirm) {
      return { 
        success: false, 
        errors: ['Confirmação necessária. Adicione o parâmetro confirm=true.'] 
      };
}
    
    const allUsers = this.userRepository.getAllUsers();
    const allPosts = this.postRepository.getAllPosts();
    
    const inactiveUserIds = allUsers
      .filter(user => user.role !== 'admin') 
      .filter(user => !allPosts.some(post => post.authorId === user.id)) 
      .map(user => user.id);
    
    if (inactiveUserIds.length === 0) {
      return { 
        success: true, 
        removedUsers: [] 
      };
    }
    
    const removedUsers = this.userRepository.removeInactiveUsers(inactiveUserIds);
    
    return { 
      success: true, 
      removedUsers 
    };
  }
}