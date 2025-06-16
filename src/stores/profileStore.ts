import { create } from 'zustand';

type ProfileStateType = {
  firstName: string;
  lastName: string;
  email: string;
  updateProfile: (_profile: { firstName?: string; lastName?: string; email?: string }) => void;
};

export const useProfileStore = create<ProfileStateType>((set) => ({
  firstName: '',
  lastName: '',
  email: '',
  updateProfile: (profile) => set((state) => ({
    firstName: profile.firstName ?? state.firstName,
    lastName: profile.lastName ?? state.lastName,
    email: profile.email ?? state.email,
  })),
}));