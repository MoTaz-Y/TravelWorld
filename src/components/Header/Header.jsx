import React from "react";
import { Container, Row, Button } from "reactstrap";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import "./header.css";
const nav__links = [
  {
    path: "/home",
    display: "Home",
  },
  {
    path: "/about",
    display: "About",
  },
  {
    path: "/tours",
    display: "Tours",
  },
];

const Header = () => {
  return (
    <header className="sticky__header">
      <Container>
        <Row>
          <div className="nav__Wrapper d-flex align-items-center space-between">
            {/* logo starts */}
            <div className="logo">
              <img src={logo} alt="" />
            </div>
            {/* logo end */}
            {/* menu starts */}
            <div className="navigation">
              <div className="menu d-flex align-items-center gap-3">
                {nav__links.map((item, index) => (
                  <li className="nav__item" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? "active__link" : ""
                      }
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </div>
            </div>
            {/* menu ends */}
            <div className="nav__right d-flex align-items-center gap-4">
              <div className="nav__btns d-flex align-items-center gap-4">
                <Button className="btn secondary__btn">
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="btn primary__btn">
                  <Link to="/register">register</Link>
                </Button>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
