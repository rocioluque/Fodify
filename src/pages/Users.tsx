import { useState } from "react";
import { Cover } from "../components/ui/Cover";
import { useAllUsers } from "../hooks/useAllUsers";
import type { User } from "../hooks/useAllUsers";

export function Users() {
  const { data, isPending } = useAllUsers();

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  if (isPending) {
    return (
      <section className="h-[70vh] flex justify-center items-center">
        <Cover title="Cargando..." />
      </section>
    );
  }

  // Paginación
  const totalUsers = data?.users.length || 0;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = data?.users.slice(startIndex, endIndex);

  return (
    <section className="flex flex-col justify-center items-center p-10 bg-gray-50 min-h-screen">
      
      <Cover title="Listado de Usuarios" />
      <div className="flex flex-wrap gap-6 mt-10 w-full max-w-6xl justify-center">
        {currentUsers?.map((user: User) => (
          <div
            key={user.id}
            className="w-80 border rounded-2xl p-5 bg-white shadow-md flex flex-col gap-3 hover:shadow-lg transition-shadow"
          >
            {/* Imagen + Nombre */}
            <div className="flex items-center gap-3">
              <img
                src={user.image}
                alt={user.firstName}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </div>

            {/* Rol */}
            <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {user.role.toUpperCase()}
            </span>

            {/* Contacto */}
            <div className="mt-2 text-sm text-gray-700">
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Teléfono:</strong> {user.phone}
              </p>
            </div>

            {/* Dirección */}
            <div className="mt-2 text-sm text-gray-700">
              <p className="font-semibold">Dirección</p>
              <p>{user.address.address}</p>
              <p>
                {user.address.city}, {user.address.stateCode} {user.address.postalCode}
              </p>
            </div>

            {/* Coordenadas */}
            <div className="mt-2 text-xs text-gray-400">
              Lat: {user.address.coordinates.lat} — Long: {user.address.coordinates.lng}
            </div>
          </div>
        ))}
      </div>

      {/* Controles de paginación */}
      <div className="flex gap-2 mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </section>
  );
}