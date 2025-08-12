import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import './tour-card.css';
import calculateAvgRating from '../utils/avgRating';
const TourCard = ({ tour }) => {
  const { _id, title, city, photo, price, featured, reviews } = tour;
  // console.log(tour);
  const { avgRating, totalRating } = calculateAvgRating(reviews);

  return (
    <div className='tour__card'>
      <Card>
        <div className='tour__img'>
          <img src={`src/assets/images/${photo}`} alt={title} />
          {featured && <span>Featured</span>}
        </div>
        <CardBody>
          <div className='card__top d-flex justify-content-between align-items-center'>
            <span className='tour__location d-flex align-items-center gap-1'>
              <i class='ri-map-pin-2-line'></i> {city}
            </span>
            <span className='tour__rating d-flex align-items-center gap-1'>
              <i class='ri-star-fill'></i> {avgRating === '' ? 0 : avgRating}
              {totalRating === 0 ? 'No Rated' : <span>({reviews.length})</span>}
            </span>
          </div>
          <h5 className='tour__title'>
            <Link to={`/tours/${_id}`}>{title}</Link>
          </h5>
          <div className='card__bottom d-flex justify-content-between align-items-center mt-3'>
            <h5>
              ${price} <span>/per person</span>
            </h5>
            <button className='btn booking__btn'>
              <Link to={`/tours/${_id}`}>Book Now</Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;
