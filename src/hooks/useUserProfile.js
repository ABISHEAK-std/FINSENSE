import { useState, useEffect } from 'react';

const STORAGE_KEY = 'user_profile';

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setProfile(saved ? JSON.parse(saved) : null);
    } catch (error) {
      console.error('Failed to load profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async (data) => {
    try {
      const updatedProfile = {
        ...profile,
        ...data,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      return true;
    } catch (error) {
      console.error('Failed to save profile:', error);
      return false;
    }
  };

  return {
    profile,
    isLoading,
    saveProfile,
    loadProfile
  };
};
