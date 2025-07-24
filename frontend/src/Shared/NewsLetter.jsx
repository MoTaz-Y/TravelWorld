import './newsletter.css';
import { Container, Row, Col } from 'reactstrap';
import maleTourist from '../assets/images/male-tourist.png';

const NewsLetter = () => {
  return (
    <section className='newsletter'>
      <Container className='newsletter'>
        <Row>
          <Col lg='6' md='6' sm='12'>
            <div className='newsletter__content'>
              <h2>Subscribe to get latest updates</h2>
              <div className='newsletter__input'>
                <input type='email' placeholder='Enter your email' />
                <button type='submit' className='btn  newsletter__btn'>
                  Subscribe
                </button>
              </div>
              <p>
                Get the latest news and updates from our team directly to your
                inbox
              </p>
            </div>
          </Col>
          <Col lg='6' md='6' sm='12'>
            <div className='newsletter__image'>
              <img src={maleTourist} alt='Tourist' />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default NewsLetter;
