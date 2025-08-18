import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, ListGroup } from 'reactstrap';
import '../styles/tour-details.css';
import calculateAvgRating from '../utils/avgRating';
import avatar from '../assets/images/avatar.jpg';
import { useState, useRef, useEffect, useContext } from 'react';
import Booking from '../components/Booking/Booking';
import NewsLetter from '../Shared/NewsLetter.jsx';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';
import Loading from '../components/Loading/Loading';
import Error from '../components/Error/Error';
import { AuthContext } from '../context/AuthContext';
const TourDetails = () => {
  const [tourRating, setTourRating] = useState(0);
  const [reviewsList, setReviewsList] = useState([]);
  const [editingReview, setEditingReview] = useState(null);

  const reviewMsgRef = useRef('');
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { data: tour, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);
  const data = tour?.data?.data || {};
  const { title, desc, address, reviews, city, distance, maxGroupSize } = data;
  const price = data?.price || 0;
  const photo = data?.photo || '';
  console.log('data reviews', reviews);
  const { avgRating, totalRating } = calculateAvgRating(reviews);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };

  useEffect(() => {
    if (reviews) {
      setReviewsList(reviews);
    }
  }, [reviews]);

  // submit request to the server
  const submitHandler = async (e) => {
    e.preventDefault();
    const reviewText = reviewMsgRef.current.value;
    try {
      if (!user || !user.token || user === null || user === undefined) {
        alert('Please login to submit a review');
        return;
      }
      if (reviewText.trim() === '') return;
      const reviewObj = {
        userName: user?.userName,
        review: reviewText,
        rating: tourRating === 0 ? 1 : tourRating,
      };
      let url = `${BASE_URL}/reviews/tours/${id}`;
      let method = 'POST';
      if (editingReview) {
        url = `${BASE_URL}/reviews/${editingReview._id}`;
        method = 'PATCH';
      }
      const res = await fetch(url, {
        method: method,
        headers: {
          'content-type': 'application/json',
          // Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(reviewObj),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
      alert('Review submitted successfully');
      if (editingReview) {
        setReviewsList((prev) =>
          prev.map((r) => (r._id === editingReview._id ? data.data.data : r))
        );
        setEditingReview(null);
      } else {
        setReviewsList((prev) => [...prev, data.data.data]);
      }

      reviewMsgRef.current.value = '';
      setTourRating(0);
      setEditingReview(null);
    } catch (error) {
      alert(error.message);
    }
  };
  const handleEditReview = (review) => {
    setEditingReview(review);
    reviewMsgRef.current.value = review.review;
    setTourRating(review.rating);
  };
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`${BASE_URL}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          // Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.message);
        return;
      }
      setReviewsList((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      alert(err.message);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tour]);
  return (
    <>
      <section>
        <Container>
          {loading && <Loading />}
          {error && <Error error={error} />}
          {!loading && !error && (
            <>
              {' '}
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
                      <h5>Reviews ({reviewsList?.length} reviews)</h5>
                      <Form onSubmit={submitHandler}>
                        <div className='d-flex align-items-center gap-1 mb-4 rating__group'>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              onClick={() => setTourRating(star)}
                              style={{ cursor: 'pointer' }}
                            >
                              <i
                                className='ri-star-s-fill'
                                style={{
                                  color: star <= tourRating ? 'gold' : '#ccc', // ⭐ لو النجمة ≤ rating تلونها ذهبي
                                  fontSize: '1.5rem',
                                }}
                              ></i>
                            </span>
                          ))}
                        </div>
                        <div className='review__input'>
                          <input
                            type='text'
                            placeholder='Share your thoughts'
                            ref={reviewMsgRef}
                            required
                          />
                          {editingReview && (
                            <i
                              className='ri-close-line'
                              style={{
                                fontSize: '1.2rem',
                                color: '#d9534f',
                                cursor: 'pointer',
                                marginRight: '10px',
                              }}
                              onClick={() => {
                                setEditingReview(null);
                                reviewMsgRef.current.value = '';
                                setTourRating(0);
                              }}
                            ></i>
                          )}
                          <button
                            className='btn primary__btn text-white'
                            type='submit'
                          >
                            {editingReview ? 'Update' : 'Submit'}
                          </button>
                        </div>
                      </Form>
                      <ListGroup className='user__reviews'>
                        {reviewsList?.map((review, index) => (
                          <div className='review__item' key={index}>
                            <img src={avatar} alt='avatar image' />
                            <div className='w-100 review__content'>
                              <div className='d-flex align-items-center justify-content-between'>
                                <div>
                                  <h6>{review.userName}</h6>
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
                              <div className='review__actions'>
                                {user?.userName === review.userName && (
                                  <>
                                    <i
                                      className='ri-edit-2-line'
                                      style={{
                                        fontSize: '1.2rem',
                                        color: '#f0ad4e', // لون أصفر/برتقالي للتعديل
                                        cursor: 'pointer',
                                        marginRight: '10px',
                                      }}
                                      onClick={() => handleEditReview(review)}
                                    ></i>
                                    <i
                                      className='ri-delete-bin-6-line'
                                      style={{
                                        fontSize: '1.2rem',
                                        color: '#d9534f', // لون أحمر للحذف
                                        cursor: 'pointer',
                                      }}
                                      onClick={() =>
                                        handleDeleteReview(review._id)
                                      }
                                    ></i>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </ListGroup>
                    </div>
                  </div>
                </Col>
                <Col lg='4'>
                  <Booking tour={data} avgRating={avgRating} />
                </Col>{' '}
              </Row>
            </>
          )}
        </Container>
      </section>
      <NewsLetter />
    </>
  );
};

export default TourDetails;
