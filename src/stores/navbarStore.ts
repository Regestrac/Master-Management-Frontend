import { create } from 'zustand';

type NavbarType = {
  showNavbar: boolean;
  setShowNavbar: (_value: boolean) => void;
};

export const useNavbarStore = create<NavbarType>()((set) => ({
  showNavbar: true,
  setShowNavbar: (value) => set({ showNavbar: value }),
}));