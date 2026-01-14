export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignInUser {
  id: number;
  name: string;
  email: string;
  role: "viewer" | "poster" | string;
  verified: boolean;
  jwt: string;

  passwordHash: string;
}
