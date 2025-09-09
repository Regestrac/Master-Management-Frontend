import { useProfileStore } from 'stores/profileStore';

import Input from 'components/Shared/Input';
import SelectField from 'components/Shared/SelectField';

// Time zone options
const timeZoneOptions = [
  { value: 'pst', label: 'Pacific Standard Time (PST)' },
  { value: 'est', label: 'Eastern Standard Time (EST)' },
  { value: 'gmt', label: 'Greenwich Mean Time (GMT)' },
  { value: 'cet', label: 'Central European Time (CET)' },
  { value: 'ist', label: 'Indian Standard Time (IST)' },
  { value: 'jst', label: 'Japan Standard Time (JST)' },
  { value: 'cst', label: 'Central Standard Time (CST)' },
];

// Language options
const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'zh', label: '中文' },
  { value: 'ar', label: 'العربية' },
  { value: 'ja', label: '日本語' },
];

const PersonalInformation = () => {
  const user = useProfileStore((state) => state.data);
  const darkMode = user?.theme === 'dark';

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
  );
};

export default PersonalInformation;