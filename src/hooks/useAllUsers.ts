// hooks/useAllUsers.ts
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/services";
import type { UsersResponse } from "../types/Users";

export function useAllUsers() {
  return useQuery<UsersResponse>({
    queryKey: ["Users"],
    queryFn: getAllUsers,
  });
}
