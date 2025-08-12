import CommonSection from '../Shared/CommonSection.jsx';
import { Container, Row, Col } from 'reactstrap';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TourCard from '../Shared/TourCard';
import NewsLetter from '../Shared/NewsLetter';
const SearchResult = () => {
  const location = useLocation();
  const [data] = useState(location.state);
  console.log(' data', data.data);
  return (
    <>
      <CommonSection title='Tour Search Result' />
      <section>
        <Container>
          <Row>
            {data.data.length === 0 ? (
              <h4 className='text-center pt-5'>No Tours Found</h4>
            ) : (
              data.data.map((tour) => (
                <Col lg='4' md='6' sm='6' className='mb-4' key={tour._id}>
                  <TourCard tour={tour} />
                </Col>
              ))
            )}
          </Row>
        </Container>
      </section>
      <NewsLetter />
    </>
  );
};

export default SearchResult;
