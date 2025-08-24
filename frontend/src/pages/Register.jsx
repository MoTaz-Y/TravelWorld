import { Container, Row, Col, Button, Form, FormGroup } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import registerImg from '../assets/images/register.png';
import userIcon from '../assets/images/user.png';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { BASE_URL } from '../utils/config';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
} from '../utils/validator.js';
const Register = () => {
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
    userName: undefined,
  });
  const [emailMsg, setEmailMsg] = useState('');
  const [emailValid, setEmailValid] = useState(null);

  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordValid, setPasswordValid] = useState(null);

  const [confirmPasswordMsg, setConfirmPasswordMsg] = useState('');
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(null);

  const [nameMsg, setNameMsg] = useState('');
  const [nameValid, setNameValid] = useState(null);
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (id === 'email') {
      const { valid, message } = validateEmail(value);
      setEmailMsg(message);
      setEmailValid(valid);
    }

    if (id === 'password') {
      const { valid, message } = validatePassword(value);
      setPasswordMsg(message);
      setPasswordValid(valid);
    }
    if (id === 'confirmPassword') {
      const { valid, message } = validateConfirmPassword(
        value,
        credentials.password
      );
      setConfirmPasswordMsg(message);
      setConfirmPasswordValid(valid);
    }
    if (id === 'userName') {
      const { valid, message } = validateName(value);
      setNameMsg(message);
      setNameValid(valid);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailValid || !passwordValid || !nameValid) {
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      console.log('response', data.message);
      if (res.status === 402) {
        setNameMsg(data.message);
        setNameValid(false);
        return;
      }
      if (!res.ok)
        return navigate('/thank-you', {
          state: { type: 'registerFail', message: data.message },
        });
      dispatch({ type: 'REGISTER_SUCCESS', payload: data.data });
      navigate('/thank-you', { state: { type: 'register' } });
    } catch (err) {
      console.log(err);
      dispatch({ type: 'LOGIN_FAILURE', payload: err.response.data.message });
      alert(err.response.data.message);
    }
  };
  return (
    <section>
      <Container>
        <Row>
          <Col lg='8' md='8' sm='10' className='m-auto'>
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
                  <FormGroup className='form__group-login'>
                    {/* <label htmlFor='email'>Email</label> */}
                    <input
                      type='text'
                      placeholder='Username'
                      id='userName'
                      required
                      onChange={handleChange}
                    />
                    {nameMsg && (
                      <p style={{ color: nameValid ? 'green' : 'red' }}>
                        {nameMsg}
                      </p>
                    )}
                  </FormGroup>
                  <FormGroup className='form__group-login'>
                    {/* <label htmlFor='email'>Email</label> */}
                    <input
                      type='email'
                      placeholder='Email'
                      id='email'
                      required
                      onChange={handleChange}
                    />
                    {emailMsg && (
                      <p style={{ color: emailValid ? 'green' : 'red' }}>
                        {emailMsg}
                      </p>
                    )}
                  </FormGroup>

                  <FormGroup className='form__group-login'>
                    {/* <label htmlFor='password'>Password</label> */}
                    <input
                      type='password'
                      placeholder='Password'
                      id='password'
                      required
                      onChange={handleChange}
                    />
                    {passwordMsg && (
                      <p style={{ color: passwordValid ? 'green' : 'red' }}>
                        {passwordMsg}
                      </p>
                    )}
                  </FormGroup>
                  <FormGroup className='form__group-login'>
                    {/* <label htmlFor='password'>Password</label> */}
                    <input
                      type='password'
                      placeholder='Confirm Password'
                      id='confirmPassword'
                      required
                      onChange={handleChange}
                    />
                    {confirmPasswordMsg && (
                      <p
                        style={{
                          color: confirmPasswordValid ? 'green' : 'red',
                        }}
                      >
                        {confirmPasswordMsg}
                      </p>
                    )}
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
