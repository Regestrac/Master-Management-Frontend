import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProfileStore } from 'stores/profileStore';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Input from 'components/Shared/Input';

import { logout } from 'src/services/auth';
import { updateProfile } from 'src/services/profile';

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
  const firstName = useProfileStore((state) => state?.firstName);
  const lastName = useProfileStore((state) => state?.lastName);
  const email = useProfileStore((state) => state?.email);

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
      navigate('/login');
      clearProfile();
    }).catch((err) => {
      toast.error(err?.error || 'Logout failed. Please try again.');
    });
  };

  const handleSaveProfile = (formData: ProfileFormType) => {
    updateProfile(formData).then((res) => {
      toast.success(res?.message || 'Profile Updated Successfully.');
      updateProfileInfo({
        firstName: res?.data?.first_name || '',
        lastName: res?.data?.last_name || '',
        email: res?.data?.email || '',
        userId: res?.data?.id || 0,
      });
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
    <div className='p-6 max-w-md mx-auto text-textColor rounded-lg shadow-md bg-secondary-bg border-1'>
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
  );
};

export default Profile;
