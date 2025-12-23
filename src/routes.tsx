import { createBrowserRouter, ScrollRestoration } from "react-router-dom";

import { Layouts } from "./components/layouts/Layouts";
import { Recipes } from "./pages/Recipe";
import { Users } from "./pages/Users";
import { RecipeDetails } from "./pages/RecipeDetails";
import { Form } from "./pages/Form";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";

// Protege rutas (ej: si no estás logueado → redirige a login).
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollRestoration />
        <Layouts />
      </>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/recipes",
        element: <Recipes />,
        //(
          // Si el usuario está autenticado → muestra <Home />
          // Si NO → redirige (normalmente a / o /login)
          //<ProtectedRoute>
            //<Recipes />
          //</ProtectedRoute>
        //),
      },
      {
        path: "recipes/:id",
        element: <RecipeDetails />,
      },
      {
        path: "/new-recipe",
        element: <Form />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);
