import { Container, Row, Col } from 'reactstrap';
import '../styles/profile.css';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
// import { Link } from 'react-router-dom';
import CommonSection from '../Shared/CommonSection';
import { BASE_URL } from '../utils/config';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading/Loading';
import Error from '../components/Error/Error';
import Info from '../components/Info/Info';
import Settings from '../components/Settings/Settings';
import UserBookings from '../components/userBookings/UserBookings';
const Profile = () => {
  const { user } = useContext(AuthContext);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (!user || !user.token) return;

    const fetchUserBookings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/${user._id}`, {
          headers: { 'content-type': 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Please reload the app');
        const data = await res.json();
        setUserBookings(data?.data?.user.bookings || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBookings();
  }, [user]);

  return (
    <>
      <CommonSection title='Profile' />
      <section>
        <Container>
          <Row>
            {/* Sidebar */}
            <Col lg='3' className='border-r pr-4'>
              <ul className='space-y-3'>
                <li
                  className={`tab p-2 rounded ${
                    activeTab === 'info' && 'active__tab'
                  }`}
                  onClick={() => setActiveTab('info')}
                >
                  Info
                </li>
                <li
                  className={`tab p-2 rounded ${
                    activeTab === 'settings' && 'active__tab'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </li>
                <li
                  className={`tab p-2 rounded ${
                    activeTab === 'bookings' && 'active__tab'
                  }`}
                  onClick={() => setActiveTab('bookings')}
                >
                  Bookings
                </li>
              </ul>
            </Col>
            {/* Content */}
            <Col lg='9'>
              {loading && <Loading />}
              {error && <Error error={error} />}

              {!loading && !error && (
                <>
                  {activeTab === 'info' && <Info />}
                  {activeTab === 'settings' && <Settings user={user} />}
                  {activeTab === 'bookings' && (
                    <UserBookings bookings={userBookings} />
                  )}
                </>
              )}
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Profile;
