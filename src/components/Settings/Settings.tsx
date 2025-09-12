import { useRef } from 'react';

import { FormProvider, useForm } from 'react-hook-form';

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

const Settings = () => {
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null; }>({});

  const methods = useForm({
    defaultValues: {
      dateFormat: { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
      timeFormat: { value: '12', label: '12-hour (AM/PM)' },
      firstDayOfWeek: { value: 'sunday', label: 'Sunday' },
      workWeek: { value: '5', label: 'Monday to Friday (5 days)' },
      focusDuration: 25,
      shortBreak: 5,
      longBreak: 20,
      autoStartBreaks: true,
      longBreakAfter: { value: 4, label: '4 Sessions' },
      defaultGoalDuration: { value: 30, label: '30 minutes' },
      weeklyTargetHours: { value: 5, label: '5 hours' },
    },
  });

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
