import { create } from 'zustand';

type ProfileStateType = {
  firstName: string;
  lastName: string;
  email: string;
  userId: number;
  updateProfile: (_profile: { firstName?: string; lastName?: string; email?: string; userId: number; }) => void;
  clearProfile: () => void;
};

export const useProfileStore = create<ProfileStateType>((set) => ({
  firstName: '',
  lastName: '',
  email: '',
  userId: 0,
  updateProfile: (profile) => set((state) => ({
    firstName: profile.firstName ?? state.firstName,
    lastName: profile.lastName ?? state.lastName,
    email: profile.email ?? state.email,
    userId: profile.userId ?? state.userId,
  })),
  clearProfile: () => set(() => ({
    firstName: '',
    lastName: '',
    email: '',
    userId: 0,
  })),
}));