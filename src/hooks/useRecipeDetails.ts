import { useQuery } from '@tanstack/react-query';
import { getRecipeById } from '../services/index';

export function useRecipeDetails(id?: number) {
  return useQuery({
    queryKey: ['recipe-details'],
    queryFn: () => getRecipeById(id as number),
    enabled: !!id, 
  });
}
