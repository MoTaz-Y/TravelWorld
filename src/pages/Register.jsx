import { Container, Row, Col, Button, Form, FormGroup } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import registerImg from '../assets/images/register.png';
import userIcon from '../assets/images/user.png';
import { useState } from 'react';

const Register = () => {
  const [credentials, setCredentials] = useState({
    Email: undefined,
    Password: undefined,
    userName: undefined,
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
                <img src={registerImg} alt='user' />
              </div>
              <div className='login__form'>
                <div className='user'>
                  <img src={userIcon} alt='user' />
                </div>
                <h2>Register</h2>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    {/* <label htmlFor='email'>Email</label> */}
                    <input
                      type='text'
                      placeholder='Username'
                      id='userName'
                      required
                      onChange={handleChange}
                    />
                  </FormGroup>
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
                    Create Account
                  </Button>
                </Form>
                <p>
                  Already have an account? <Link to='/login'>Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
