import './common-section.css';
import { Container, Row, Col } from 'reactstrap';

const CommonSection = ({ title }) => {
  return (
    <section className='common__section'>
      <Container>
        <Row>
          <Col lg='12'>
            <div className='common__section__content'>
              <h1>{title}</h1>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CommonSection;
