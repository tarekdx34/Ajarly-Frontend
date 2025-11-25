// src/hooks/useProfile.ts
import { useState, useEffect } from 'react';
import api, { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../../api';
import { toast } from 'sonner';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getProfile();
      setProfile(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      setLoading(true);
      const updated = await api.updateProfile(data);
      setProfile(updated);
      toast.success('Profile updated successfully!');
      return updated;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setLoading(true);
      const response = await api.uploadAvatar(file);
      
      // Update profile with new photo
      if (profile) {
        setProfile({
          ...profile,
          profilePhoto: response.profilePhoto
        });
      }
      
      toast.success('Profile photo updated successfully!');
      return response.profilePhoto;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to upload avatar';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      setLoading(true);
      await api.changePassword(data);
      toast.success('Password changed successfully!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to change password';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const requestPhoneVerification = async () => {
    try {
      const response = await api.requestPhoneVerification();
      toast.success('Verification code sent!');
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send verification code';
      toast.error(errorMessage);
      throw err;
    }
  };

  const confirmPhoneVerification = async (code: string) => {
    try {
      await api.confirmPhoneVerification(code);
      toast.success('Phone verified successfully!');
      await fetchProfile(); // Refresh profile
    } catch (err: any) {
      const errorMessage = err.message || 'Invalid verification code';
      toast.error(errorMessage);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    uploadAvatar,
    changePassword,
    requestPhoneVerification,
    confirmPhoneVerification
  };
}