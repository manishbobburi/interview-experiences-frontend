export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "viewer" | "poster";
  verified: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}