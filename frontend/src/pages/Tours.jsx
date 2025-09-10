import { useEffect, useState } from 'react';

import CommonSection from '../Shared/CommonSection';
import '../styles/tours.css';
import NewsLetter from '../Shared/NewsLetter';
import TourCard from '../Shared/TourCard';
import SearchBar from '../Shared/SearchBar';
import { Col, Container, Row } from 'reactstrap';
import { BASE_URL } from '../utils/config';
import useFetch from '../hooks/useFetch';
import Loading from '../components/Loading/Loading';
import Error from '../components/Error/Error';

const Tours = () => {
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const {
    data: tourData,
    loading,
    error,
  } = useFetch(`${BASE_URL}/tours?page=${page}`);
  const { data: tourCount } = useFetch(`${BASE_URL}/tours/count`);
  console.log('tourData', tourData?.data?.data);
  useEffect(() => {
    const total = Number(tourCount?.data?.data ?? 0);
    const limit = 9;
    if (!Number.isFinite(total) || total <= 0) {
      setPageCount(0);
    } else {
      setPageCount(Math.ceil(total / limit));
      window.scrollTo(0, 0);
    }
  }, [page, tourCount, tourData]);
  useEffect(() => {
    if (pageCount > 0 && page > pageCount) {
      setPage(1);
    }
  }, [page, pageCount]);

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
          {loading && <Loading />}
          {error && <Error error={error} />}
          {!loading && !error && (
            <Row>
              {tourData?.data?.data.map((tour) => {
                return (
                  <Col lg='4' md='6' sm='6' key={tour._id} className='mb-4'>
                    <TourCard tour={tour} />
                  </Col>
                );
              })}
              <Col lg='12'>
                <div className='pagination d-flex justify-content-center align-items-center mt-4 gap-3'>
                  {[...Array(pageCount).keys()].map((number) => (
                    <span
                      className={page === number + 1 ? 'active__page' : ''}
                      key={number + 1}
                      onClick={() => setPage(number + 1)}
                    >
                      {number + 1}
                    </span>
                  ))}
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>

      <NewsLetter />
    </>
  );
};

export default Tours;
