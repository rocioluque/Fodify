import { useState } from "react";
import { Cards } from "../components/ui/Cards";
import { Cover } from "../components/ui/Cover";
import { EditRecipeForm } from "../components/ui/EditForm";
import { useAllRecipes } from "../hooks/useAllRecipes";
import { useUserStore } from "../store/useUserStore";
import type { Recipe } from "../types/Recipe";

function getPageNumbers(current: number, total: number) {
  const pages: (number | string)[] = [];
  const range = 2;

  const start = Math.max(2, current - range);
  const end = Math.min(total - 1, current + range);

  pages.push(1);

  if (start > 2) {
    pages.push("...");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total - 1) {
    pages.push("...");
  }

  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

export function Recipes() {
  const [open, setOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // 🔹 PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 8;

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

  // 🔹 PAGINATION LOGIC
  const totalRecipes = data.recipes.length;
  const totalPages = Math.ceil(totalRecipes / recipesPerPage);

  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const currentRecipes = data.recipes.slice(startIndex, endIndex);

  return (
    <>
      <section className="flex flex-col justify-center items-center p-10">
        <Cover title="Listado de Recetas" />

        {/* GRID */}
        <div className="flex flex-wrap justify-center gap-5 mt-20">
          {currentRecipes.map((recipe) => (
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

        {/* PAGINATION */}
        <div className="flex items-center gap-2 mt-8 flex-wrap justify-center">

          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border bg-white disabled:opacity-40"
          >
            Primera
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border bg-white disabled:opacity-40"
          >
            Anterior
          </button>

          {getPageNumbers(currentPage, totalPages).map((page, i) =>
            page === "..." ? (
              <span key={i} className="px-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page as number)}
                className={`px-3 py-2 rounded-lg border transition ${
                  page === currentPage
                    ? "bg-[#FF2E2E] text-white border-[#FF2E2E]"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border bg-white disabled:opacity-40"
          >
            Siguiente
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg border bg-white disabled:opacity-40"
          >
            Última
          </button>
        </div>

      </section>

      {/* MODAL EDIT */}
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