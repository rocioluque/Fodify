import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "../store/useUserStore";
import type { User } from "../store/useUserStore";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email o usuario obligatorio"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function isEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export function Login() {
  const setUser = useUserStore(state => state.setUser);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

async function onSubmit(data: LoginFormData) {
  setLoading(true);

  try {
    let username = data.identifier;

    // 👉 Si escribió un email, buscamos el username
    if (isEmail(data.identifier)) {
      const resUser = await fetch(
        `https://dummyjson.com/users/filter?key=email&value=${data.identifier}`
      );

      const result = await resUser.json();

      if (!result.users?.length) {
        throw new Error("Usuario no encontrado");
      }

      username = result.users[0].username;
    }

    // 1️⃣ Login
    const loginRes = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password: data.password,
      }),
    });

    const loginUser = await loginRes.json();

    // 2️⃣ Traer usuario completo (CON ROLE)
    const userRes = await fetch(
      `https://dummyjson.com/users/${loginUser.id}`
    );
    const fullUser = await userRes.json();

    // 3️⃣ Guardar en Zustand
    setUser({
      id: fullUser.id,
      firstName: fullUser.firstName,
      lastName: fullUser.lastName,
      email: fullUser.email,
      role: fullUser.role, 
    });

    window.location.href = "/recipes";
  } catch (error) {
    alert("Email/usuario o contraseña incorrectos");
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">

        {/* Header */}
        <div className="p-6 text-center border-b border-white/20">
          <h2 className="text-3xl font-bold text-black">
            Bienvenido a <span className="text-[#FF2E2E]">Foodify</span>
          </h2>
          <p className="mt-2 text-sm text-black/70">
            Iniciá sesión para crear y compartir recetas
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-5"
        >
          {/* Email */}
          <div>
            <input
              type="text"
              placeholder="Email o Usuario"
              {...register("identifier")}
              className={`w-full rounded-xl px-4 py-3 bg-white/70 text-black placeholder-black/50
                border focus:outline-none focus:ring-2
                ${
                  errors.identifier
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/40 focus:ring-[#FF2E2E]"
                }`}
            />
            {errors.identifier && (
              <p className="text-sm text-red-600 mt-1">
                {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              {...register("password")}
              className={`w-full rounded-xl px-4 py-3 bg-white/70 text-black placeholder-black/50
                border focus:outline-none focus:ring-2
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/40 focus:ring-[#FF2E2E]"
                }`}
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white
              bg-[#FF2E2E] hover:bg-[#e02626] transition
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center text-sm text-black/70">
          ¿No tenés cuenta?{" "}
          <span className="text-[#FF2E2E] font-medium cursor-pointer hover:underline">
            Registrate
          </span>
        </div>
      </div>
    </div>
  );
}
