import { useParams } from "react-router-dom";
import { Cover } from "../components/ui/Cover";
import { useRecipeDetails } from "../hooks/useRecipeDetails";

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium shadow">
      {children}
    </span>
  );
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4 text-center shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

export function RecipeDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending } = useRecipeDetails(Number(id));

  if (isPending) {
    return (
      <section className="h-[70vh] flex justify-center items-center">
        <Cover title="Cargando receta..." />
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Título */}
      <Cover title={data.name} />

      {/* Card principal */}
      <div className="mt-12 bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-10 p-8 lg:p-12">
          
          {/* Imagen */}
          <div className="relative">
            <img
              src={data.image}
              alt={data.name}
              className="w-full h-full max-h-[420px] object-cover rounded-2xl shadow-md"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge>{data.cuisine}</Badge>
              <Badge>{data.difficulty}</Badge>
            </div>
          </div>

          {/* Información */}
          <div className="flex flex-col gap-8">
            
            {/* Datos rápidos */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <InfoItem label="Porciones" value={data.servings} />
              <InfoItem label="Calorías" value={`${data.caloriesPerServing} kcal`} />
              <InfoItem label="Prep." value={`${data.prepTimeMinutes} min`} />
              <InfoItem label="Cocción" value={`${data.cookTimeMinutes} min`} />
            </div>

            {/* Ingredientes */}
            <section>
              <h3 className="text-xl font-semibold mb-3">Ingredientes</h3>
              <ul className="space-y-2 text-gray-700">
                {data.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#FF9F68]" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Instrucciones */}
            <section>
              <h3 className="text-xl font-semibold mb-3">Preparación</h3>
              <ol className="space-y-3 text-gray-700">
                {data.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF9F68] text-white text-sm font-semibold">
                      {i + 1}
                    </span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};