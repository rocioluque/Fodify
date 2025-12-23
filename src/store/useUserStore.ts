import { create } from "zustand";

export type User = {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  role: "admin" | "user";
};

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  set({ user: null });
},
}));