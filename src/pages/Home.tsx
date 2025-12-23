import Aurora from "../components/ui/Aurora";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fondo */}
      <div className="fixed inset-0 -z-10">
        <Aurora
            colorStops={["#FF5F1F", "#FF9F68", "#FF2E2E"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
        />
      </div>

      {/* Contenido */}
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-black drop-shadow-lg">
          Foodify
        </h1>

        <p className="mt-4 max-w-xl text-lg md:text-xl text-black/90">
          Descubrí recetas increíbles, conocé a los chefs y creá tus propias recetas registrándote en la plataforma.
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
            to="/new-recipe"
            className="px-6 py-3 rounded-xl bg-[#FF2E2E] text-white font-semibold border border-white/30 hover:scale-105 transition-transform"
          >
            Crea receta
          </Link>
        </div>
      </div>
    </div>
  );
}
