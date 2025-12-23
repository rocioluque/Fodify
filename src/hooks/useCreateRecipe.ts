import { useMutation } from '@tanstack/react-query';
import { createRecipe } from '../services/index';
import type { RecipeCreatePayload } from '../types/RecipeCreatePayload';

export function useCreateRecipe() {
  return useMutation({
    mutationKey: ['create-recipe'],
    mutationFn: (body: RecipeCreatePayload) => createRecipe(body),
  });
}