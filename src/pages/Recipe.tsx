import { useState } from "react";
import { Cards } from "../components/ui/Cards";
import { Cover } from "../components/ui/Cover";
import { EditRecipeForm } from "../components/ui/EditForm";
import { useAllRecipes} from "../hooks/useAllRecipes";
import { useUserStore } from "../store/useUserStore";
import type { Recipe } from "../types/Recipe";

export function Recipes() {
  const [open, setOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const { data, isPending, isError } = useAllRecipes();
  const user = useUserStore((state) => state.user);
  const isLogged = !!user;

  if (isPending) {
    return (
      <section className="h-[70vh] flex justify-center items-center">
        <Cover title="Cargando..." />
      </section>
    );
  }

  if (isError || !data) {
    return <Cover title="Error al cargar recetas" />;
  } 

  return (
    <>
      <section className="flex flex-col justify-center items-center p-10">
        <Cover title="Listado de Recetas" />

        <div className="flex flex-wrap justify-center gap-5 mt-20">
          {data?.recipes.map((recipe: any) => (
            <Cards
              key={recipe.id}
              id={recipe.id}
              href={`/recipes/${recipe.id}`}
              src={recipe.image}
              title={recipe.name}
              showBtn={isLogged}
              onEdit={
                isLogged
                  ? () => {
                      setSelectedRecipe(recipe);
                      setOpen(true);
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </section>

      {open && selectedRecipe && isLogged && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-xl w-[650px]">
            <EditRecipeForm
              id={selectedRecipe.id}
              initialData={{
                name: selectedRecipe.name,
                image: selectedRecipe.image,
                cuisine: selectedRecipe.cuisine,
                caloriesPerServing: selectedRecipe.caloriesPerServing,
                ingredients: selectedRecipe.ingredients,    
                instructions: selectedRecipe.instructions,
                tags: [],
                mealType: [],
                prepTimeMinutes: 1,
                cookTimeMinutes: 1,
                servings: 1,
                difficulty: "Easy",
              }}
              onClose={() => {
                setOpen(false);
                setSelectedRecipe(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
