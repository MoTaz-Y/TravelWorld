import { createContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { useCookies } from 'react-cookie';
// import { useLocation } from 'react-router-dom';
import { useReducer } from 'react';

const initial_state = {
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  loading: false,
  error: null,
  // token: null,
};

const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        user: null,
        loading: true,
        error: null,
        // token: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        loading: false,
        error: null,
        // token: action.payload.token,
      };
    case 'LOGIN_FAILURE':
      return {
        user: null,
        loading: false,
        error: action.payload,
        // token: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        user: null,
        loading: true,
        error: null,
        // token: null,
      };
    case 'LOGOUT':
      return {
        user: null,
        loading: false,
        error: null,
        // token: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initial_state);
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
const AuthContext = createContext(initial_state);
export { AuthContext, AuthReducer };

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [cookies, setCookie, removeCookie] = useCookies(['token']);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogin = (token) => {
//     setCookie('token', token, { path: '/' });
//     setUser(token);
//     navigate(location.state?.from?.pathname || '/home');
//   };

//   const handleLogout = () => {
//     removeCookie('token');
//     setUser(null);
//     navigate('/');
//   };

//   useEffect(() => {
//     if (cookies.token) {
//       setUser(cookies.token);
//     }
//   }, [cookies.token]);

//   return (
//     <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
