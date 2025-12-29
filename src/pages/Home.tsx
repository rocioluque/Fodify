import Aurora from "../components/ui/Aurora";
import { Link } from "react-router-dom";
import { useAllRecipes } from "../hooks/useAllRecipes";
import { useAllUsers } from "../hooks/useAllUsers";
import { useUserStore } from "../store/useUserStore";

export function Home() {
  const { data: recipesData } = useAllRecipes();
  const { data: usersData } = useAllUsers();
  const user = useUserStore((state) => state.user);

  const totalRecipes = recipesData?.total ?? 0;
  const totalUsers = usersData?.total ?? usersData?.users.length ?? 0;

  return (
    <div className="relative w-full overflow-hidden">
      {/* Fondo */}
      <div className="fixed inset-0 -z-10">
        <Aurora
          colorStops={["#FF5F1F", "#FF9F68", "#FF2E2E"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-black drop-shadow-lg">
          Foodify
        </h1>

        <p className="mt-4 max-w-xl text-lg md:text-xl text-black/90">
          Descubrí recetas increíbles, conocé a los chefs y creá tus propias
          recetas registrándote en la plataforma.
        </p>

        {/* Acciones */}
        <div className="mt-8 flex gap-4">
          <Link
            to="/recipes"
            className="px-6 py-3 rounded-xl bg-[#FF5F1F] text-white font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Ver recetas
          </Link>

          <Link
            to={user ? "/new-recipe" : "/login"}
            className="px-6 py-3 rounded-xl bg-[#FF2E2E] text-white font-semibold border border-white/30 hover:scale-105 transition-transform"
          >
            Crear receta
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="pt-8 pb-20 px-6 ">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              title: "Recetas curadas",
              text: "Explorá recetas probadas por chefs y usuarios reales.",
            },
            {
              title: "Comunidad activa",
              text: "Conectate con amantes de la cocina y compartí ideas.",
            },
            {
              title: "Creá y editá",
              text: "Publicá tus recetas y mejoralas cuando quieras.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-8 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          <div>
            <p className="text-4xl font-bold text-[#FF2E2E]">
              {totalRecipes}
            </p>
            <p className="text-gray-800 font-medium">Recetas</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-[#FF2E2E]">
              {totalUsers}
            </p>
            <p className="text-gray-800 font-medium">Usuarios</p>
          </div>

          <div>
            <p className="text-4xl font-bold text-[#FF2E2E]">100%</p>
            <p className="text-gray-800 font-medium">Gratuito</p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6 bg-black/80 text-center mb-0">
        <h2 className="text-4xl font-bold text-white">
          ¿Listo para cocinar algo increíble?
        </h2>

        <p className="mt-4 text-white/80 max-w-xl mx-auto">
          Sumate a Foodify y empezá a compartir tus mejores recetas hoy mismo.
        </p>

        <Link
          to={user ? "/new-recipe" : "/login"}
          className="inline-block mt-8 px-8 py-4 rounded-xl bg-[#FF2E2E] text-white font-semibold shadow-xl hover:scale-105 transition-transform"
        >
          Empezar ahora
        </Link>
      </section>
    </div>
  );
}
