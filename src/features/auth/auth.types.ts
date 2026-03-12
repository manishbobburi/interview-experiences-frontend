export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

interface Role {
  name: "USER" | "ADMIN";
}

export interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
  verified: boolean;
  role: Role;
}

export interface AuthResponse {
  token: string;
  user: User;
}