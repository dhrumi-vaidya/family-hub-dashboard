// Mock database for development - Replace with real database in production
import { User, Family } from '../types/auth';
import bcrypt from 'bcryptjs';

// Mock families
export const mockFamilies: Family[] = [
  {
    id: '1',
    name: 'Sharma Family',
    memberCount: 8,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Verma Family',
    memberCount: 5,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

// Mock users with hashed passwords
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    email: 'rahul@sharma.com',
    password: '', // Will be set below
    role: 'admin',
    families: [mockFamilies[0], mockFamilies[1]],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Sunita Sharma',
    email: 'sunita@sharma.com',
    password: '', // Will be set below
    role: 'member',
    families: [mockFamilies[0]],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'super_admin_1',
    name: 'System Administrator',
    email: 'super.admin@kutumb.com',
    password: '', // Will be set below with different password
    role: 'super_admin',
    families: [], // Super admin doesn't belong to any family
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Initialize passwords (in real app, this would be done during user creation)
const initializePasswords = async () => {
  const regularPassword = await bcrypt.hash('password123', 12);
  const superAdminPassword = await bcrypt.hash('QWerty@123', 12);
  
  mockUsers.forEach(user => {
    if (user.role === 'super_admin') {
      user.password = superAdminPassword;
    } else {
      user.password = regularPassword;
    }
  });
};

// Initialize on module load
initializePasswords();

// Database operations (mock implementations)
export class Database {
  static async findUserByEmail(email: string): Promise<User | null> {
    // Support both email and phone number login
    const user = mockUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() || 
      email === '9876543210' && u.id === '1' ||
      email === '9876543211' && u.id === '2'
    );
    return user || null;
  }

  static async findUserById(id: string): Promise<User | null> {
    const user = mockUsers.find(u => u.id === id);
    return user || null;
  }

  static async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUsers.push(newUser);
    return newUser;
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = mockUsers.findIndex(u => u.id === id);
    if (userIndex === -1) return null;
    
    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...updates,
      updatedAt: new Date(),
    };
    return mockUsers[userIndex];
  }

  static async getFamilyById(id: string): Promise<Family | null> {
    const family = mockFamilies.find(f => f.id === id);
    return family || null;
  }

  static async getUserFamilies(userId: string): Promise<Family[]> {
    const user = await this.findUserById(userId);
    return user?.families || [];
  }
}