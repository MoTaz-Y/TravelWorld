import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, ListGroup } from 'reactstrap';
import tours from '../assets/data/tours';
import '../styles/tour-details.css';
import calculateAvgRating from '../utils/avgRating';
import avatar from '../assets/images/avatar.jpg';
import { useState, useRef } from 'react';
import Booking from '../components/Booking/Booking';
import NewsLetter from '../Shared/NewsLetter.jsx';

const TourDetails = () => {
  const [tourRating, setTourRating] = useState(0);
  const reviewMsgRef = useRef('');
  const { id } = useParams();
  const tour = tours.find((tour) => tour.id === id);
  const {
    photo,
    title,
    desc,
    price,
    address,
    reviews,
    city,
    distance,
    maxGroupSize,
  } = tour;
  const { avgRating, totalRating } = calculateAvgRating(reviews);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  // submit request to the server
  const submitHandler = (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;
    // later we will get from API
    // if (reviewText.trim() === '') return;
    // const newReview = {
    //   id: Math.random(),
    //   name: 'MoTaz',
    //   review: reviewText,
    //   rating: tourRating,
    //   date: new Date().toDateString('en-US', options),
    // };
    // console.log(newReview);
    console.log(reviewText, tourRating);
    alert(`Review submitted ${reviewText} and total rating is ${tourRating}`);
  };
  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg='8'>
              <div className='tour__content'>
                <img src={photo} alt={title} className='img-fluid' />
                <div className='tour__info'>
                  <h1>{title}</h1>
                  <div className='d-flex align-items-center gap-5'>
                    <span className='tour__rating d-flex align-items-center gap-1'>
                      <i
                        class='ri-star-fill'
                        style={{ color: 'var(--secondary-color)' }}
                      ></i>{' '}
                      {avgRating === '' ? 0 : avgRating}
                      {totalRating === 0 ? (
                        'No Rated'
                      ) : (
                        <span>({reviews?.length})</span>
                      )}
                    </span>
                    <span>
                      <i class='ri-map-pin-user-fill'></i> {address}
                    </span>
                  </div>
                  <div className='tour__extra-details'>
                    <span>
                      <i class='ri-map-pin-2-line'></i> {city}
                    </span>
                    <span>
                      <i class='ri-money-dollar-circle-line'></i> ${price} /
                      person
                    </span>
                    <span>
                      <i class='ri-map-pin-time-line'></i> {distance} km
                    </span>
                    <span>
                      <i class='ri-group-line'></i> {maxGroupSize}
                    </span>
                  </div>
                  <h5>Description</h5>
                  <p>{desc}</p>
                </div>
                {/* Reviews */}
                <div className='tour__reviews'>
                  <h5>Reviews ({reviews?.length} reviews)</h5>
                  <Form onSubmit={submitHandler}>
                    <div className='d-flex align-items-center gap-1 mb-4 rating__group'>
                      <span onClick={() => setTourRating(1)}>
                        <i class='ri-star-s-fill'></i>
                      </span>
                      <span onClick={() => setTourRating(2)}>
                        <i class='ri-star-s-fill'></i>
                      </span>
                      <span onClick={() => setTourRating(3)}>
                        <i class='ri-star-s-fill'></i>
                      </span>
                      <span onClick={() => setTourRating(4)}>
                        <i class='ri-star-s-fill'></i>
                      </span>
                      <span onClick={() => setTourRating(5)}>
                        <i class='ri-star-s-fill'></i>
                      </span>
                    </div>
                    <div className='review__input'>
                      <input
                        type='text'
                        placeholder='Share your thoughts'
                        ref={reviewMsgRef}
                        required
                      />
                      <button
                        className='btn primary__btn text-white'
                        type='submit'
                      >
                        Submit
                      </button>
                    </div>
                  </Form>
                  <ListGroup className='user__reviews'>
                    {reviews?.map((review, index) => (
                      // <ListGroup.Item key={review.id}>
                      //   <div className='d-flex align-items-center justify-content-between'>
                      //     <div className='d-flex align-items-center gap-3'>
                      //       <img
                      //         src={review.userImg}
                      //         alt={review.userName}
                      //         className='img-fluid'
                      //       />
                      //       <div>
                      //         <h6>{review.userName}</h6>
                      //         <p>{review.date}</p>
                      //       </div>
                      //     </div>
                      //     <div>
                      //       <p>{review.review}</p>
                      //     </div>
                      //   </div>
                      // </ListGroup.Item>

                      <div className='review__item' key={index}>
                        <img src={avatar} alt='avatar image' />
                        <div className='w-100 review__content'>
                          <div className='d-flex align-items-center justify-content-between'>
                            <div>
                              <h6>{review.name}</h6>
                              <p>
                                {new Date('2023-07-07').toDateString(
                                  'en-US',
                                  options
                                )}
                              </p>
                            </div>
                            <span className='d-flex align-items-center gap-1'>
                              <i
                                class='ri-star-fill'
                                style={{ color: 'var(--secondary-color)' }}
                              ></i>{' '}
                              {review.rating}
                            </span>
                          </div>
                          <h5>{review.review}</h5>
                        </div>
                      </div>
                    ))}
                  </ListGroup>
                </div>
              </div>
            </Col>
            <Col lg='4'>
              <Booking tour={tour} avgRating={avgRating} />
            </Col>
          </Row>
        </Container>
      </section>
      <NewsLetter />
    </>
  );
};

export default TourDetails;
