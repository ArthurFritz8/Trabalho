import { User } from '../types/interfaces';
import { users } from './database';

export class UserRepository {
  getAllUsers(): User[] {
    return users;
  }

  getUserById(id: number): User | undefined {
    return users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return users.find(u => u.email === email);
  }

  getUsersByAgeRange(minAge?: number, maxAge?: number): User[] {
    let filteredUsers = [...users];

    if (minAge !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.age >= minAge);
    }

    if (maxAge !== undefined) {
      filteredUsers = filteredUsers.filter(user => user.age <= maxAge);
    }

    return filteredUsers;
  }

  updateUser(userId: number, userData: User): User | null {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return null;

    users[userIndex] = {
      ...userData,
      id: userId 
    };
    return users[userIndex];
  }

  isEmailInUse(email: string, excludeUserId?: number): boolean {
    return users.some(user => 
      user.email === email && (excludeUserId === undefined || user.id !== excludeUserId)
    );
  }

  removeInactiveUsers(userIds: number[]): User[] {
    const removedUsers: User[] = [];
    
    userIds.forEach(id => {
      const index = users.findIndex(user => user.id === id);
      if (index !== -1) {
        removedUsers.push({...users[index]});
        users.splice(index, 1);
      }
    });
    
    return removedUsers;
  }
}
