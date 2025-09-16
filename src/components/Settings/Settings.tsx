import { useEffect, useRef } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import {
  DATE_FORMAT_OPTIONS,
  FIRST_DAY_OPTIONS,
  TIME_FORMAT_OPTIONS,
  WORK_WEEK_OPTIONS,
  GOAL_DURATION_OPTIONS,
  LONG_BREAK_SESSIONS_OPTIONS,
  WEEKLY_TARGET_OPTIONS,
} from 'helpers/configs';
import { colorPalettes, setPrimaryPalette } from 'helpers/themeHelpers';

import { useSettingsStore } from 'stores/settingsStore';

import { getUserSettings } from 'services/settings';

import GeneralSettings from 'components/Settings/GeneralSettings';
import AppearanceSettings from 'components/Settings/AppearanceSettings';
import ProductivitySettings from 'components/Settings/ProductivitySettings';
import DataAndStorageSettings from 'components/Settings/DataAndStorageSettings';
import AdvancedSettings from 'components/Settings/AdvancedSettings';
import AboutSection from 'components/Settings/AboutSection';
import NotificationSettings from 'components/Settings/NotificationSettings';
import PrivacyAndSecurity from 'components/Settings/PrivacyAndSecurity';
import Integrations from 'components/Settings/Integrations';
import SettingsHeader from 'components/Settings/SettingsHeader';
import SettingsNavbar from 'components/Settings/SettingsNavbar';

const getDefaultValues = (settings?: Record<string, string | number | boolean>) => ({
  focusDuration: 25,
  shortBreak: 5,
  longBreak: 20,
  autoStartBreaks: true,
  dateFormat: DATE_FORMAT_OPTIONS.find((option) => option.value === settings?.date_format) || { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
  timeFormat: TIME_FORMAT_OPTIONS.find((option) => option.value === settings?.time_format) || { value: '12', label: '12-hour (AM/PM)' },
  firstDayOfWeek: FIRST_DAY_OPTIONS.find((option) => option.value === settings?.first_day_of_week) || { value: 'sunday', label: 'Sunday' },
  workWeek: WORK_WEEK_OPTIONS.find((option) => option.value === settings?.work_week) || { value: '5', label: 'Monday to Friday (5 days)' },
  longBreakAfter: LONG_BREAK_SESSIONS_OPTIONS.find((option) => option.value === settings?.long_break_after) || { value: 4, label: '4 Sessions' },
  defaultGoalDuration: GOAL_DURATION_OPTIONS.find((option) => option.value === settings?.default_goal_duration) || { value: 30, label: '30 minutes' },
  weeklyTargetHours: WEEKLY_TARGET_OPTIONS.find((option) => option.value === settings?.weekly_target_hours) || { value: 5, label: '5 hours' },
});

const Settings = () => {
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null; }>({});
  const shouldFetchSettingsRef = useRef(true);

  const methods = useForm({
    defaultValues: getDefaultValues(),
  });

  const { reset } = methods;

  useEffect(() => {
    if (shouldFetchSettingsRef.current) {
      getUserSettings().then((res) => {
        reset(getDefaultValues(res?.settings));
        const palette = colorPalettes[res?.settings?.accent_color];
        if (palette) {
          setPrimaryPalette(palette);
        }
        updateSettings(res?.settings);
      }).catch((err) => {
        toast.error(err?.error || 'Failed to fetch settings');
      });
      shouldFetchSettingsRef.current = false;
    }
  }, [reset, updateSettings]);

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el;
  };

  return (
    <div>
      <FormProvider {...methods}>
        <SettingsHeader />

        <div className='mt-24 max-sm:mt-38'>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <SettingsNavbar sectionRefs={sectionRefs} />

            <div className='lg:col-span-3 space-y-8'>
              <div ref={setSectionRef('general')}>
                <GeneralSettings />
              </div>

              <div ref={setSectionRef('appearance')}>
                <AppearanceSettings />
              </div>

              <div ref={setSectionRef('productivity')}>
                <ProductivitySettings />
              </div>

              <div ref={setSectionRef('notifications')}>
                <NotificationSettings />
              </div>

              <div ref={setSectionRef('data')}>
                <DataAndStorageSettings />
              </div>

              <div ref={setSectionRef('privacy')}>
                <PrivacyAndSecurity />
              </div>

              <div ref={setSectionRef('integrations')}>
                <Integrations />
              </div>

              <div ref={setSectionRef('advanced')}>
                <AdvancedSettings />
              </div>

              <div ref={setSectionRef('about')}>
                <AboutSection />
              </div>
            </div>
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default Settings;
