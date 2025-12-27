import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useCreateRecipe } from "../hooks/useCreateRecipe";
import { useUserStore } from "../store/useUserStore";
import type { RecipeCreatePayload } from "../types/RecipeCreatePayload";
import { useNavigate } from "react-router-dom";

const recipeSchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres"),

  ingredients: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, "El ingrediente no puede estar vacío"),
      })
    )
    .min(1, "Debe haber al menos 1 ingrediente"),

  instructions: z
    .array(
      z.object({
        value: z
          .string()
          .min(1, "El paso no puede estar vacío"),
      })
    )
    .min(1, "Debe haber al menos 1 paso"),

  tags: z.array(z.object({ value: z.string() })).optional(),

  mealType: z.array(z.object({ value: z.string() })).optional(),

  prepTimeMinutes: z
    .number()
    .min(1, "Debe ser mayor a 0"),

  cookTimeMinutes: z
    .number()
    .min(1, "Debe ser mayor a 0"),

  servings: z
    .number()
    .min(1, "Debe ser mayor a 0"),

  difficulty: z.enum(["Easy", "Medium", "Hard"]),

  cuisine: z.string().optional(),

  caloriesPerServing: z
    .number()
    .min(1, "Debe ser mayor a 0"),

  image: z
    .string()
    .url("Debe ser una URL válida")
    .or(z.literal("")) // permite vacío
});

export type RecipeFormData = z.infer<typeof recipeSchema>;

export function Form() {
  const { mutate, isPending } = useCreateRecipe();
  const user = useUserStore((s) => s.user);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      ingredients: [{ value: "" }],
      instructions: [{ value: "" }],
      tags: [],
      mealType: [],
      prepTimeMinutes: 10,
      cookTimeMinutes: 10,
      servings: 1,
      difficulty: "Easy",
      cuisine: "",
      caloriesPerServing: 100,
      image: "",
    },
  });

  const ingredients = useFieldArray({ control, name: "ingredients" });
  const instructions = useFieldArray({ control, name: "instructions" });

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
      toast.warning("Hay ingredientes vacíos, complétalos o elimínalos");
      return;
    }

    if (data.instructions.some(i => !i.value.trim())) {
      toast.warning("Hay pasos vacíos, complétalos o elimínalos");
      return;
    }

    const payload: RecipeCreatePayload = {
      name: data.name,
      ingredients: data.ingredients.map(i => i.value),
      instructions: data.instructions.map(i => i.value),
      tags: (data.tags ?? []).map(t => t.value),
      mealType: (data.mealType ?? []).map(m => m.value),
      prepTimeMinutes: data.prepTimeMinutes,
      cookTimeMinutes: data.cookTimeMinutes,
      servings: data.servings,
      difficulty: data.difficulty,
      cuisine: data.cuisine ?? "",
      caloriesPerServing: data.caloriesPerServing,
      image: data.image,
    };

    mutate(payload, {
      onSuccess: () => {
        toast.success("Receta creada con éxito ");

        // pequeño delay para que el toast se vea
        setTimeout(() => {
          navigate("/recipes");
        }, 700);
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
          "No se pudo crear la receta. Intenta nuevamente."
        );
      },
    });
}

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        {/* HEADER */}
        <header className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Nueva Receta</h2>
          <p className="text-gray-500">
            Usuario:{" "}
            <span className="font-semibold">
              {user?.firstName} {user?.lastName}
            </span>
          </p>
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
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
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
                  className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={() => ingredients.remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
                {errors.ingredients?.[index]?.value && (
                  <p className="text-red-500 text-sm">
                    {errors.ingredients[index].value?.message}
                  </p>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredient}
              className="mt-3 px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: "#FF9F68"}}
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
                  className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                />
                <button
                  type="button"
                  onClick={() => instructions.remove(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
                {errors.instructions?.[index]?.value && (
                  <p className="text-red-500 text-sm">
                    {errors.instructions[index].value?.message}
                  </p>
                )}
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
            {isPending ? "Guardando..." : "Crear Receta"}
          </button>
        </form>
      </div>
    </div>
  );
}