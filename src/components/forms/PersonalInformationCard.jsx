import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import Card from '../ui/Card';

const PersonalInformationCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showToast, setShowToast] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setProfileData(profile);
        // Set form default values
        reset({
          fullName: profile.fullName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          dob: profile.dob || '',
          gender: profile.gender || '',
          occupation: profile.occupation || '',
          language: profile.language || 'English'
        });
      } catch (error) {
        console.error('Error parsing profile data:', error);
      }
    }
  }, [reset]);

  // Handle form submission
  const handleFormSubmit = (data) => {
    const updatedProfile = {
      fullName: data.fullName || '',
      email: data.email || '',
      phone: data.phone || '',
      dob: data.dob || '',
      gender: data.gender || '',
      occupation: data.occupation || '',
      language: data.language || 'English',
      lastUpdated: new Date().toISOString()
    };

    // Save to localStorage
    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
    
    // Update state
    setProfileData(updatedProfile);
    setIsEditing(false);
    
    // Show success toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle edit button click
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle cancel button click
  const handleCancel = () => {
    setIsEditing(false);
    // Reset form to original values
    if (profileData) {
      reset({
        fullName: profileData.fullName || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        dob: profileData.dob || '',
        gender: profileData.gender || '',
        occupation: profileData.occupation || '',
        language: profileData.language || 'English'
      });
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    try {
      return new Date(dateString).toLocaleDateString('en-IN');
    } catch {
      return 'Invalid date';
    }
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!profileData) return 0;
    const fields = ['fullName', 'email', 'phone', 'dob', 'gender', 'occupation', 'language'];
    const completed = fields.filter(field => profileData[field] && profileData[field].trim()).length;
    return Math.round((completed / fields.length) * 100);
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
          <span>✅</span>
          <span>Profile updated successfully</span>
        </div>
      )}

      <Card className="shadow-lg">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
              <p className="text-sm text-gray-600">
                {calculateCompletion()}% Complete • Basic details and language preferences
              </p>
            </div>
            {!isEditing && (
              <Button 
                variant="outline" 
                onClick={handleEdit}
                className="flex items-center space-x-2"
              >
                <span>✏️</span>
                <span>Edit Information</span>
              </Button>
            )}
          </div>

          {isEditing ? (
            // Edit Form
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  {...register('fullName', { required: 'Full name is required' })}
                  error={errors.fullName}
                />

                <Input
                  type="email"
                  label="Email Address"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  error={errors.email}
                />

                <Input
                  label="Phone Number"
                  {...register('phone', { required: 'Phone number is required' })}
                  error={errors.phone}
                />

                <Input
                  type="date"
                  label="Date of Birth"
                  {...register('dob', { required: 'Date of birth is required' })}
                  error={errors.dob}
                />

                <Select
                  label="Gender"
                  {...register('gender', { required: 'Please select gender' })}
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' }
                  ]}
                  error={errors.gender}
                />

                <Input
                  label="Occupation"
                  {...register('occupation')}
                />

                <Select
                  label="Primary Language"
                  {...register('language')}
                  options={[
                    { value: 'English', label: 'English' },
                    { value: 'Hindi', label: 'Hindi' },
                    { value: 'Tamil', label: 'Tamil' },
                    { value: 'Telugu', label: 'Telugu' },
                    { value: 'Bengali', label: 'Bengali' }
                  ]}
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <Button type="submit" className="flex-1">
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            // Display View
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400">👤</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-gray-900">{profileData?.fullName || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400">📧</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900">{profileData?.email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400">📱</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{profileData?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400">📅</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                    <p className="text-gray-900">{formatDate(profileData?.dob)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400">⚧</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="text-gray-900">{profileData?.gender || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400">💼</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Occupation</p>
                    <p className="text-gray-900">{profileData?.occupation || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400">🌐</span>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Primary Language</p>
                    <p className="text-gray-900">{profileData?.language || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default PersonalInformationCard;
