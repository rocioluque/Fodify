import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateRecipe } from '../../hooks/useUpdateRecipe';

const baseInput =
  "border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500";
const baseBtn =
  "px-3 py-2 rounded-lg border hover:bg-gray-100 transition text-sm";

/* ======================================================
   SCHEMA
====================================================== */
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

/* ======================================================
   TYPES
====================================================== */
export type RecipeFormData = z.infer<typeof recipeSchema>;

interface EditRecipeFormProps {
  id: number;
  initialData: RecipeFormData;
  onClose: () => void;
}

/* ======================================================
   COMPONENT
====================================================== */
export function EditRecipeForm({
  id,
  initialData,
  onClose,
}: EditRecipeFormProps) {
  const { mutate, isPending } = useUpdateRecipe();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
      defaultValues: {
      ...initialData,
      ingredients: initialData.ingredients?.map((i: any) =>
        typeof i === 'string' ? { value: i } : i
      ) ?? [],

      instructions: initialData.instructions?.map((i: any) =>
        typeof i === 'string' ? { value: i } : i
      ) ?? [],

      tags: initialData.tags?.map((t: any) =>
        typeof t === 'string' ? { value: t } : t
      ) ?? [],

      mealType: initialData.mealType?.map((m: any) =>
        typeof m === 'string' ? { value: m } : m
      ) ?? [],
    },
  });

  /* ===================== FIELD ARRAYS ===================== */
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

  /* ===================== SUBMIT ===================== */
  function onSubmit(data: RecipeFormData) {
  const payload = {
    ...data,
    ingredients: data.ingredients.map(i => i.value),
    instructions: data.instructions.map(i => i.value),
    tags: data.tags.map(t => t.value),
    mealType: data.mealType.map(m => m.value),
  };

  mutate({ id, body: payload });
};

  /* ===================== UI ===================== */
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <input {...register('name')} placeholder="Nombre" />
      {errors.name && <p>{errors.name.message}</p>}

      {/* INGREDIENTES */}
      <section className="space-y-3">
      <h3 className="font-semibold text-lg">Ingredientes</h3>

      {ingredients.fields.map((field, i) => (
        <div key={field.id} className="flex gap-2 items-center">
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-blue-500"
            {...register(`ingredients.${i}.value`)}
            placeholder={`Ingrediente ${i + 1}`}
          />

          <button
            type="button"
            className="text-red-500 font-bold text-lg"
            onClick={() => ingredients.remove(i)}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        className="text-blue-600 hover:underline"
        onClick={() => ingredients.append({ value: '' })}
      >
        + Agregar ingrediente
      </button>
    </section>


      {/* INSTRUCCIONES */}
      <section>
        <h3>Instrucciones</h3>

        {instructions.fields.map((field, i) => (
          <div key={field.id}>
            <textarea
              {...register(`instructions.${i}.value`)}
              placeholder={`Paso ${i + 1}`}
            />

            <button
              type="button"
              onClick={() => instructions.remove(i)}
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => instructions.append({ value: "" })}
        >
          + Paso
        </button>
      </section>

      {/* TAGS */}
      <section>
        <h3>Tags</h3>

        {tags.fields.map((field, i) => (
          <div key={field.id} className="flex gap-2">
            <input {...register(`tags.${i}.value`)} />

            <button
              type="button"
              onClick={() => tags.remove(i)}
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => tags.append({ value: '' })}
        >
          + Tag
        </button>
      </section>

      {/* MEAL TYPE */}
      <section>
        <h3>Meal Type</h3>

        {mealType.fields.map((field, i) => (
          <div key={field.id} className="flex gap-2">
            <input {...register(`mealType.${i}.value`)} />

            <button
              type="button"
              onClick={() => mealType.remove(i)}
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => mealType.append({ value: '' })}
        >
          + Meal Type
        </button>
      </section>


      {/* TIEMPOS */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          {...register('prepTimeMinutes', { valueAsNumber: true })}
          placeholder="Prep (min)"
        />
        <input
          type="number"
          {...register('cookTimeMinutes', { valueAsNumber: true })}
          placeholder="Cocción (min)"
        />
      </div>

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

      <input {...register('image')} placeholder="URL imagen" />

      <button disabled={isPending}>
        {isPending ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
}