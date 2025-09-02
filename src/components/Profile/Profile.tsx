import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useProfileStore } from 'stores/profileStore';

import { logout } from 'services/auth';

import Input from 'components/Shared/Input';
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
  const [isEditing, setIsEditing] = useState(false);

  const updateProfileInfo = useProfileStore((state) => state.updateProfile);
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const firstName = useProfileStore((state) => state?.data?.first_name);
  const lastName = useProfileStore((state) => state?.data?.last_name);
  const email = useProfileStore((state) => state?.data?.email);

  const shouldResetForm = useRef(true);

  const navigate = useNavigate();

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

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleLogout = () => {
    logout().then((res) => {
      toast.success(res?.message || 'Logout successful! See you soon!');
      navigate('/auth/login');
      clearProfile();
    }).catch((err) => {
      toast.error(err?.error || 'Logout failed. Please try again.');
    });
  };

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
      setIsEditing(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
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
    <>
      <div>
        <ProfileHeader
          onSave={handleSubmit(handleSaveProfile)}
          hasChanges={isDirty}
        />

        {/* Main Content with top margin to account for fixed header */}
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

      {/* Old UI - For Reference */}
      <div className='p-6 mt-8 max-w-md mx-auto text-textColor rounded-lg shadow-md bg-secondary-bg border-1'>
        <h1 className='text-2xl font-bold mb-6'>Profile</h1>
        <FormProvider {...methods}>
          <div className='mb-6'>
            {/* Profile Picture */}
            <div className='flex justify-center mb-4'>
              <img
                src='https://media.istockphoto.com/id/1301212030/photo/portrait-of-young-woman-stock-photo.jpg?b=1&s=612x612&w=0&k=20&c=T7sSKZTj_RKkMtBfwPXCR_teGe2sJ5o4O_3-6sHFXQQ='
                alt='Profile'
                className='w-40 h-40 rounded-full border-2 border-gray-600 object-cover'
              />
            </div>
            {/* Basic Details */}
            {isEditing ? (
              <>
                <div className='flex gap-2 items-start'>
                  <Input name='first_name' label='First Name' />
                  <Input name='last_name' label='Last Name' />
                </div>
                <Input name='email' label='Email' />
              </>
            ) : (
              <>
                <p className='mb-2'>
                  <strong>Name:</strong>
                  {` ${firstName || 'User'} ${lastName}`}
                </p>
                <p className='mb-2'>
                  <strong>Email:&nbsp;</strong>
                  {email}
                </p>
                {/* Max Streak */}
                <p className='mb-2'>
                  <strong>Max Streak:</strong>
                  {' '}
                  15 days
                </p>
                <p className='mb-2'>
                  <strong>Tasks Completed:</strong>
                  {' '}
                  10
                </p>
              </>
            )}
            {/* Friends List */}
            {/* <div className='mt-4'>
          <strong>Friends:</strong>
          <ul className='list-disc list-inside mt-2'>
            <li>Jane Smith</li>
            <li>Bob Johnson</li>
            <li>Alice Brown</li>
          </ul>
        </div> */}
          </div>
          {/* Buttons */}
          {isEditing ? (
            <div className='w-full flex justify-center'>
              <button
                onClick={handleSubmit(handleSaveProfile)}
                className='mr-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded flex-1/2'
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className='px-4 py-2 bg-primary-bg border-2 border-blue-500 hover:bg-blue-600 text-white font-semibold rounded flex-1/2'
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className='w-full flex justify-center'>
              <button
                onClick={handleEditProfile}
                className='mr-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded flex-1/2'
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className='px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded flex-1/2'
              >
                Logout
              </button>
            </div>
          )}
        </FormProvider>
      </div>
    </>
  );
};

export default Profile;
