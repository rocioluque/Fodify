import { useState } from "react";
import { Cover } from "../components/ui/Cover";
import { useAllUsers } from "../hooks/useAllUsers";
import type { User } from "../types/Users";

/* ============================
   PAGINATION HELPER
============================ */
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

export function Users() {
  const { data, isPending } = useAllUsers();

  // 🔹 PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  if (isPending) {
    return (
      <section className="h-[70vh] flex justify-center items-center">
        <Cover title="Cargando..." />
      </section>
    );
  }

  if (!data) {
    return <Cover title="Error al cargar usuarios" />;
  }

  // 🔹 PAGINATION LOGIC
  const totalUsers = data.users.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = data.users.slice(startIndex, endIndex);

  return (
    <section className="flex flex-col items-center p-10 min-h-screen">
      <Cover title="Listado de Usuarios" />

      {/* GRID DE USUARIOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 w-full max-w-7xl">
        {currentUsers.map((user: User) => (
          <div
            key={user.id}
            className="p-6 rounded-2xl bg-white/80 backdrop-blur-xl shadow-lg border border-gray-200 transition-all hover:shadow-2xl hover:-translate-y-1"
          >
            {/* HEADER */}
            <div className="flex items-center gap-4">
              <img
                src={user.image}
                alt={user.firstName}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 shadow-sm"
              />

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-500 text-sm">@{user.username}</p>
              </div>
            </div>

            {/* ROLE */}
            <span className="mt-3 inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-200/60 text-blue-900 w-fit">
              {user.role.toUpperCase()}
            </span>

            {/* CONTACTO */}
            <div className="mt-3 text-sm text-gray-700">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {user.phone}
              </p>
            </div>

            {/* DIRECCIÓN */}
            <div className="mt-3 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">Dirección</p>
              <p>{user.address.address}</p>
              <p>
                {user.address.city}, {user.address.stateCode}{" "}
                {user.address.postalCode}
              </p>
            </div>

            {/* COORDS */}
            <div className="mt-3 text-xs text-gray-500">
              Lat: {user.address.coordinates.lat} — Long:{" "}
              {user.address.coordinates.lng}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex items-center gap-2 mt-10 flex-wrap justify-center">
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

        {getPageNumbers(currentPage, totalPages).map((page, i) => {
          if (typeof page !== "number") {
            return (
              <span key={i} className="px-2 text-gray-500">
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg border transition ${
                page === currentPage
                  ? "bg-[#FF2E2E] text-white border-[#FF2E2E]"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          );
        })}

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
  );
}
