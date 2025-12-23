import { useMutation } from "@tanstack/react-query";

import { deleteRecipes } from "../services";

export function useDeleteRecipes() {
  return useMutation({
    mutationKey: ['delete-recipes'],
    mutationFn: (id: number | undefined) => deleteRecipes(id),
  });
}
