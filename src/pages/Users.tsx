import { useState } from "react";
import { Cover } from "../components/ui/Cover";
import { useAllUsers } from "../hooks/useAllUsers";
import type { User } from "../hooks/useAllUsers";

export function Users() {
  const { data, isPending } = useAllUsers();

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  if (isPending) {
    return (
      <section className="h-[70vh] flex justify-center items-center">
        <Cover title="Cargando..." />
      </section>
    );
  }

  const totalUsers = data?.users.length || 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = data?.users.slice(startIndex, endIndex);

  return (
    <section className="flex flex-col items-center p-10 min-h-screen">
      <Cover title="Listado de Usuarios" />

      {/* GRID DE USUARIOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 w-full max-w-7xl">
        {currentUsers?.map((user: User) => (
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
      <div className="flex items-center gap-3 mt-8">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl border bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Anterior
        </button>

        <span className="px-4 py-2 font-semibold">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl border bg-white shadow-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}
