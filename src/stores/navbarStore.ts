import { create } from 'zustand';

type NavbarType = {
  showNavbar: boolean;
  setShowNavbar: (_value: boolean) => void;
  prevPath: string;
  updatePrevPath: (_path: string) => void;
};

export const useNavbarStore = create<NavbarType>()((set) => ({
  showNavbar: true,
  setShowNavbar: (value) => set({ showNavbar: value }),
  prevPath: '',
  updatePrevPath: (path) => set({ prevPath: path }),
}));