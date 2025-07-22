import { useEffect, useState } from 'react';

import CommonSection from '../Shared/CommonSection';
import '../styles/tours.css';
import NewsLetter from '../Shared/NewsLetter';
import TourCard from '../Shared/TourCard';
import SearchBar from '../Shared/SearchBar';
import tourData from '../assets/data/tours';
import { Col, Container, Row } from 'reactstrap';

const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPageCount(Math.ceil(tourData.length / 3)); //later we will get from API
  }, [page]);

  return (
    <>
      <CommonSection title='All Tours' />
      <section>
        <Container>
          <Row>
            <SearchBar />
          </Row>
        </Container>
      </section>
      <section className='tours pt-0 '>
        <Container>
          <Row>
            {tourData.map((tour) => {
              return (
                <Col lg='4' md='6' key={tour.id} className='mb-4'>
                  <TourCard tour={tour} />
                </Col>
              );
            })}
            <Col lg='12'>
              <div className='pagination d-flex justify-content-center align-items-center mt-4 gap-3'>
                {[...Array(pageCount).keys()].map((number) => (
                  <span
                    className={page === number ? 'active__page' : ''}
                    key={number}
                    onClick={() => setPage(number)}
                  >
                    {number + 1}
                  </span>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <NewsLetter />
    </>
  );
};

export default Tours;
