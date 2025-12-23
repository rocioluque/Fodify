import { createContext } from 'react';

export type User = {
  id: number;
  username: string;
  email: string;
  password?: string; 
  image: string;
};

export const UserContext = createContext<User | null>(null);