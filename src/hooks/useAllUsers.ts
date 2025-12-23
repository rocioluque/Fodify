// hooks/useAllUsers.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username?: string;
  email?: string;
  phone?: string;
  image?: string;
  address: {
    address: string;
    street: string;
    number: string;
    city: string;
    zipcode: string;
    coordinates: { lat: string; lng: string };
    stateCode: string;
    postalCode: string;
  };
  role: string;
}

export interface UsersResponse {
  users: User[];
}

export function useAllUsers() {
  return useQuery<UsersResponse>({
    queryKey: ["all-users"],
    queryFn: async () => {
      return api.get("/users"); 
    },
  });
}
