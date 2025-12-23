import { useMutation } from '@tanstack/react-query';
import { updateRecipe } from '../services';
import type { RecipePayload } from '../types/RecipePayload';

type ParamsType = {
  id: number;
  body: RecipePayload;
};

export function useUpdateRecipe() {
  return useMutation({
    mutationKey: ['update-recipe'],
    mutationFn: ({ id, body }: ParamsType) =>
      updateRecipe(id, body),
  });
}
