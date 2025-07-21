import React from 'react';
import '../styles/home.css';
import { Container, Row, Col } from 'reactstrap';
import heroImg from '../assets/images/hero-img01.jpg';
import heroImg02 from '../assets/images/hero-img02.jpg';
import herovideo from '../assets/images/hero-video.mp4';
import Subtitle from '../Shared/Subtitle';
import worldImg from '../assets/images/world.png';
import SearchBar from '../Shared/SearchBar';
import ServiceList from '../services/ServiceList';
import FeaturedTours from '../components/Featured-tours/FeaturedTourList';

const Home = () => {
  return (
    <>
      <section>
        <Container>
          <Row>
            <Col lg='6'>
              <div className='hero__content'>
                <div className='hero__subtitle d-flex align-items-center'>
                  <Subtitle subtitle='Know Before You Go' />
                  <img src={worldImg} alt='' />
                </div>
                <h1>
                  Travelling opens the door to creating{' '}
                  <span className="'highlight">memories</span>
                </h1>
                <p>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sit
                  perspiciatis sequi voluptate quibusdam. Qui adipisci maiores,
                  harum dolore, nemo autem commodi odio temporibus quasi
                  delectus quaerat quas nesciunt laborum recusandae?
                </p>
              </div>
            </Col>
            <Col lg='2'>
              <div className='hero__img-box'>
                <img src={heroImg} alt='' />
              </div>
            </Col>
            <Col lg='2'>
              <div className='hero__img-box mt-4'>
                <video src={herovideo} autoPlay controls muted loop alt='' />
              </div>
            </Col>
            <Col lg='2'>
              <div className='hero__img-box mt-5'>
                <img src={heroImg02} alt='' />
              </div>
            </Col>
            <SearchBar />
          </Row>
        </Container>
      </section>
      {/* hero section start */}
      <section>
        <Container>
          <Row>
            <Col lg='3'>
              <h5 className='service__subtitle'>What we serve</h5>
              <h2 className='service__title'>we offer our best services</h2>
            </Col>
            <ServiceList />
          </Row>
        </Container>
      </section>

      {/* service section end */}
      {/* featured tour section start */}
      <section>
        <Container>
          <Row>
            <Col lg='12' className='mb-5'>
              <Subtitle subtitle={'Explore'} />
              <h2 className='featured__tour-title'>Our Featured Tours</h2>
            </Col>
            <FeaturedTours />
          </Row>
        </Container>
      </section>
      {/* featured tour section end */}
    </>
  );
};

export default Home;
