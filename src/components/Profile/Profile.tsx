import { useEffect, useRef } from 'react';

import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useProfileStore } from 'stores/profileStore';

import ProfileInfoCard from 'components/Profile/ProfileInfoCard';
import QuickStats from 'components/Profile/QuickStats';
import Achievements from 'components/Profile/Achievements';
import PersonalInformation from 'components/Profile/PersonalInformation';
import PrivacyAndSecurity from 'components/Profile/PrivacyAndSecurity';
import Integrations from 'components/Profile/Integrations';
import HelpAndSupport from 'components/Profile/HelpAndSupport';
import ProfileHeader from 'components/Profile/ProfileHeader';

type ProfileFormType = {
  first_name: string;
  last_name: string;
  email: string;
  jobTitle?: string;
  company?: string;
  timeZone?: string;
  language?: string;
  bio?: string;
  analyticsUsageData?: boolean;
  marketingCommunications?: boolean;
  thirdPartyIntegrations?: boolean;
}

const schema = z.object({
  first_name: z.string().nonempty('First Name is required!'),
  last_name: z.string().nonempty('Last Name is required!'),
  email: z.string().nonempty('Email is required!').email('Invalid email address!'),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  timeZone: z.string().optional(),
  language: z.string().optional(),
  bio: z.string().optional(),
  analyticsUsageData: z.boolean().optional(),
  marketingCommunications: z.boolean().optional(),
  thirdPartyIntegrations: z.boolean().optional(),
});

const Profile = () => {
  const updateProfileInfo = useProfileStore((state) => state.updateProfile);
  const firstName = useProfileStore((state) => state?.data?.first_name);
  const lastName = useProfileStore((state) => state?.data?.last_name);
  const email = useProfileStore((state) => state?.data?.email);

  const shouldResetForm = useRef(true);

  const methods = useForm<ProfileFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: firstName || '',
      last_name: lastName || '',
      email: email || '',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      timeZone: 'PST',
      language: 'en',
      bio: 'Passionate frontend developer with 5+ years of experience building modern web applications. Love learning new technologies and optimizing productivity workflows.',
      analyticsUsageData: false,
      marketingCommunications: false,
      thirdPartyIntegrations: false,
    },
  });

  const { handleSubmit, reset, formState: { isDirty } } = methods;

  const handleSaveProfile = (formData: ProfileFormType) => {
    try {
      // Update the profile in the store with basic info
      updateProfileInfo({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
      });

      // Show success message
      toast.success('Profile updated successfully');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  useEffect(() => {
    if (shouldResetForm.current && email && firstName && lastName) {
      reset({
        first_name: firstName || '',
        last_name: lastName || '',
        email: email || '',
      });
      shouldResetForm.current = false;
    }
  }, [email, firstName, lastName, reset]);

  return (
    <div>
      <ProfileHeader
        onSave={handleSubmit(handleSaveProfile)}
        hasChanges={isDirty}
      />

      <div className='mt-24 px-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Profile Sidebar - Limited scroll container */}
          <div className='lg:col-span-1'>
            <div className='h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent no-scrollbar'>
              <div className='space-y-6'>
                <ProfileInfoCard />
                <QuickStats />
                <Achievements />
              </div>
            </div>
          </div>

          {/* Main Profile Content - Independent scroll container */}
          <div className='lg:col-span-2'>
            <div className='h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent no-scrollbar'>
              <FormProvider {...methods}>
                <div className='space-y-8 pb-8'>
                  <PersonalInformation />
                  <PrivacyAndSecurity />
                  <Integrations />
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
