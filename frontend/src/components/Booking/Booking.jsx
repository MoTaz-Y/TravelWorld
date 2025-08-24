import './booking.css';
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
import {
  validateName,
  validatePhone,
  validateGuests,
  validateDate,
} from '../../utils/validator';
function Booking({ tour, avgRating }) {
  const { price, reviews, title } = tour;
  const { user } = useContext(AuthContext);
  const tourId = tour._id;
  const navigate = useNavigate();
  const [totalFee, setTotalFee] = useState(0);
  const [booking, setBooking] = useState({
    userId: user?._id, //this will be dynamic
    userEmail: user?.email,
    tourName: title,
    fullName: '',
    phone: '',
    bookAt: '',
    guestSize: '',
    totalFee: totalFee,
  });

  const [nameMsg, setNameMsg] = useState('');
  const [nameValid, setNameValid] = useState(null);

  const [phoneMsg, setPhoneMsg] = useState('');
  const [phoneValid, setPhoneValid] = useState(null);

  const [guestMsg, setGuestMsg] = useState('');
  const [guestValid, setGuestValid] = useState(null);

  const [dateMsg, setDateMsg] = useState('');
  const [dateValid, setDateValid] = useState(null);
  // const [editBooking, setEditBooking] = useState(null);
  const handleChange = (e) => {
    const { id, value } = e.target;
    setBooking((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (id === 'fullName') {
      const { valid, message } = validateName(value);
      setNameMsg(message);
      setNameValid(valid);
    }
    if (id === 'phone') {
      const { valid, message } = validatePhone(value);
      setPhoneMsg(message);
      setPhoneValid(valid);
    }
    if (id === 'guestSize') {
      const { valid, message } = validateGuests(value);
      setGuestMsg(message);
      setGuestValid(valid);
    }
    if (id === 'bookAt') {
      const { valid, message } = validateDate(value);
      setDateMsg(message);
      setDateValid(valid);
    }
  };

  // send data to server
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token || user === null || user === undefined) {
      return alert('Please login to book a tour');
    }
    if (!nameValid || !phoneValid || !guestValid || !dateValid) {
      return;
    }
    try {
      let url = `${BASE_URL}/bookings/tours/${tourId}`;
      let method = 'POST';
      // if (editBooking) {
      //   url = `${BASE_URL}/bookings/${editBooking._id}`;
      //   method = 'PATCH';
      // }
      const res = await fetch(url, {
        method: method,
        headers: {
          'content-type': 'application/json',
          // Authorization: `Bearer ${user.token}`,
        },
        credentials: 'include',
        body: JSON.stringify(booking),
      });
      const data = await res.json();
      console.log('data', data);
      if (!res.ok) return alert(data.message);
      navigate('/thank-you', { state: { type: 'thank you' } });
    } catch (err) {
      return alert(err.message);
    }
  };
  const serviceFee = 10;
  useEffect(() => {
    const totalAmount =
      Number(price) * Number(booking.guestSize) + Number(serviceFee);
    setTotalFee(totalAmount === serviceFee ? 0 : totalAmount);
  }, [booking.guestSize, price]);
  return (
    <div className='booking'>
      <div className='booking__top d-flex align-items-center justify-content-between '>
        <h3 className='tour__price'>
          ${price} <span>/person</span>
        </h3>
        <span className='tour__rating d-flex align-items-center'>
          <i class='ri-star-fill'></i> {avgRating === '' ? 0 : avgRating} (
          {reviews?.length})
        </span>
      </div>
      {/* booking form start */}
      <div className='booking__form'>
        <h5>Information</h5>
        <Form className='booking__info-form ' onSubmit={handleSubmit}>
          <FormGroup className='form__group-booking'>
            <input
              type='text'
              placeholder='Full Name'
              id='fullName'
              required
              onChange={handleChange}
            />
            {nameMsg && (
              <p style={{ color: nameValid ? 'green' : 'red' }}>{nameMsg}</p>
            )}
          </FormGroup>
          <FormGroup className='form__group-booking'>
            <input
              type='number'
              placeholder='Phone Number'
              id='phone'
              required
              onChange={handleChange}
            />
            {phoneMsg && (
              <p style={{ color: phoneValid ? 'green' : 'red' }}>{phoneMsg}</p>
            )}
          </FormGroup>
          <FormGroup className='d-flex  justify-content-between form__group-booking'>
            <div className=''>
              {' '}
              <input
                type='date'
                placeholder=''
                id='bookAt'
                required
                onChange={handleChange}
              />
              {dateMsg && (
                <p style={{ color: dateValid ? 'green' : 'red' }}>{dateMsg}</p>
              )}
            </div>
            <duv>
              <input
                type='data'
                placeholder='Guests'
                id='guestSize'
                required
                onChange={handleChange}
              />
              {guestMsg && (
                <p style={{ color: guestValid ? 'green' : 'red' }}>
                  {guestMsg}
                </p>
              )}
            </duv>
          </FormGroup>
        </Form>
      </div>
      {/* booking form end */}
      {/* booking bottom start */}
      <div className='booking_bottom'>
        <ListGroup>
          <ListGroupItem className='border-0 px-0'>
            <h5 className='d-flex align-items-center gap-1'>
              ${price} <i class='ri-close-line'></i>1 person
            </h5>
            <span>${price}</span>
          </ListGroupItem>
          <ListGroupItem className='border-0 px-0'>
            <h5>Service Fee</h5>
            <span>${serviceFee}</span>
          </ListGroupItem>
          {/* <ListGroupItem className='border-0 px-0'>
            <h5>Booking Fee</h5>
            <span>$10</span>
          </ListGroupItem> */}
          <ListGroupItem className='border-0 px-0 total'>
            <h5>Total</h5>
            <span>${totalFee === 0 ? serviceFee : totalFee}</span>
          </ListGroupItem>
        </ListGroup>
        <Button
          className='btn booking__btn w-100 mt-4'
          type='submit'
          onClick={handleSubmit}
        >
          Book Now
        </Button>
      </div>
      {/* booking bottom end */}
    </div>
  );
}

export default Booking;
