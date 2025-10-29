import { useEffect, useRef } from 'react';

import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';

import { LANGUAGE_OPTIONS, TIME_ZONE_OPTIONS } from 'helpers/configs';

import { useProfileStore } from 'stores/profileStore';
import { useSettingsStore } from 'stores/settingsStore';

import { updateProfile } from 'services/profile';

import ProfileInfoCard from 'components/Profile/ProfileInfoCard';
import QuickStats from 'components/Profile/QuickStats';
import Achievements from 'components/Profile/Achievements';
import PersonalInformation from 'components/Profile/PersonalInformation';
import HelpAndSupport from 'components/Profile/HelpAndSupport';
import ProfileHeader from 'components/Profile/ProfileHeader';

type ProfileFormType = {
  first_name: string;
  last_name: string;
  email: string;
  jobTitle?: string;
  company?: string;
  timeZone?: { value: string; label: string };
  language?: { value: string; label: string };
  bio?: string;
}

const schema = z.object({
  first_name: z.string().nonempty('First Name is required!'),
  last_name: z.string().nonempty('Last Name is required!'),
  email: z.string().nonempty('Email is required!').email('Invalid email address!'),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  timeZone: z.object({ value: z.string(), label: z.string() }).optional(),
  language: z.object({ value: z.string(), label: z.string() }).optional(),
  bio: z.string().optional(),
});

const Profile = () => {
  const updateProfileInfo = useProfileStore((state) => state.updateProfile);
  const {
    first_name: firstName,
    last_name: lastName,
    email,
    ...userData
  } = useProfileStore((state) => state?.data);
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';

  const shouldResetForm = useRef(true);

  const methods = useForm<ProfileFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: firstName || '',
      last_name: lastName || '',
      email: email || '',
      jobTitle: userData.job_title || '',
      company: userData.company || '',
      timeZone: TIME_ZONE_OPTIONS.find((option) => option.value === userData.time_zone),
      language: LANGUAGE_OPTIONS.find((option) => option.value === userData.language),
      bio: userData.bio || '',
    },
  });

  const { handleSubmit, reset, formState: { isDirty } } = methods;

  const handleSaveProfile = (formData: ProfileFormType) => {
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      job_title: formData.jobTitle,
      company: formData.company,
      time_zone: formData.timeZone?.value,
      language: formData.language?.value,
      bio: formData.bio,
    };
    updateProfile(payload).then((res) => {
      updateProfileInfo({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        job_title: formData.jobTitle,
        company: formData.company,
        time_zone: formData.timeZone?.value,
        language: formData.language?.value,
        bio: formData.bio,
      });
      toast.success(res.message || 'Profile updated successfully');
    }).catch((err) => {
      toast.error(err.error || 'Failed to update profile. Please try again.');
    });
  };

  useEffect(() => {
    if (shouldResetForm.current && email && firstName && lastName) {
      reset({
        first_name: firstName || '',
        last_name: lastName || '',
        email: email || '',
        jobTitle: userData.job_title || '',
        company: userData.company || '',
        timeZone: TIME_ZONE_OPTIONS.find((option) => option.value === userData.time_zone),
        language: LANGUAGE_OPTIONS.find((option) => option.value === userData.language),
        bio: userData.bio || '',
      });
      shouldResetForm.current = false;
    }
  }, [email, firstName, lastName, reset, userData.bio, userData.company, userData.job_title, userData.language, userData.time_zone]);

  return (
    <div>
      <ProfileHeader
        onSave={handleSubmit(handleSaveProfile)}
        hasChanges={isDirty}
      />

      <div className='mt-24 max-sm:mt-38'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Profile Sidebar - Limited scroll container */}
          <div className='lg:col-span-1'>
            <div className={clsx('h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar', darkMode ? 'scrollbar-thumb-gray-600' : 'scrollbar-thumb-gray-300')}>
              <div className='space-y-6'>
                <ProfileInfoCard />
                <QuickStats />
                <Achievements />
              </div>
            </div>
          </div>

          {/* Main Profile Content - Independent scroll container */}
          <div className='lg:col-span-2'>
            <div className={clsx('h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar', darkMode ? 'scrollbar-thumb-gray-600' : 'scrollbar-thumb-gray-300')}>
              <FormProvider {...methods}>
                <div className='space-y-8 pb-8'>
                  <PersonalInformation />
                  <HelpAndSupport />
                </div>
              </FormProvider>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Profile;
