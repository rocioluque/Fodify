import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2 } from "lucide-react";
import { useDeleteRecipes } from '../../hooks/useDeleteRecipes';

interface CardsProps {
  id: number;
  title: string;
  description?: string;
  src?: string;
  href: string;
  showBtn: boolean;
  onEdit?: () => void;
}

export function Cards({
  id,
  src,
  title,
  description,
  href,
  showBtn = true,
  onEdit,
}: CardsProps) {
  const { mutate, isPending } = useDeleteRecipes();

  function handleDelete(id: number) {
    mutate(id, {
      onSuccess: () => toast.success("Receta eliminada"),
      onError: () => toast.error("Ocurrió un error al borrar la receta"),
    });
  }

  return (
    <div className="group relative w-72 rounded-3xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300">
      
      {/* Imagen */}
      <div className="h-44 w-full bg-gray-100 overflow-hidden">
        {src ? (
          <img
            src={src}
            alt={title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-lg line-clamp-2 text-gray-900">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-gray-500 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Acciones */}
      <div className="px-4 pb-4 flex gap-2">
        <Link
          to={href}
          className="flex-1 text-center rounded-full bg-black text-white py-2 text-sm font-medium hover:bg-gray-800 transition"
        >
          Ver receta
        </Link>

        {showBtn && (
          <>
            {onEdit && (
              <button
                onClick={onEdit}
                className="rounded-full px-3 py-2 text-sm bg-yellow-400 hover:bg-yellow-500 transition"
              >
                Editar
              </button>
            )}

            <button
              onClick={() => handleDelete(id)}
              disabled={isPending}
              aria-label="Eliminar receta"
              className="flex items-center justify-center rounded-full w-10 h-10 bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
            >
              {isPending ? (
                "..."
              ) : (
                <Trash2 size={18} strokeWidth={2} />
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};