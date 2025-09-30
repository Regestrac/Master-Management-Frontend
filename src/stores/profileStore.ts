import { create } from 'zustand';

type ProfileDataType = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  theme: 'dark' | 'light';
  active_task: number | null;
  avatar_url: string | null;
  job_title: string;
  company: string;
  time_zone: string;
  language: string;
  bio: string;
};

type ProfileStateType = {
  data: ProfileDataType;
  isLoading: boolean;
  updateLoading: (_value: boolean) => void;
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
    avatar_url: null,
  } as ProfileDataType,
  isLoading: false,
  updateLoading: (value) => set(() => ({ isLoading: value })),
  updateProfile: (profile) => set((state) => ({
    data: {
      ...state.data,
      first_name: profile.first_name ?? state.data.first_name,
      last_name: profile.last_name ?? state.data.last_name,
      email: profile.email ?? state.data.email,
      active_task: profile.active_task !== undefined ? profile.active_task : state?.data?.active_task,
      id: profile.id ?? state?.data?.id,
      theme: profile?.theme ?? state?.data?.theme,
      avatar_url: profile?.avatar_url ?? state?.data?.avatar_url,
      job_title: profile?.job_title ?? state?.data?.job_title,
      company: profile?.company ?? state?.data?.company,
      time_zone: profile?.time_zone ?? state?.data?.time_zone,
      language: profile?.language ?? state?.data?.language,
      bio: profile?.bio ?? state?.data?.bio,
    },
  })),
  clearProfile: () => set(() => ({ data: {} as ProfileDataType })),
}));