import { Container, Row, Col, Button, Form, FormGroup } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import loginImg from '../assets/images/login.png';
import userIcon from '../assets/images/user.png';
import { useState } from 'react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    Email: undefined,
    Password: undefined,
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    console.log(credentials);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home');
  };
  return (
    <section>
      <Container>
        <Row>
          <Col lg='8' className='m-auto'>
            <div className='login__container d-flex justify-content-between'>
              <div className='login__img'>
                <img src={loginImg} alt='user' />
              </div>
              <div className='login__form'>
                <div className='user'>
                  <img src={userIcon} alt='user' />
                </div>
                <h2>Login</h2>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    {/* <label htmlFor='email'>Email</label> */}
                    <input
                      type='email'
                      placeholder='Email'
                      id='email'
                      required
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    {/* <label htmlFor='password'>Password</label> */}
                    <input
                      type='password'
                      placeholder='Password'
                      id='password'
                      required
                      onChange={handleChange}
                    />
                  </FormGroup>
                  <Button
                    color='btn secondary__btn auth__btn'
                    type='submit'
                    onClick={handleSubmit}
                  >
                    Login
                  </Button>
                </Form>
                <p>
                  Don't have an account? <Link to='/register'>Register</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
