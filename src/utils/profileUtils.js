export const PROFILE_STORAGE_KEY = 'user_profile';

// Load profile from localStorage
export const loadProfile = () => {
  try {
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    return savedProfile ? JSON.parse(savedProfile) : null;
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
};

// Save profile to localStorage
export const saveProfile = (profileData) => {
  try {
    const updatedProfile = {
      ...profileData,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
    return updatedProfile;
  } catch (error) {
    console.error('Error saving profile:', error);
    throw error;
  }
};

// Clear profile from localStorage
export const clearProfile = () => {
  try {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing profile:', error);
  }
};

// Normalize profile data structure
export const normalizeProfileData = (data) => {
  return {
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
    dob: data.dob || data.dateOfBirth || '',
    gender: data.gender || '',
    occupation: data.occupation || '',
    language: data.language || data.primaryLanguage || 'English'
  };
};

// Calculate profile completion percentage
export const calculateCompletion = (profile) => {
  if (!profile) return 0;
  const fields = ['fullName', 'email', 'phone', 'dob', 'gender', 'occupation', 'language'];
  const completed = fields.filter(field => profile[field] && profile[field].trim()).length;
  return Math.round((completed / fields.length) * 100);
};
