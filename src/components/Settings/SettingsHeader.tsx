import clsx from 'clsx';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Menu, X } from 'lucide-react';

import { useNavbarStore } from 'stores/navbarStore';
import { useSettingsStore } from 'stores/settingsStore';

import { resetUserSettings, updateUserSettings } from 'services/settings';

const SettingsHeader = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const setShowNavbar = useNavbarStore((state) => state.setShowNavbar);
  const showNavbar = useNavbarStore((state) => state.showNavbar);

  const { getValues, reset } = useFormContext();

  const handleSidebarToggle = () => {
    setShowNavbar(!showNavbar);
  };

  const handleSaveChanges = () => {
    const allValues = getValues();
    const payload = {
      date_format: allValues?.dateFormat?.value,
      time_format: allValues?.timeFormat?.value,
      first_day_of_week: allValues?.firstDayOfWeek?.value,
      work_week: allValues?.workWeek?.value,
      focus_duration: allValues?.focusDuration,
      short_break: allValues?.shortBreak,
      long_break: allValues?.longBreak,
      auto_break: allValues?.autoStartBreaks,
      long_break_after: allValues?.longBreakAfter?.value,
      goal_duration: allValues?.defaultGoalDuration?.value,
      weekly_target_hours: allValues?.weeklyTargetHours?.value,
      task_reminder: allValues?.taskReminder,
      goal_progress: allValues?.goalProgress,
      session_breaks: allValues?.sessionBreaks,
      daily_summary: allValues?.dailySummary,
      milestone: allValues?.milestone,
      new_feature: allValues?.newFeature,
      cloud_sync: allValues?.cloudSync,
      keep_completed_for: allValues?.taskRetention?.value,
      analytic_data_retention: allValues?.analyticsRetention?.value,
      auto_delete_old_data: allValues?.autoDeleteOldData,
      debug_mode: allValues?.debugMode,
      beta_features: allValues?.betaFeatures,
      telemetry: allValues?.analyticsTelemetry,
      ai_assistant: allValues?.aiTaskAssistant,
      advanced_analytics: allValues?.advancedAnalytics,
      team_collaboration: allValues?.teamCollaboration,
    };
    updateUserSettings(payload).then((res) => {
      toast.success(res.message || 'Settings updated successfully');
    }).catch((err) => {
      toast.error(err?.error || 'Failed to update settings');
    });
  };

  const handleResetDefaults = () => {
    resetUserSettings().then((res) => {
      toast.success(res?.message || 'Settings reset to defaults');
      // return getUserSettings();
    }).then(() => {
      const defaultValues = {
        focusDuration: 25,
        shortBreak: 5,
        longBreak: 20,
        autoStartBreaks: true,
        dateFormat: { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
        timeFormat: { value: '12', label: '12-hour (AM/PM)' },
        firstDayOfWeek: { value: 'sunday', label: 'Sunday' },
        workWeek: { value: '5', label: 'Monday to Friday (5 days)' },
        longBreakAfter: { value: 4, label: '4 Sessions' },
        defaultGoalDuration: { value: 30, label: '30 minutes' },
        weeklyTargetHours: { value: 5, label: '5 hours' },
      };
      reset(defaultValues);
    }).catch((err) => {
      toast.error(err?.error || 'Failed to reset settings');
    });
  };

  return (
    <div
      className={clsx(
        'fixed top-0 sm:left-70 right-0 z-50 border-b px-6 py-4',
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200',
      )}
    >
      <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
        <div className='w-full md:w-auto flex items-center justify-between'>
          <div>
            <h3 className='text-2xl font-bold mb-2'>Settings & Configuration</h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Customize your Master Management experience and manage system settings
            </p>
          </div>
          {/* Hamburger icon visible on small screens */}
          <button
            className={`sm:hidden ml-2 p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            onClick={handleSidebarToggle}
            aria-label='Open sidebar'
          >
            {showNavbar ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
          </button>
        </div>
        <div className='flex items-center gap-4'>
          <button onClick={handleResetDefaults} className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' />
            </svg>
            <span className='whitespace-nowrap'>Reset to Defaults</span>
          </button>
          <button onClick={handleSaveChanges} className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            <span className='whitespace-nowrap'>Save All Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;