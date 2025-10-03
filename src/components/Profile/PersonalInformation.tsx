import { LANGUAGE_OPTIONS, TIME_ZONE_OPTIONS } from 'helpers/configs';

import { useProfileStore } from 'stores/profileStore';
import { useSettingsStore } from 'stores/settingsStore';

import Input from 'components/Shared/Input';
import SelectField from 'components/Shared/SelectField';
import PersonalInformationSkeleton from 'components/Profile/PersonalInformationSkeleton';

const PersonalInformation = () => {
  const darkMode = useSettingsStore((state) => state.settings.theme) === 'dark';
  const isProfileLoading = useProfileStore((state) => state.isLoading);

  if (isProfileLoading) {
    return <PersonalInformationSkeleton />;
  }

  return (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border shadow-sm`}>
      <div className='mb-6'>
        <h4 className='text-xl font-bold'>Personal Information</h4>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Input
          name='first_name'
          label='First Name'
          placeholder='Your first name'
          className='w-full'
        />

        <Input
          name='last_name'
          label='Last Name'
          placeholder='Your last name'
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
          options={TIME_ZONE_OPTIONS}
          placeholder='Select time zone'
          isMulti={false}
          className='w-full'
        />

        <SelectField
          name='language'
          label='Language'
          options={LANGUAGE_OPTIONS}
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
  );
};

export default PersonalInformation;