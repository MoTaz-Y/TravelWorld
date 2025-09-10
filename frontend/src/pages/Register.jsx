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
import { Eye, EyeOff } from 'lucide-react';

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

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      // Also validate confirm password if it's filled
      if (credentials.confirmPassword) {
        const { valid: confirmValid, message: confirmMessage } =
          validateConfirmPassword(credentials.confirmPassword, value);
        setConfirmPasswordValid(confirmValid);
        setConfirmPasswordMsg(confirmMessage);
      }
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

    if (!emailValid || !passwordValid || !nameValid || !confirmPasswordValid) {
      alert('Please fix all validation errors before submitting');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.status === 401) {
        // Email already exists - stay on register page with error
        setEmailMsg(data.message);
        setEmailValid(false);
        return;
      }

      if (res.status === 402) {
        // Username already exists
        setNameMsg(data.message);
        setNameValid(false);
        return;
      }

      if (!res.ok) {
        // Other validation errors or server errors
        setEmailMsg(data.message || 'Registration failed. Please try again.');
        setEmailValid(false);
        return;
      }

      // Success - redirect to OTP verification
      navigate('/verify-otp', {
        state: {
          email: credentials.email,
          message:
            'Registration successful! Please check your email for verification code.',
        },
      });
    } catch (err) {
      console.log(err);
      setEmailMsg('Network error. Please try again.');
      setEmailValid(false);
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
                <img src={registerImg} alt='user' />
              </div>
              <div className='register__form'>
                <div className='user'>
                  <img src={userIcon} alt='user' />
                </div>
                <h2>Create Account</h2>
                <p
                  style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    color: '#666',
                    fontSize: '14px',
                  }}
                >
                  Join TravelWorld and discover amazing destinations around
                  Egypt!
                </p>

                <Form onSubmit={handleSubmit}>
                  <FormGroup className='form__group-login'>
                    <input
                      type='text'
                      placeholder='Full Name'
                      id='userName'
                      required
                      onChange={handleChange}
                    />
                    {nameMsg && (
                      <p
                        style={{
                          color: nameValid ? 'green' : 'red',
                          fontSize: '12px',
                          marginTop: '5px',
                        }}
                      >
                        {nameMsg}
                      </p>
                    )}
                  </FormGroup>

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

                  <FormGroup className='password-field '>
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
                    {passwordMsg && (
                      <p
                        style={{
                          color: passwordValid ? 'green' : 'red',
                          fontSize: '12px',
                          marginTop: '5px',
                        }}
                      >
                        {passwordMsg}
                      </p>
                    )}
                  </FormGroup>

                  <FormGroup className='password-field'>
                    <div className='password__field__box'>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='Confirm Password'
                        id='confirmPassword'
                        required
                        onChange={handleChange}
                      />
                      <span
                        className='password-toggle'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? <Eye /> : <EyeOff />}
                      </span>
                    </div>
                    {confirmPasswordMsg && (
                      <p
                        style={{
                          color: confirmPasswordValid ? 'green' : 'red',
                          fontSize: '12px',
                          marginTop: '5px',
                        }}
                      >
                        {confirmPasswordMsg}
                      </p>
                    )}
                  </FormGroup>

                  <Button
                    color='btn secondary__btn auth__btn'
                    type='submit'
                    disabled={
                      loading ||
                      !emailValid ||
                      !passwordValid ||
                      !nameValid ||
                      !confirmPasswordValid
                    }
                    style={{ marginTop: '10px' }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </Form>

                <p
                  style={{
                    textAlign: 'center',
                    marginTop: '20px',
                    fontSize: '14px',
                  }}
                >
                  Already have an account?{' '}
                  <Link
                    to='/login'
                    style={{ color: '#667eea', fontWeight: 'bold' }}
                  >
                    Login
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
                  <strong>Note:</strong> After registration, you'll receive a
                  verification code via email to complete your account setup.
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Register;
