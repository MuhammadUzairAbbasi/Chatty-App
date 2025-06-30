import { create } from "zustand";

interface ThemeStore {
  theme: any;
  setTheme: (theme: any) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: localStorage.getItem("chat-theme") || "cupcake",
  setTheme: (theme: any) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));
