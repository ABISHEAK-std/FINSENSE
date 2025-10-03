import React from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const OnboardingForm = ({ 
  initialData = {}, 
  onSubmit, 
  culturalContext = 'default' 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialData
  });

  const handleFormSubmit = (data) => {
    // Normalize data structure for consistency
    const profileData = {
      fullName: data.fullName || '',
      email: data.email || '',
      phone: data.phone || '',
      dob: data.dateOfBirth || '',
      gender: data.gender || '',
      occupation: data.occupation || '',
      language: data.primaryLanguage || 'english',
      lastUpdated: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('user_profile', JSON.stringify(profileData));
    
    // Call parent onSubmit
    if (onSubmit) {
      onSubmit(profileData);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label={culturalContext === 'hindi' ? 'पूरा नाम' : 'Full Name'}
          {...register('fullName', { required: true })}
          error={errors.fullName}
        />

        <Input
          type="email"
          label={culturalContext === 'hindi' ? 'ईमेल' : 'Email'}
          {...register('email', { 
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i 
          })}
          error={errors.email}
        />

        <Input
          label={culturalContext === 'hindi' ? 'फ़ोन नंबर' : 'Phone Number'}
          {...register('phone')}
        />

        <Input
          type="date"
          label={culturalContext === 'hindi' ? 'जन्म तिथि' : 'Date of Birth'}
          {...register('dateOfBirth')}
        />

        <Select
          label={culturalContext === 'hindi' ? 'लिंग' : 'Gender'}
          {...register('gender')}
          options={[
            { value: 'Male', label: culturalContext === 'hindi' ? 'पुरुष' : 'Male' },
            { value: 'Female', label: culturalContext === 'hindi' ? 'महिला' : 'Female' },
            { value: 'Other', label: culturalContext === 'hindi' ? 'अन्य' : 'Other' }
          ]}
        />

        <Input
          label={culturalContext === 'hindi' ? 'व्यवसाय' : 'Occupation'}
          {...register('occupation')}
        />

        <Select
          label={culturalContext === 'hindi' ? 'प्राथमिक भाषा' : 'Primary Language'}
          {...register('primaryLanguage')}
          options={[
            { value: 'English', label: 'English' },
            { value: 'Hindi', label: 'हिंदी' }
          ]}
          defaultValue="English"
        />
      </div>

      <Button type="submit" className="w-full">
        {culturalContext === 'hindi' ? 'प्रोफ़ाइल सहेजें' : 'Save Profile'}
      </Button>
    </form>
  );
};

export default OnboardingForm;
