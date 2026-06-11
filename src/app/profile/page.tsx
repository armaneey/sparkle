'use client';

import { useState, useEffect } from 'react';
import { updateProfile, sendPasswordResetEmail, sendEmailVerification, deleteUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, LogOut, Save, Mail, Calendar, Shield, Upload, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useForm } from '@mantine/form';
import { TextInput } from '@mantine/core';

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const form = useForm({
    initialValues: {
      displayName: '',
    },
    validate: {
      displayName: (value) => (value.length >= 2 ? null : 'Display name must be at least 2 characters'),
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
      form.setFieldValue('displayName', user.displayName);
    }
  }, [user]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getProviderBadge = () => {
    if (!auth.currentUser?.providerData.length) return null;
    
    const provider = auth.currentUser.providerData[0].providerId;
    
    if (provider === 'google.com') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google Account
        </span>
      );
    }
    
    if (provider === 'github.com') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-medium">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
          </svg>
          GitHub Account
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
        <Mail size={16} />
        Email & Password
      </span>
    );
  };

  const isEmailPasswordUser = auth.currentUser?.providerData.some(
    (provider) => provider.providerId === 'password'
  );

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const validate = form.validate();
    if (validate.hasErrors) {
      return;
    }

    setUpdateLoading(true);
    setSuccessMessage('');

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: form.values.displayName });
        setSuccessMessage('Profile updated successfully!');
        
        const updatedUser = {
          uid: user!.uid,
          email: user!.email,
          displayName: form.values.displayName,
          photoURL: user!.photoURL,
        };
        sessionStorage.setItem('userSession', JSON.stringify(updatedUser));
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      setSuccessMessage('');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handlePasswordReset = async () => {
    if (!auth.currentUser?.email) return;
    
    setResetLoading(true);
    setResetMessage('');
    
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      setResetMessage('Reset link sent to your email!');
    } catch (err: any) {
      console.error('Password reset error:', err);
      setResetMessage('Failed to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleAvatarChange = (file: File | null) => {
    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const maxSize = 3 * 1024 * 1024; // 3MB

    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPEG, or WebP image.');
      return;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 3MB.');
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setAvatarLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', avatarFile);

      const response = await fetch('/api/avatar/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: form.values.displayName,
          photoURL: data.url,
        });

        const updatedUser = {
          uid: user!.uid,
          email: user!.email,
          displayName: form.values.displayName,
          photoURL: data.url,
        };
        sessionStorage.setItem('userSession', JSON.stringify(updatedUser));

        setSuccessMessage('Profile updated successfully!');
        setAvatarFile(null);
        setAvatarPreview('');

        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleEmailVerification = async () => {
    if (!auth.currentUser) return;

    setVerifyLoading(true);

    try {
      await sendEmailVerification(auth.currentUser);
      alert('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      console.error('Email verification error:', err);
      alert('Failed to send verification email. Please try again.');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;

    setDeleteLoading(true);

    try {
      await deleteUser(auth.currentUser);
      sessionStorage.removeItem('userSession');
      router.push('/login');
    } catch (err: any) {
      console.error('Delete account error:', err);
      alert('Failed to delete account. Please try again.');
      setDeleteConfirm(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                {user.displayName || 'Welcome!'}
              </h1>
              <p className="text-white/90 mb-3">{user.email}</p>
              {getProviderBadge()}
            </div>
          </div>

          <div className="p-8 space-y-8">
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}
            
            {resetMessage && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                {resetMessage}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <TextInput
                label="Display Name"
                placeholder=""
                {...form.getInputProps('displayName')}
                styles={{
                  input: {
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    color: '#000',
                    '&:focus': {
                      borderColor: '#3b82f6',
                      outline: 'none',
                      ring: '2px solid #3b82f6',
                    },
                  },
                  label: {
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '0.5rem',
                  },
                }}
              />

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Avatar
                </label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center overflow-hidden">
                      {avatarPreview || user.photoURL ? (
                        <img 
                          src={avatarPreview || user.photoURL || undefined} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(e) => handleAvatarChange(e.target.files?.[0] || null)}
                        className="hidden"
                        id="avatar-upload" />
                      <label
                        htmlFor="avatar-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors" >
                        <Upload size={16} />
                        Choose File
                      </label>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPEG, WebP (max 3MB)</p>
                    </div>
                  </div>
                  {avatarFile && (
                    <button
                      type="button"
                      onClick={handleAvatarUpload}
                      disabled={avatarLoading}
                      className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"  >
                      {avatarLoading ? 'Uploading...' : 'Upload Avatar'}
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={updateLoading || avatarLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                <Save size={20} />
                {updateLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-blue-600" />
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Email Verified</span>
                  {auth.currentUser?.emailVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      <CheckCircle size={16} />
                      Verified
                    </span>
                  ) : (
                    <button
                      onClick={handleEmailVerification}
                      disabled={verifyLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" >
                      {verifyLoading ? 'Sending...' : 'Verify Now'}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar size={16} />
                    Last Sign In
                  </span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(auth.currentUser?.metadata.lastSignInTime)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={20} className="text-blue-600" />
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">User ID</span>
                  <span className="text-gray-900 font-mono text-sm bg-white px-3 py-1 rounded">{user.uid}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900">{user.email}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar size={16} />
                    Account Created
                  </span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(auth.currentUser?.metadata.creationTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar size={16} />
                    Last Sign In
                  </span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(auth.currentUser?.metadata.lastSignInTime)}
                  </span>
                </div>
              </div>
            </div>

            {isEmailPasswordUser && (
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Shield size={20} className="text-purple-600" />
                  Security
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Want to change your password? We'll send you a secure link to reset it.
                </p>
                <button
                  onClick={handlePasswordReset}
                  disabled={resetLoading}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" >
                  {resetLoading ? 'Sending...' : 'Change Password'}
                </button>
              </div>
            )}

            <div className="border-2 border-red-200 rounded-lg p-4">
              <h3 className="text-base font-semibold text-red-900 mb-2 flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-600" />
                Danger Zone
              </h3>
              <p className="text-gray-600 text-xs mb-3">
                These actions are irreversible. Please be certain.
              </p>
              <div className="space-y-2">
                <button
                  onClick={handlePasswordReset}
                  disabled={resetLoading}
                  className="w-full flex items-center justify-center gap-2 bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm">
                  {resetLoading ? 'Sending...' : 'Send Password Reset Link'}
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeleteConfirm(!deleteConfirm)}
                    disabled={deleteLoading}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm" >
                    {deleteLoading ? 'Deleting...' : 'Delete Account'}
                  </button>
                  {deleteConfirm && (
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                      className="flex items-center justify-center gap-2 bg-red-800 text-white py-2 px-3 rounded-lg hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm">
                      <X size={14} />
                      Confirm
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all" >
                <LogOut size={20} />
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
