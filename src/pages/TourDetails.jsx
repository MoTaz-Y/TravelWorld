import { useParams } from 'react-router-dom';
import { Container, Row, Col, Form, ListGroup } from 'reactstrap';
import tours from '../assets/data/tours';
import '../styles/tour-details.css';
import calculateAvgRating from '../utils/avgRating';
import avatar from '../assets/images/avatar.jpg';

const TourDetails = () => {
  const { id } = useParams();
  console.log(id);
  const tour = tours.find((tour) => tour.id === id);
  console.log(tour);
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
  return (
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
                    <i class='ri-map-money-dollar-line'></i> ${price} / person
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
                <Form>
                  <div className='d-flex align-items-center gap-3 mb-4 rating__group'>
                    <span>
                      1 <i class='ri-star-s-fill'></i>
                    </span>
                    <span>
                      2 <i class='ri-star-s-fill'></i>
                    </span>
                    <span>
                      3 <i class='ri-star-s-fill'></i>
                    </span>
                    <span>
                      4 <i class='ri-star-s-fill'></i>
                    </span>
                    <span>
                      5 <i class='ri-star-s-fill'></i>
                    </span>
                  </div>
                  <div className='review__input'>
                    <input type='text' placeholder='Share your thoughts' />
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
                      <div className='w-100'>
                        <div className='d-flex align-items-center justify-content-between'>
                          <div>
                            <h6>{review.userName}</h6>
                            <p>
                              {new Date('2023-07-07').toDateString('en-US')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </ListGroup>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default TourDetails;
