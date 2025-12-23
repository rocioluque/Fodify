import { Toaster } from 'sonner';
import Aurora from "../../components/ui/Aurora";
import { useUserStore } from '../../store/useUserStore';
import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import PillNav from "../../components/ui/PillNav";
import logo from "../../assets/logo_letra.png";

export function Layouts() {
  const { user, logout } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Recetas", href: "/recipes" },

    ...(user?.role === "admin"
      ? [{ label: "Usuarios", href: "/users" }]
      : []),

    ...(user
      ? [
          { label: "Nueva Receta", href: "/new-recipe" },
          {
            label: "Cerrar Sesión",
            onClick: () => {
              logout();
              navigate("/login", { replace: true });
            }
          }
        ]
      : [{ label: "Login", href: "/login" }]),
  ];

  return (
    <>
      <Toaster position="top-right" richColors />

      {/* Fondo global animado */}
      <div className="fixed inset-0 -z-10">
        <Aurora
          colorStops={["#FF5F1F", "#FF9F68", "#FF2E2E"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Header */}
      <PillNav
        logo={logo}
        logoAlt="Foodify"
        logoHref="/"
        items={navItems}
        activeHref={location.pathname}
        userName={user?.firstName}
        baseColor="#000000"
        pillColor="#ffffff"
        pillTextColor="#000000"
        hoveredPillTextColor="#ffffff"
        ease="power3.easeOut"
      />

      {/* Contenido */}
      <main className="pt-20 min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-white/10 bg-gradient-to-r from-[#FF7A18]/30 via-[#FF9F68]/30 to-[#FF2E2E]/30 backdrop-blur-md">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FF2E2E] to-transparent" />
        <div className="max-w-6xl mx-auto px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-black/80">
          
          <span className="text-sm">
            © {new Date().getFullYear()}{" "}
            <strong className="text-black">Foodify</strong>
          </span>

          <div className="flex gap-6 text-sm font-medium">
            <Link to="/recipes" className="hover:text-[#FF2E2E] transition-colors">
              Recetas
            </Link>

            {user && (
              <Link to="/new-recipe" className="hover:text-[#FF2E2E] transition-colors">
                Crear receta
              </Link>
            )}

            {!user && (
              <Link to="/login" className="hover:text-[#FF2E2E] transition-colors">
                Inicia sesión
              </Link>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}
