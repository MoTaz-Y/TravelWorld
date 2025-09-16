import './settings.css';
import { useState } from 'react';
import { BASE_URL } from '../../utils/config';

const Settings = ({ user }) => {
  const [formData, setFormData] = useState({
    userName: user?.userName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  console.log('user from settings', user);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update user profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    console.log('formData from settings', formData);
    try {
      const res = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
      console.log('res', res);
      if (!res.ok) throw new Error('Update failed, please try again.');

      const data = await res.json();
      console.log('Response data:', data); // للتأكد من شكل البيانات

      if (data.data && data.data.userName) {
        // تحديث النموذج بالبيانات المباشرة من الاستجابة
        setFormData({
          userName: data.data.userName,
          email: data.data.email,
          phone: data.data.phone || '',
        });
        setSuccess('Profile updated successfully');
        setEditing(false);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      setError(err.message);
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete user profile
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account?'))
      return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${BASE_URL}/users/${user._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Delete failed.');
      setSuccess('Account deleted successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='user__settings'>
      <h3>Profile Settings</h3>

      {!editing ? (
        <div className='settings__view'>
          <p>
            <strong>Name:</strong> {formData.userName}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Phone:</strong> {formData.phone}
          </p>

          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form className='settings__form' onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input
              name='userName'
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className='settings__actions'>
            <button
              type='submit'
              onClick={handleSubmit}
              className='save-btn'
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>

            <button
              type='button'
              className='delete-btn'
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Account'}
            </button>

            <button
              type='button'
              className='cancel-btn'
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {error && <p className='settings__error'>{error}</p>}
      {success && <p className='settings__success'>{success}</p>}
    </div>
  );
};

export default Settings;
