import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { useCreateRecipe } from '../hooks/useCreateRecipe';
import { useUserStore } from '../store/useUserStore';
import type { RecipeCreatePayload } from '../types/RecipeCreatePayload';

/* =========================
   SCHEMA
========================= */
const recipeSchema = z.object({
  name: z.string().min(3),

  ingredients: z.array(
    z.object({
      value: z.string().min(2),
    })
  ),

  instructions: z.array(
    z.object({
      value: z.string().min(5),
    })
  ),

  tags: z.array(
    z.object({
      value: z.string(),
    })
  ),

  mealType: z.array(
    z.object({
      value: z.string(),
    })
  ),

  prepTimeMinutes: z.number().min(1),
  cookTimeMinutes: z.number().min(1),
  servings: z.number().min(1),

  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  cuisine: z.string(),
  caloriesPerServing: z.number(),
  image: z.string().url(),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;

/* =========================
   COMPONENT
========================= */
export function Form() {
  const { mutate, isPending } = useCreateRecipe();
  const user = useUserStore(state => state.user);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
    name: '',
    ingredients: [{ value: '' }],
    instructions: [{ value: '' }],
    tags: [],
    mealType: [],
    prepTimeMinutes: 10,
    cookTimeMinutes: 10,
    servings: 1,
    difficulty: 'Easy',
    cuisine: '',
    caloriesPerServing: 100,
    image: '',
  },
});

  const ingredients = useFieldArray({
    control,
    name: 'ingredients',
  });

  const instructions = useFieldArray({
    control,
    name: 'instructions',
  });

  const tags = useFieldArray({
    control,
    name: 'tags',
  });

  const mealType = useFieldArray({
    control,
    name: 'mealType',
  });

  function onSubmit(data: RecipeFormData) {
  const payload: RecipeCreatePayload = {
    name: data.name,
    ingredients: data.ingredients.map(i => i.value),
    instructions: data.instructions.map(i => i.value),
    tags: data.tags.map(t => t.value),
    mealType: data.mealType.map(m => m.value),
    prepTimeMinutes: data.prepTimeMinutes,
    cookTimeMinutes: data.cookTimeMinutes,
    servings: data.servings,
    difficulty: data.difficulty,
    cuisine: data.cuisine,
    caloriesPerServing: data.caloriesPerServing,
    image: data.image,
  };

  mutate(payload); 
}


  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h2 className="text-3xl font-bold mb-2">Nueva Receta</h2>
        <p className="text-gray-600 mb-4">Usuario: {user?.username}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* NAME */}
          <input {...register('name')} placeholder="Nombre de la receta" />
          {errors.name && <p>{errors.name.message}</p>}

          {/* INGREDIENTS */}
          <section>
            <h3>Ingredientes</h3>
            {ingredients.fields.map((field, i) => (
              <div key={field.id} className="flex gap-2">
                <input {...register(`ingredients.${i}.value`)} />
                <button type="button" onClick={() => ingredients.remove(i)}>✕</button>
              </div>
            ))}
            <button type="button" onClick={() => ingredients.append({ value: '' })}>
              + Ingrediente
            </button>
          </section>

          {/* INSTRUCTIONS */}
          <section>
            <h3>Instrucciones</h3>
            {instructions.fields.map((field, i) => (
              <textarea key={field.id} {...register(`instructions.${i}`)} />
            ))}
            <button type="button" onClick={() => instructions.append({ value: '' })}>
              + Paso
            </button>
          </section>

          {/* TIMES */}
          <input
            type="number"
            {...register('prepTimeMinutes', { valueAsNumber: true })}
            placeholder="Preparación (min)"
          />

          <input
            type="number"
            {...register('cookTimeMinutes', { valueAsNumber: true })}
            placeholder="Cocción (min)"
          />

          <input
            type="number"
            {...register('servings', { valueAsNumber: true })}
            placeholder="Porciones"
          />

          <select {...register('difficulty')}>
            <option value="Easy">Fácil</option>
            <option value="Medium">Media</option>
            <option value="Hard">Difícil</option>
          </select>

          <input {...register('cuisine')} placeholder="Cocina" />
          <input
            type="number"
            {...register('caloriesPerServing', { valueAsNumber: true })}
            placeholder="Calorías"
          />

          <input {...register('image')} placeholder="URL de la imagen" />

          <button disabled={isPending}>
            {isPending ? 'Guardando...' : 'Crear receta'}
          </button>
        </form>
      </div>
    </div>
  );
}
