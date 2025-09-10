import { Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import './tour-card.css';
import calculateAvgRating from '../utils/avgRating';

const TourCard = ({ tour }) => {
  const { _id, title, city, photos, price, featured, reviews } = tour;

  // Get first photo from photos array (Cloudinary URL)
  const photo = photos && photos.length > 0 ? photos[0].url : '';

  const { avgRating, totalRating } = calculateAvgRating(reviews);

  // Function to truncate title to fit in 2 lines
  const truncateTitle = (text, maxLength = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const displayTitle = truncateTitle(title);

  return (
    <div className='tour__card'>
      <Card>
        <div className='tour__img'>
          <img
            src={photo || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={title}
            loading='lazy'
          />
          {featured && <span>Featured</span>}
        </div>

        <CardBody>
          <div className='card__top d-flex justify-content-between align-items-center'>
            <span className='tour__location d-flex align-items-center gap-1'>
              <i className='ri-map-pin-2-line'></i> {city}
            </span>
            <span className='tour__rating d-flex align-items-center gap-1'>
              <i className='ri-star-fill'></i>{' '}
              {avgRating === 0 ? 'New' : avgRating}
              {totalRating === 0 ? '' : <span>({reviews?.length})</span>}
            </span>
          </div>

          <h5 className='tour__title'>
            <Link to={`/tours/${_id}`} title={title}>
              {displayTitle}
            </Link>
          </h5>

          <div className='card__bottom d-flex justify-content-between align-items-center'>
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
