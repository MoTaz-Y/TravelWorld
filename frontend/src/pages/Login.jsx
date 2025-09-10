import { Container, Row, Col, Button, Form, FormGroup } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';
import loginImg from '../assets/images/login.png';
import userIcon from '../assets/images/user.png';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BASE_URL } from '../utils/config';
import { validateEmail } from '../utils/validator.js';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: undefined,
    password: undefined,
  });

  const [emailMsg, setEmailMsg] = useState('');
  const [emailValid, setEmailValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));

    if (id === 'email') {
      const { valid, message } = validateEmail(value);
      setEmailMsg(message);
      setEmailValid(valid);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailValid) {
      setEmailMsg('Please enter a valid email address');
      return;
    }

    if (!credentials.password) {
      alert('Please enter your password');
      return;
    }

    setLoading(true);
    dispatch({ type: 'LOGIN_START' });

    try {
      const res = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.status === 403) {
        // User not verified - redirect to OTP verification
        navigate('/verify-otp', {
          state: {
            email: credentials.email,
            message:
              'Your account is not verified. Please check your email for the verification code.',
          },
        });
        return;
      }

      if (!res.ok) {
        alert(data.message || 'Login failed');
        dispatch({ type: 'LOGIN_FAILURE', payload: data.message });
        return;
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: data.data });
      navigate('/home');
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Network error. Please try again.',
      });
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg='10' className='m-auto'>
            <div className='login__container d-flex justify-content-between'>
              <div className='login__img'>
                <img src={loginImg} alt='user' />
              </div>
              <div className='login__form'>
                <div className='user'>
                  <img src={userIcon} alt='user' />
                </div>
                <h2>Login</h2>
                <p
                  style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    color: '#666',
                    fontSize: '14px',
                  }}
                >
                  Welcome back to TravelWorld! Please sign in to your account.
                </p>

                <Form onSubmit={handleSubmit}>
                  <FormGroup className='form__group-login'>
                    <input
                      type='email'
                      placeholder='Email'
                      id='email'
                      required
                      onChange={handleChange}
                      style={{ paddingRight: '40px' }}
                    />
                    {emailMsg && (
                      <p
                        style={{
                          color: emailValid ? 'green' : 'red',
                          fontSize: '12px',
                          marginTop: '5px',
                        }}
                      >
                        {emailMsg}
                      </p>
                    )}
                  </FormGroup>

                  <FormGroup className='password-field'>
                    <div className='password__field__box'>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Password'
                        id='password'
                        required
                        onChange={handleChange}
                      />
                      <span
                        className='password-toggle'
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Eye /> : <EyeOff />}
                      </span>
                    </div>
                  </FormGroup>

                  <Button
                    color='btn secondary__btn auth__btn'
                    type='submit'
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </Form>

                <p
                  style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    fontSize: '14px',
                  }}
                >
                  Don't have an account?{' '}
                  <Link
                    to='/register'
                    style={{ color: '#667eea', fontWeight: 'bold' }}
                  >
                    Create Account
                  </Link>
                </p>

                <div
                  style={{
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '8px',
                    marginTop: '20px',
                    fontSize: '12px',
                    color: '#666',
                  }}
                >
                  <strong>Note:</strong> Only verified email accounts can log
                  in. If your account is not verified, you'll be redirected to
                  email verification.
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
