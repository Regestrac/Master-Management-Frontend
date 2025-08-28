import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useProfileStore } from 'stores/profileStore';

import { logout } from 'services/auth';
import { updateProfile } from 'services/profile';

import Input from 'components/Shared/Input';

import ProfileInfoCard from './ProfileInfoCard';
import QuickStats from './QuickStats';
import Achievements from './Achievements';
import PersonalInformation from './PersonalInformation';
import PrivacyAndSecurity from './PrivacyAndSecurity';
import Integrations from './Integrations';
import HelpAndSupport from './HelpAndSupport';

type ProfileFormType = {
  first_name: string;
  last_name: string;
  email: string;
}

const schema = z.object({
  first_name: z.string().nonempty('First Name is required!'),
  last_name: z.string().nonempty('Last Name is required!'),
  email: z.string().nonempty('Email is required!').email('Invalid email address!'),
});

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const updateProfileInfo = useProfileStore((state) => state.updateProfile);
  const clearProfile = useProfileStore((state) => state.clearProfile);
  const firstName = useProfileStore((state) => state?.data?.first_name);
  const lastName = useProfileStore((state) => state?.data?.last_name);
  const email = useProfileStore((state) => state?.data?.email);
  const darkMode = useProfileStore((state) => state?.data?.theme) === 'dark';

  const shouldResetForm = useRef(true);

  const navigate = useNavigate();

  const methods = useForm<ProfileFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: firstName || '',
      last_name: lastName || '',
      email: email || '',
    },
  });

  const { handleSubmit, reset } = methods;

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
    updateProfile(formData).then((res) => {
      toast.success(res?.message || 'Profile Updated Successfully.');
      updateProfileInfo(res?.data);
      setIsEditing(false);
    }).catch((err) => {
      toast.error(err?.error || 'Failed to update profile!');
    });
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
        {/* Profile Header */}
        <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8'>
          <div>
            <h3 className='text-2xl font-bold mb-2'>Profile & Settings</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your account, preferences, and productivity settings
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <button className='flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12' />
              </svg>
              <span>Export Data</span>
            </button>
            <button className='flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
              </svg>
              <span>Backup</span>
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Profile Sidebar */}
          <div className='lg:col-span-1 space-y-6'>
            <ProfileInfoCard />

            <QuickStats />

            <Achievements />
          </div>

          {/* Main Profile Content */}
          <div className='lg:col-span-2 space-y-8'>
            <PersonalInformation />

            <PrivacyAndSecurity />

            <Integrations />

            <HelpAndSupport />
          </div>
        </div>
      </div>

      {/* Old UI */}
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
