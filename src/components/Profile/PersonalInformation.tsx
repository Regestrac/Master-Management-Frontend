import { useEffect } from 'react';

import { toast } from 'react-toastify';
import { useForm, FormProvider } from 'react-hook-form';

import { useProfileStore } from 'stores/profileStore';

import Input from 'components/Shared/Input';
import SelectField from 'components/Shared/SelectField';

type FormValues = {
  fullName: string;
  email: string;
  jobTitle: string;
  company: string;
  timeZone: string;
  language: string;
  bio: string;
};

// Time zone options
const timeZoneOptions = [
  { value: 'PST', label: 'Pacific Standard Time (PST)' },
  { value: 'EST', label: 'Eastern Standard Time (EST)' },
  { value: 'GMT', label: 'Greenwich Mean Time (GMT)' },
  { value: 'CET', label: 'Central European Time (CET)' },
];

// Language options
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'zh', label: '中文' },
];

const getDefaultValues = (user: any) => ({
  fullName: user?.first_name || user?.last_name
    ? `${user.first_name || ''} ${user.last_name || ''}`
    : 'Not set',
  email: user?.email || '',
  jobTitle: 'Senior Frontend Developer',
  company: 'TechCorp Solutions',
  timeZone: 'PST',
  language: 'en',
  bio: 'Passionate frontend developer with 5+ years of experience building modern web applications. Love learning new technologies and optimizing productivity workflows.',
});

const PersonalInformation = () => {
  const user = useProfileStore((state) => state.data);
  const updateProfile = useProfileStore((state) => state.updateProfile);

  const darkMode = user?.theme === 'dark';

  const methods = useForm<FormValues>({ defaultValues: getDefaultValues(user) });

  const { handleSubmit, reset } = methods;

  const onSubmit = (data: FormValues) => {
    try {
      // Extract first and last name from fullName
      const [first_name, ...lastNameParts] = data.fullName.split(' ');
      const last_name = lastNameParts.join(' ');

      // Update the profile in the store
      updateProfile({
        first_name,
        last_name,
        email: data.email,
      });

      // Show success message
      toast.success('Profile updated successfully');
    } catch (error) {
      // Log the error for debugging
      // eslint-disable-next-line no-console
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  useEffect(() => {
    reset(getDefaultValues(user));
  }, [reset, user]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
          <div className='flex items-center justify-between mb-6'>
            <h4 className='text-xl font-bold'>Personal Information</h4>
            <button
              type='submit'
              className='px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm'
            >
              Save Changes
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Input
              name='fullName'
              label='Full Name'
              placeholder='Your full name'
              className='w-full'
            />

            <Input
              name='email'
              label='Email Address'
              type='email'
              placeholder='Your email address'
              className='w-full'
            />

            <Input
              name='jobTitle'
              label='Job Title'
              placeholder='Your job title'
              className='w-full'
            />

            <Input
              name='company'
              label='Company'
              placeholder='Your company'
              className='w-full'
            />

            <SelectField
              name='timeZone'
              label='Time Zone'
              options={timeZoneOptions}
              placeholder='Select time zone'
              isMulti={false}
              className='w-full'
            />

            <SelectField
              name='language'
              label='Language'
              options={languageOptions}
              placeholder='Select language'
              isMulti={false}
              className='w-full'
            />
          </div>

          <div className='mt-6'>
            <Input
              name='bio'
              label='Bio'
              type='textarea'
              placeholder='Tell us about yourself...'
              rows={3}
              className='w-full'
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default PersonalInformation;