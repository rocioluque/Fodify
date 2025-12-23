import { useParams } from "react-router-dom";

import { Cover } from "../components/ui/Cover";
import { useRecipeDetails } from "../hooks/useRecipeDetails";

export function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useRecipeDetails(Number(id));

  if (isPending) {
    return (
      <section className="h-[70vh] flex justify-center items-center">
        <Cover title="Cargando..." />
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="flex flex-col max-w-7xl m-auto p-10">
      <Cover title={data.name} />

      <section className="flex gap-7 mt-14">
        <img src={data.image} alt={data.name} className="w-96 rounded-xl" />

        <div className="flex flex-col gap-4">
          <p>
            <strong>Cocina:</strong> {data.cuisine}
          </p>
          <p>
            <strong>Dificultad:</strong> {data.difficulty}
          </p>
          <p>
            <strong>Porciones:</strong> {data.servings}
          </p>
          <p>
            <strong>Calorías:</strong> {data.caloriesPerServing}
          </p>

          <div>
            <h3 className="font-semibold mt-4">Ingredientes</h3>
            <ul className="list-disc ml-5">
              {data.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mt-4">Instrucciones</h3>
            <ol className="list-decimal ml-5">
              {data.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </section>
  );
}
