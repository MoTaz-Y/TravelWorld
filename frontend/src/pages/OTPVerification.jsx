import { Container, Row, Col, Button, Form, FormGroup } from 'reactstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/login.css';
import registerImg from '../assets/images/register.png';
import userIcon from '../assets/images/user.png';
import { useState, useEffect } from 'react';
import { BASE_URL } from '../utils/config';
import { validateOTP } from '../utils/validator.js';

const OTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [otpMsg, setOtpMsg] = useState('');
  const [otpValid, setOtpValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    // Countdown timer for resend
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
    setOtp(value);

    if (value.length === 6) {
      const { valid, message } = validateOTP(value);
      setOtpMsg(message);
      setOtpValid(valid);
    } else {
      setOtpValid(null);
      setOtpMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpValid || otp.length !== 6) {
      setOtpMsg('Please enter a valid 6-digit OTP');
      setOtpValid(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/users/verify-otp`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store user data and token
        localStorage.setItem('user', JSON.stringify(data.data));
        alert('Email verified successfully! Welcome to TravelWorld!');
        navigate('/home');
      } else {
        setOtpMsg(data.message || 'Verification failed');
        setOtpValid(false);
      }
    } catch (error) {
      setOtpMsg('Network error. Please try again.');
      setOtpValid(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setResendLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/users/resend-otp`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('OTP sent successfully! Please check your email.');
        setCountdown(60);
      } else {
        alert(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    return null; // Will redirect in useEffect
  }
  return (
    <section>
      <Container>
        <Row>
          <Col lg='8' md='8' sm='10' className='m-auto'>
            <div className='login__container d-flex justify-content-between'>
              <div className='login__img'>
                <img src={registerImg} alt='verification' />
              </div>
              <div className='login__form'>
                <div className='user'>
                  <img src={userIcon} alt='user' />
                </div>
                <h2>Verify Your Email</h2>
                <p
                  style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    color: '#666',
                  }}
                >
                  We've sent a 6-digit verification code to:
                  <br />
                  <strong>{email}</strong>
                </p>

                <Form onSubmit={handleSubmit}>
                  <FormGroup className='form__group-login'>
                    <input
                      type='text'
                      placeholder='Enter 6-digit OTP'
                      id='otp'
                      value={otp}
                      onChange={handleChange}
                      maxLength={6}
                      style={{
                        textAlign: 'center',
                        fontSize: '24px',
                        letterSpacing: '8px',
                        fontWeight: 'bold',
                      }}
                      required
                    />
                    {otpMsg && (
                      <p
                        style={{
                          color: otpValid ? 'green' : 'red',
                          textAlign: 'center',
                          marginTop: '10px',
                        }}
                      >
                        {otpMsg}
                      </p>
                    )}
                  </FormGroup>

                  <Button
                    color='btn secondary__btn auth__btn'
                    type='submit'
                    disabled={loading || !otpValid}
                    style={{ marginBottom: '15px' }}
                  >
                    {loading ? 'Verifying...' : 'Verify Email'}
                  </Button>
                </Form>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#666', marginBottom: '10px' }}>
                    Didn't receive the code?
                  </p>
                  <Button
                    color='link'
                    onClick={handleResendOTP}
                    disabled={countdown > 0 || resendLoading}
                    style={{
                      color: countdown > 0 ? '#999' : '#667eea',
                      textDecoration: 'none',
                    }}
                  >
                    {resendLoading
                      ? 'Sending...'
                      : countdown > 0
                      ? `Resend in ${countdown}s`
                      : 'Resend OTP'}
                  </Button>
                </div>

                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Link to='/register' style={{ color: '#667eea' }}>
                    Wrong email? Go back to register
                  </Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default OTPVerification;
