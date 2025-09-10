import { useEffect, useRef, useContext } from 'react';
import { Container, Row, Button } from 'reactstrap';
import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';
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
  const menuRef = useRef(null);
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
  const toggleMenu = () => menuRef.current.classList.toggle('show__menu');
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
            <div
              className='navigation'
              ref={menuRef}
              onClick={(e) => {
                if (e.target.classList.contains('navigation')) {
                  toggleMenu();
                }
              }}
            >
              <div className='menu d-flex align-items-center gap-5'>
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
                    <li className='nav__item'>
                      <span className='nav__user'>
                        مرحباً {user.userName}
                        {user.role && (
                          <span className={`role-badge role-${user.role}`}>
                            {user.role === 'admin'
                              ? 'Admin'
                              : user.role === 'manager'
                              ? 'Manager'
                              : user.role === 'guide'
                              ? 'Guide'
                              : 'User'}
                          </span>
                        )}
                      </span>
                    </li>

                    {/* Dashboard button for authorized users */}
                    {(user.role === 'admin' ||
                      user.role === 'manager' ||
                      user.role === 'guide') && (
                      <li className='nav__item'>
                        <Link
                          to='/dashboard'
                          className='nav__link dashboard-link'
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}

                    <li className='nav__item'>
                      <Button
                        onClick={handleLogout}
                        className='nav__link logout-btn'
                      >
                        Logout
                      </Button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className='nav__item'>
                      <Link to='/login' className='nav__link'>
                        Login
                      </Link>
                    </li>
                    <li className='nav__item'>
                      <Link to='/register' className='nav__link register-btn'>
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </div>
              <span className='mobile__menu cursor'>
                <i class='ri-menu-line' onClick={toggleMenu}></i>
              </span>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
