import { useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useUpdateRecipe } from "../../hooks/useUpdateRecipe";

/* ======================================================
   SCHEMA
====================================================== */
const recipeSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),

  ingredients: z
    .array(
      z.object({
        value: z.string().min(1, "El ingrediente no puede estar vacío"),
      })
    )
    .min(1),

  instructions: z
    .array(
      z.object({
        value: z.string().min(1, "El paso no puede estar vacío"),
      })
    )
    .min(1),

  tags: z.array(z.object({ value: z.string() })).optional(),
  mealType: z.array(z.object({ value: z.string() })).optional(),

  prepTimeMinutes: z.number().min(1),
  cookTimeMinutes: z.number().min(1),
  servings: z.number().min(1),

  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  cuisine: z.string().optional(),

  caloriesPerServing: z.number().min(1),

  image: z.string().url("Debe ser una URL válida").or(z.literal("")),
});

export type RecipeFormData = z.infer<typeof recipeSchema>;

interface EditRecipeFormProps {
  id: number;
  initialData: {
    name: string;
    ingredients: string[];
    instructions: string[];
    tags?: string[];
    mealType?: string[];
    prepTimeMinutes: number;
    cookTimeMinutes: number;
    servings: number;
    difficulty: "Easy" | "Medium" | "Hard";
    cuisine?: string;
    caloriesPerServing: number;
    image?: string;
  };
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
  getValues,
  reset,
  formState: { errors },
} = useForm<RecipeFormData>({
  resolver: zodResolver(recipeSchema),
  shouldUnregister: false, 
  defaultValues: {
    name: "",
    ingredients: [],
    instructions: [],
    tags: [],
    mealType: [],
    prepTimeMinutes: 1,
    cookTimeMinutes: 1,
    servings: 1,
    difficulty: "Easy",
    cuisine: "",
    caloriesPerServing: 1,
    image: "",
  },
});

  const ingredients = useFieldArray({ control, name: "ingredients" });
  const instructions = useFieldArray({ control, name: "instructions" });

  /* ======================================================
     LOAD INITIAL DATA
  ====================================================== */
  useEffect(() => {
  if (!initialData) return;

  reset({
    name: initialData.name,

    ingredients: initialData.ingredients.map(i => ({
      value: i,
    })),

    instructions: initialData.instructions.map(i => ({
      value: i,
    })),

    tags: initialData.tags?.map(t => ({ value: t })) ?? [],
    mealType: initialData.mealType?.map(m => ({ value: m })) ?? [],

    prepTimeMinutes: initialData.prepTimeMinutes,
    cookTimeMinutes: initialData.cookTimeMinutes,
    servings: initialData.servings,
    difficulty: initialData.difficulty,
    cuisine: initialData.cuisine ?? "",
    caloriesPerServing: initialData.caloriesPerServing,
    image: initialData.image ?? "",
  });
}, [initialData, reset]);

  /* ======================================================
     HELPERS
  ====================================================== */
  const addIngredient = () => {
    const last = getValues("ingredients").at(-1);
    if (!last?.value.trim()) {
      toast.warning("Completa el ingrediente antes de agregar otro");
      return;
    }
    ingredients.append({ value: "" });
  };

  const addInstruction = () => {
    const last = getValues("instructions").at(-1);
    if (!last?.value.trim()) {
      toast.warning("Completa el paso antes de agregar otro");
      return;
    }
    instructions.append({ value: "" });
  };

  function onSubmit(data: RecipeFormData) {
    if (data.ingredients.some(i => !i.value.trim())) {
      toast.warning("Hay ingredientes vacíos");
      return;
    }

    if (data.instructions.some(i => !i.value.trim())) {
      toast.warning("Hay pasos vacíos");
      return;
    }

    const payload = {
      name: data.name,
      ingredients: data.ingredients.map(i => i.value),
      instructions: data.instructions.map(i => i.value),
      tags: data.tags?.map(t => t.value) ?? [],
      mealType: data.mealType?.map(m => m.value) ?? [],
      prepTimeMinutes: data.prepTimeMinutes,
      cookTimeMinutes: data.cookTimeMinutes,
      servings: data.servings,
      difficulty: data.difficulty,
      cuisine: data.cuisine ?? "",
      caloriesPerServing: data.caloriesPerServing,
      image: data.image,
    };

    mutate(
      { id, body: payload },
      {
        onSuccess: () => {
          toast.success("Receta actualizada con éxito");
          onClose();
        },
        onError: () => {
          toast.error("No se pudo actualizar la receta");
        },
      }
    );
  }

  /* ======================================================
     UI — MODAL
  ====================================================== */
  return (
    <div
      className="fixed inset-0 z-[2000] bg-black/40 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen flex justify-center px-4 py-16">
        <div
          className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <header className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Editar Receta
              </h2>
              <p className="text-gray-500 text-sm">
                Modificá los datos de la receta
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-700 text-xl"
            >
              ✕
            </button>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* NOMBRE */}
            <div>
              <label className="block mb-1 text-sm font-semibold">
                Nombre de la receta
              </label>
              <input
                {...register("name")}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* INGREDIENTES */}
            <section className="bg-gray-50 rounded-xl p-5 mt-6">
              <h2 className="text-xl font-semibold mb-4">Ingredientes</h2>

              {ingredients.fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <input
                    {...register(`ingredients.${index}.value`)}
                    placeholder={`Ingrediente ${index + 1}`}
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => ingredients.remove(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addIngredient}
                className="mt-3 px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: "#FF9F68" }}
              >
                Agregar ingrediente
              </button>
            </section>

            {/* INSTRUCCIONES */}
            <section className="bg-gray-50 rounded-xl p-5 mt-6">
              <h2 className="text-xl font-semibold mb-4">Preparación</h2>

              {instructions.fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 mb-2">
                  <input
                    {...register(`instructions.${index}.value`)}
                    placeholder={`Paso ${index + 1}`}
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => instructions.remove(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addInstruction}
                className="mt-3 px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: "#FF9F68" }}
              >
                Agregar paso
              </button>
            </section>

             {/* DATOS NUMERICOS */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm">Prep (min)</label>
              <input
                type="number"
                {...register("prepTimeMinutes", { valueAsNumber: true })}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="text-sm">Cocción (min)</label>
              <input
                type="number"
                {...register("cookTimeMinutes", { valueAsNumber: true })}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="text-sm">Porciones</label>
              <input
                type="number"
                {...register("servings", { valueAsNumber: true })}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>
          </div>

          {/* SELECT */}
          <div>
            <label className="text-sm">Dificultad</label>
            <select
              {...register("difficulty")}
              className="border rounded-lg px-3 py-2 w-full"
            >
              <option value="Easy">Fácil</option>
              <option value="Medium">Media</option>
              <option value="Hard">Difícil</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Tipo de cocina</label>
            <input
              {...register("cuisine")}
              placeholder="Tipo de cocina"
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-sm">Calorías por porción</label>
            <input
              type="number"
              {...register("caloriesPerServing", { valueAsNumber: true })}
              placeholder="Calorías por porción"
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="text-sm">Imagen</label>
            <input
              {...register("image")}
              placeholder="URL de imagen"
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>

          <button
            disabled={isPending}
            className="w-full text-white py-3 rounded-lg transition shadow"
            style={{ backgroundColor: "#FF9F68" }}
          >
            {isPending ? "Guardando..." : "Editar Receta"}
          </button>
        </form>
        </div>
      </div>
    </div>
  );
}
