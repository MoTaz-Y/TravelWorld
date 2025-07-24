import '../styles/thank-you.css';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';

function ThankYou() {
  return (
    <section>
      <Container>
        <Row>
          <Col lg='12' className='text-center pt-5'>
            <div className='thank__you'>
              <span>
                <i class='ri-checkbox-circle-line'></i>
              </span>
              <h1 className='mb-3 fw-semibold'>Thank You</h1>
              <h3 className='mb-4'>Your Tour has been successfully booked.</h3>
            </div>
            <Link to='/home'>
              <Button className='btn primary__btn w-25'>Back to Home</Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ThankYou;
