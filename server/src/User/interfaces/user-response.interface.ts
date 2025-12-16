import { Request } from 'express';

// ============ SignUp User Interface ============

export interface SignUpResponse {
  message: string;
  user: user;
}

export interface user {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: string;
}

// ============ SignIn User Interface ============
export interface SignInResponse {
  message: string;
  token: string;
}

// ============ Profile User Interface ============
export interface ProfileResponse {
  message: string;
  user: user;
}

// ============ Request User Interface ============
export interface RequestWithUser extends Request {
  authUser?: {
    _id: string;
    email: string;
    name: string;
  };
}

export interface ChangePasswordResponse {
  message: string;
}
