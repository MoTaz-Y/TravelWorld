import './userBookings.css';
import moment from 'moment';
import { useState } from 'react';

import { BASE_URL } from '../../utils/config';

const UserBookings = ({ bookings }) => {
  const [localBookings, setLocalBookings] = useState(bookings || []);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    guestSize: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEditClick = (booking) => {
    setEditingId(booking._id);
    setFormData({
      fullName: booking.fullName,
      phone: booking.phone,
      guestSize: booking.guestSize,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update booking
  const handleSubmit = async (id) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          phone: Number(formData.phone),
          guestSize: Number(formData.guestSize),
        }),
      });

      if (!res.ok) throw new Error('Please reload the app');

      const data = await res.json();
      setLocalBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, ...data.data.data } : b))
      );
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //  Delete booking
  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    if (!window.confirm('Are you sure you want to delete this booking?'))
      return;
    try {
      const res = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Delete failed');

      setLocalBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='user__bookings'>
      <h3>My Bookings</h3>
      {error && <p className='error'>{error}</p>}
      <div className='user__bookings-list'>
        {localBookings && localBookings.length > 0 ? (
          localBookings.map((booking) => (
            <div className='booking__item' key={booking._id}>
              <div className='booking__header'>
                <h4>{booking.tourName}</h4>
                <p>{moment(booking.bookAt).format('MMM Do YYYY')}</p>
              </div>

              {editingId === booking._id ? (
                <form
                  className='booking__form'
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(booking._id);
                  }}
                >
                  <input
                    type='text'
                    name='fullName'
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder='Full Name'
                    required
                  />
                  <input
                    type='number'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder='Phone'
                    required
                  />
                  <input
                    type='number'
                    name='guestSize'
                    value={formData.guestSize}
                    onChange={handleChange}
                    placeholder='Guests'
                    required
                  />
                  <button type='submit' disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </form>
              ) : (
                <div className='booking__body'>
                  <p>{booking.fullName}</p>
                  <p>{booking.phone}</p>
                  <p>{booking.guestSize} Guests</p>
                </div>
              )}

              <div className='booking__actions'>
                {editingId !== booking._id && (
                  <i
                    className='ri-edit-2-line booking__btn edit'
                    style={{
                      fontSize: '1.2rem',
                      color: '#0b5ed7',
                      cursor: 'pointer',
                      marginRight: '10px',
                    }}
                    onClick={() => handleEditClick(booking)}
                  ></i>
                )}

                <i
                  className='ri-delete-bin-6-line booking__btn delete'
                  style={{
                    fontSize: '1.2rem',
                    color: '#d9534f',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleDelete(booking._id)}
                ></i>
              </div>
            </div>
          ))
        ) : (
          <div className='no-bookings'>
            <i
              className='ri-calendar-2-line'
              style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }}
            ></i>
            <h4>No bookings yet</h4>
            <p>You have not submitted any bookings with us yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookings;
