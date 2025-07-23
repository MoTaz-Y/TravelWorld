import './booking.css';
import { Form, FormGroup, ListGroup, ListGroupItem, Button } from 'reactstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
function Booking({ tour, avgRating }) {
  const { price, reviews } = tour;
  const [credentials, setCredentials] = useState({
    userId: '01', //this will be dynamic
    userEmail: '',
    fullName: '',
    phone: '',
    bookAt: '',
    guestSize: '',
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  // send data to server
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/thank-you');
  };
  const serviceFee = 10;
  const totalAmount =
    Number(price) * Number(credentials.guestSize) + Number(serviceFee);
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
          <FormGroup>
            <input
              type='text'
              placeholder='Full Name'
              id='fullName'
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <input
              type='number'
              placeholder='Phone Number'
              id='phone'
              required
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup className='d-flex align-items-center justify-content-between'>
            <input
              type='date'
              placeholder=''
              id='bookAt'
              required
              onChange={handleChange}
            />
            <input
              type='data'
              placeholder='Guests'
              id='guestSize'
              required
              onChange={handleChange}
            />
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
            <span>${totalAmount === serviceFee ? 0 : totalAmount}</span>
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
