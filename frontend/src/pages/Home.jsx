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
import experienceImg from '../assets/images/experience.png';
import MasonryImagesGallery from '../components/Image-gallery/MasonryImagesGallery';
import Testimonials from '../components/Testimonial/Testimonials';
import NewsLetter from '../Shared/NewsLetter';

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
              <div className='hero__img-box hero__video-box mt-4'>
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
      {/* Experience section start */}
      <section>
        <Container>
          <Row>
            <Col lg='6' className='mb-5'>
              <div className='experience__content'>
                <Subtitle subtitle={'Experience'} />
                <h2>
                  With our all experience <br /> we will serve you
                </h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  <br />
                  Dignissimos, facilis!
                </p>
              </div>
              <div className='counter__wrapper d-flex gap-5 align-items-center mt-5'>
                <div className='counter__box'>
                  <span>12k+</span>
                  <h6>Successful Trips</h6>
                </div>
                <div className='counter__box'>
                  <span>2k+</span>
                  <h6>Happy Clients</h6>
                </div>
                <div className='counter__box'>
                  <span>12</span>
                  <h6>Years of experience</h6>
                </div>
              </div>
            </Col>
            <Col lg='6' className='mb-5'>
              <div className='experience__img'>
                <img src={experienceImg} alt='' />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* Experience section end */}
      {/* gallery section starts  */}
      <section>
        <Container>
          <Row>
            <Col lg='12' className='mb-5'>
              <Subtitle subtitle={'Gallery'} />
              <h2 className='gallery__title'>
                Visit Our Customer Tour Gallery
              </h2>
            </Col>
            <Col lg='12'>
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>
      {/* gallery section ends  */}
      {/* testimonial section starts  */}
      <section>
        <Container>
          <Row>
            <Col lg='12' className='mb-5'>
              <Subtitle subtitle={'Fans Love'} />
              <h2 className='testimonial__title'>
                What Our Clients Say About Us
              </h2>
            </Col>
            <Col lg='12'>
              <Testimonials />
            </Col>
          </Row>
        </Container>
      </section>
      {/* testimonial section ends  */}
      <NewsLetter />
    </>
  );
};

export default Home;
