import '../styles/thank-you.css';
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';
import { useState, useEffect } from 'react';

function ThankYou() {
  const location = useLocation();
  const { type, message } = location.state || {};
  const [stage, setStage] = useState({});
  useEffect(() => {
    if (type === 'thank you') {
      setStage({
        icon: 'ri-checkbox-circle-line text-success',
        stageTitle: 'Thank You',
        stageDescription: 'Your Tour has been successfully booked.',
        stageButton: 'Back to Home',
        stageLink: '/home',
      });
    } else if (type === 'register') {
      setStage({
        icon: 'ri-checkbox-circle-line text-success',
        stageTitle: 'Thank You',
        stageDescription: 'Your account has been successfully created.',
        stageButton: 'Back to Login',
        stageLink: '/login',
      });
    } else if (type === 'successPayment') {
      setStage({
        icon: 'ri-checkbox-circle-line text-success',
        stageTitle: 'Thank You',
        stageDescription: 'Your payment has been successfully processed.',
        stageButton: 'Back to Profile',
        stageLink: '/profile',
      });
    } else if (type === 'registerFail') {
      setStage({
        icon: 'ri-close-circle-line text-danger',
        stageTitle: 'Sorry',
        stageDescription: message,
        stageButton: 'Back to Login',
        stageLink: '/login',
      });
    }
  }, [type, message]);

  return (
    <section>
      <Container>
        <Row>
          <Col lg='12' className='text-center pt-5'>
            <div className='thank__you'>
              <span>
                <i class={stage.icon}></i>
              </span>
              <h1 className='mb-3 fw-semibold'>{stage.stageTitle}</h1>
              <h3 className='mb-4'>{stage.stageDescription}</h3>
            </div>
            <Link to={stage.stageLink}>
              <Button className='btn primary__btn w-25'>
                {stage.stageButton}
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ThankYou;
