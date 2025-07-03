import { create } from 'zustand';

type ProfileDataType = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  theme: 'dark' | 'light';
  active_task: number | null;
};

type ProfileStateType = {
  data: ProfileDataType;
  updateProfile: (_profile: Partial<ProfileDataType>) => void;
  clearProfile: () => void;
};

export const useProfileStore = create<ProfileStateType>((set) => ({
  data: {
    first_name: '',
    last_name: '',
    email: '',
    theme: 'dark',
    active_task: null,
  } as ProfileDataType,
  updateProfile: (profile) => set((state) => ({
    data: {
      ...state.data,
      first_name: profile.first_name ?? state.data.first_name,
      last_name: profile.last_name ?? state.data.last_name,
      email: profile.email ?? state.data.email,
      active_task: profile.active_task !== undefined ? profile.active_task : state?.data?.active_task,
      id: profile.id ?? state?.data?.id,
      theme: profile?.theme ?? state?.data?.theme,
    },
  })),
  clearProfile: () => set(() => ({ data: {} as ProfileDataType })),
}));