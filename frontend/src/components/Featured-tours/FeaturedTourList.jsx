import TourCard from '../../Shared/TourCard';
// import tourData from '../../assets/data/tours';
import { Col } from 'reactstrap';
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';
import Loading from '../Loading/Loading';
import Error from '../Error/Error';

const FeaturedTourList = () => {
  const {
    data: featuredTours,
    loading,
    error,
  } = useFetch(`${BASE_URL}/tours/featured`);
  console.log(featuredTours?.data?.data);
  return (
    <>
      {loading && <Loading />}
      {error && <Error error={error} />}
      {!loading &&
        !error &&
        featuredTours?.data?.data.map((tour) => (
          <Col lg='3' md='4' sm='6' className='mb-4' key={tour._id}>
            <TourCard tour={tour} />
          </Col>
        ))}
    </>
  );
};

export default FeaturedTourList;
