// Authentication service to be implemented

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export class AuthService {
  async login(credentials: LoginCredentials): Promise<any> {
    // Implementation to be added
    return { message: 'Login service method' };
  }

  async register(data: RegisterData): Promise<any> {
    // Implementation to be added
    return { message: 'Register service method' };
  }
}

export default new AuthService();
