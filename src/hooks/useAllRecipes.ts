import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { AxiosResponse } from "axios";
import { getAllRecipes } from "@/services";


export function useAllRecipes() {
  return useQuery({
    queryKey: ["all-recipes"],
    queryFn: getAllRecipes,
  });
}
