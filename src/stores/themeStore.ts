import { create } from 'zustand';

type ThemeType = {
  theme: 'light' | 'dark';
  updateTheme: (_theme: ThemeType['theme']) => void;
};

export const useThemeStore = create<ThemeType>()((set) => ({
  theme: 'dark',
  updateTheme: (theme) => set({ theme }),
}));