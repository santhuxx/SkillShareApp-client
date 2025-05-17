import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [bio, setBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:8080/user-info', { withCredentials: true })
      .then((response) => {
        setUser(response.data);
        setBio(response.data.bio || '');
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data.');
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    try {
      await axios.patch(
        'http://localhost:8080/user-info',
        { bio },
        { withCredentials: true }
      );
      window.location.href = '/'; // Redirect to profile page
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {user ? (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Name</label>
              <p className="text-gray-600">{user.name}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Email</label>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div>
              <label htmlFor="bio" className="block text-gray-700 font-semibold mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                rows="4"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex-1 bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium ${
                  isSaving ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <a
                href="/"
                className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium text-center"
              >
                Cancel
              </a>
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-600">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default EditProfile;