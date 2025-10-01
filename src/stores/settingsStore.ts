import { create } from 'zustand';
import { toast } from 'react-toastify';

import { getUserSettings, updateUserSettings, resetUserSettings } from 'services/settings';

export type UserSettingsType = {
  accent_color: string;
  auto_break: boolean;
  date_format: string;
  first_day_of_week: string;
  focus_duration: number;
  goal_duration: number;
  id: number;
  long_break: number;
  long_break_after: number;
  short_break: number;
  theme: 'light' | 'dark';
  time_format: string;
  user_id: number;
  weekly_target_hours: number;
  work_week: string;
};

type SettingsStoreType = {
  // State
  settings: UserSettingsType;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;

  // Actions
  initializeSettings: () => Promise<void>;
  updateSettings: (_settings: Partial<UserSettingsType>) => void;
  saveSettings: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
  setError: (_error: string | null) => void;
  clearUnsavedChanges: () => void;
};

// Default settings
const defaultSettings: UserSettingsType = {
  accent_color: 'Purple',
  auto_break: true,
  date_format: 'MM/DD/YYYY',
  first_day_of_week: 'sunday',
  focus_duration: 25,
  goal_duration: 30,
  id: 0,
  long_break: 20,
  long_break_after: 4,
  short_break: 5,
  theme: 'light',
  time_format: '12',
  user_id: 0,
  weekly_target_hours: 5,
  work_week: '5',
};

export const useSettingsStore = create<SettingsStoreType>()((set, get) => ({
  // Initial state
  settings: defaultSettings,
  isLoading: false,
  error: null,
  hasUnsavedChanges: false,

  // Initialize settings from server
  initializeSettings: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await getUserSettings();
      const serverSettings = response?.settings || {};

      set({
        settings: {
          ...defaultSettings,
          ...serverSettings,
        },
        isLoading: false,
        hasUnsavedChanges: false,
      });
    } catch (error: any) {
      set({
        error: error?.error || 'Failed to load settings',
        isLoading: false,
      });
      toast.error('Failed to load settings');
    }
  },

  // Update settings
  updateSettings: (newSettings: Partial<UserSettingsType>) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings,
      },
      hasUnsavedChanges: true,
    }));
  },

  // Save settings to server
  saveSettings: async () => {
    const { settings } = get();
    set({ isLoading: true, error: null });

    try {
      // Send settings directly as they match the API format
      const response = await updateUserSettings(settings);

      set({
        isLoading: false,
        hasUnsavedChanges: false,
      });

      toast.success(response?.message || 'Settings saved successfully');
    } catch (error: any) {
      set({
        error: error?.error || 'Failed to save settings',
        isLoading: false,
      });
      toast.error('Failed to save settings');
    }
  },

  // Reset settings to defaults
  resetToDefaults: async () => {
    set({ isLoading: true, error: null });

    try {
      await resetUserSettings();
      set({
        settings: defaultSettings,
        isLoading: false,
        hasUnsavedChanges: false,
      });
      toast.success('Settings reset to defaults');
    } catch (error: any) {
      set({
        error: error?.error || 'Failed to reset settings',
        isLoading: false,
      });
      toast.error('Failed to reset settings');
    }
  },

  // Set error state
  setError: (_error: string | null) => {
    set({ error: _error });
  },

  // Clear unsaved changes flag
  clearUnsavedChanges: () => {
    set({ hasUnsavedChanges: false });
  },
}));