import { createContext, useEffect, useReducer } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import { useCookies } from 'react-cookie';
// import { useLocation } from 'react-router-dom';
// import { useReducer } from 'react';

// Helper function to safely parse localStorage
const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      // Validate that user data has required fields
      if (parsed && parsed._id && parsed.email && parsed.userName) {
        return parsed;
      }
    }
    return null;
  } catch (error) {
    console.warn('Error reading user data from localStorage:', error);
    localStorage.removeItem('user'); // Clear corrupted data
    return null;
  }
};

const initial_state = {
  user: getUserFromStorage(),
  loading: false,
  error: null,
};

const AuthReducer = (state, action) => {
  console.log('🔄 AuthContext Action:', action.type, action.payload);

  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      console.log('✅ LOGIN_SUCCESS - User data:', action.payload);
      // Clear any existing data first
      localStorage.removeItem('user');
      // Store new data
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case 'REGISTER_SUCCESS':
      return {
        user: null,
        loading: true,
        error: null,
      };
    case 'LOGOUT':
      console.log('🚪 LOGOUT - Clearing user data');
      // Clear user data
      localStorage.removeItem('user');
      return {
        user: null,
        loading: false,
        error: null,
      };
    case 'UPDATE_USER':
      // Update user data in state and localStorage
      // eslint-disable-next-line no-case-declarations
      const updatedUser = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return {
        user: updatedUser,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initial_state);

  // Listen for changes in localStorage (for multi-tab scenarios)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        if (e.newValue) {
          try {
            const userData = JSON.parse(e.newValue);
            dispatch({ type: 'UPDATE_USER', payload: userData });
          } catch (error) {
            console.warn('Error parsing user data from storage event:', error);
          }
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Debug: Log user state changes
  useEffect(() => {
    console.log('🔍 Auth state changed:', {
      hasUser: !!state.user,
      userName: state.user?.userName,
      role: state.user?.role,
      loading: state.loading,
      error: state.error,
    });
  }, [state]);

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
