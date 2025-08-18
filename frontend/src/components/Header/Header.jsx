import { useEffect, useRef, useContext } from 'react';
import { Container, Row, Button } from 'reactstrap';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { AuthContext } from '../../context/AuthContext';
// import { BASE_URL } from '../../utils/config';
import { useNavigate } from 'react-router-dom';
import './header.css';
const nav__links = [
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

const Header = () => {
  const headerRef = useRef(null);
  const navigate = useNavigate();
  const { user, dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    // are you sure you want to logout popup
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch({ type: 'LOGOUT' });
      navigate('/');
    } else {
      return;
    }
  };
  useEffect(() => {
    const stickyHeaderFunc = () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add('sticky__header');
      } else {
        headerRef.current.classList.remove('sticky__header');
      }
    };
    window.addEventListener('scroll', stickyHeaderFunc);
    return () => {
      window.removeEventListener('scroll', stickyHeaderFunc);
    };
  }, []);
  return (
    <header className='header' ref={headerRef}>
      <Container>
        <Row>
          <div className='nav__Wrapper d-flex align-items-center space-between'>
            {/* logo starts */}
            <div className='logo'>
              <img src={logo} alt='' />
            </div>
            {/* logo end */}
            {/* menu starts */}
            <div className='navigation'>
              <div className='menu d-flex align-items-center gap-3'>
                {nav__links.map((item, index) => (
                  <li className='nav__item' key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? 'active__link' : ''
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </div>
            </div>
            {/* menu ends */}
            <div className='nav__right d-flex align-items-center gap-4'>
              <div className='nav__btns d-flex align-items-center gap-4'>
                {user ? (
                  <>
                    <h5 className='mb-0'>{user.userName}</h5>
                    <Button className='btn btn-dark' onClick={handleLogout}>
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className='btn secondary__btn'>
                      <Link to='/login'>Login</Link>
                    </Button>
                    <Button className='btn primary__btn'>
                      <Link to='/register'>register</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
