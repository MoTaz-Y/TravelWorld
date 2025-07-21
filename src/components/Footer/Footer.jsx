import './footer.css';
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png';

const quick__links = [
  {
    path: '/home',
    display: 'Home',
  },
  {
    path: '/about',
    display: 'About',
  },
  {
    path: '/tours',
    display: 'Tours',
  },
];
const quick__links2 = [
  {
    path: '/gallery',
    display: 'Gallery',
  },
  {
    path: '/login',
    display: 'Login',
  },
  {
    path: '/register',
    display: 'Register',
  },
];
const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className='footer'>
      <Container>
        <Row>
          <Col lg='3' md='6' sm='12'>
            <div className='logo'>
              <img src={logo} alt='logo' />
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus,
                quod.
              </p>{' '}
              <div className='social__links d-flex align-items-center gap-4'>
                <span>
                  <Link to='#'>
                    <i className='ri-youtube-line'></i>
                  </Link>{' '}
                </span>
                <span>
                  <Link to='#'>
                    <i className='ri-github-fill'></i>
                  </Link>{' '}
                </span>
                <span>
                  <Link to='#'>
                    {' '}
                    <i className='ri-facebook-circle-line'></i>
                  </Link>{' '}
                </span>
                <span>
                  <Link to='#'>
                    {' '}
                    <i className='ri-instagram-fill'></i>
                  </Link>{' '}
                </span>
              </div>
            </div>
          </Col>
          <Col lg='3' md='6' sm='12'>
            <h5 className='footer__link-title'>Discover</h5>
            <ListGroup className='footer__quick-links' flush>
              {quick__links.map((item, index) => (
                <ListGroupItem key={index}>
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg='3' md='6' sm='12'>
            <h5 className='footer__link-title'>Quick Links</h5>
            <ListGroup className='footer__quick-links' flush>
              {quick__links2.map((item, index) => (
                <ListGroupItem key={index}>
                  <Link to={item.path}>{item.display}</Link>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col lg='3' md='6' sm='12'>
            <h5 className='footer__link-title'>Quick Links</h5>
            <ListGroup className='footer__quick-links' flush>
              <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3'>
                <h6 className='mb-0 d-flex align-items-center gap-2'>
                  <span>
                    <i className='ri-map-pin-line'></i>
                  </span>
                  Address:
                </h6>
                <p className='mb-0'> Nasr City, Egypt</p>
              </ListGroupItem>
              <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3'>
                <h6 className='mb-0 d-flex align-items-center gap-2'>
                  <span>
                    <i className='ri-mail-line'></i>
                  </span>
                  Email:
                </h6>
                <p className='mb-0'>LkK0k@example.com</p>
              </ListGroupItem>
              <ListGroupItem className='ps-0 border-0 d-flex align-items-center gap-3'>
                <h6 className='mb-0 d-flex align-items-center gap-2'>
                  <span>
                    <i className='ri-phone-fill'></i>
                  </span>
                  Phone:
                </h6>
                <p className='mb-0'>+0123456789</p>
              </ListGroupItem>
            </ListGroup>
          </Col>
        </Row>
      </Container>
      <div className='footer__copyright'>
        <p className='text-center'>
          Copyright &copy; {year} Designed and Developed by{' '}
          <span>Motaz Yasser</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
