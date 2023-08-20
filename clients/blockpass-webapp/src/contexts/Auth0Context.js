import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { useMixpanel } from 'react-mixpanel-browser';
import axiosInstance from '../utils/axios';
// routes
import { PATH_AUTH } from '../routes/paths';
//
import { AUTH0_API, PATH_AFTER_LOGIN } from '../config';

// ----------------------------------------------------------------------

let auth0Client = null;

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  organization: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, organization } = action.payload;
    return { ...state, isAuthenticated, isInitialized: true, user, organization };
  },
  LOGIN: (state, action) => {
    const { user, organization } = action.payload;
    return { ...state, isAuthenticated: true, user, organization };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    organization: null,
  }),
  REFRESH: (state, action) => {
    const { user } = action.payload;
    const { isAuthenticated, isInitialized, organization } = state;
    return { isAuthenticated, isInitialized, user, organization };
  },
  REFRESH_ORG: (state, action) => {
    const { organization } = action.payload;
    const { isAuthenticated, isInitialized, user } = state;
    return { isAuthenticated, isInitialized, user, organization };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'auth0',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getAccessToken: () => String,
  refreshUser: () => Promise.resolve(),
  refreshOrg: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const mixpanel = useMixpanel();

  useEffect(() => {
    const initialize = async () => {
      try {
        auth0Client = new Auth0Client({
          client_id: AUTH0_API.clientId,
          domain: AUTH0_API.domain,
          authorizationParams: {
          redirect_uri: `${window.location.origin}${PATH_AFTER_LOGIN}`,
          audience: AUTH0_API.audience,
          },
        });

        await auth0Client.checkSession();

        const isAuthenticated = await auth0Client.isAuthenticated();

        if (isAuthenticated) {
          const user = await auth0Client.getUser();
          const token = await auth0Client.getTokenSilently();
          const resp = await axiosInstance.get(`/organizations/${user.org_id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const org = resp.data;
          dispatch({
            type: 'INITIALIZE',
            payload: { isAuthenticated, user, organization: org },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: { isAuthenticated, user: null, organization: null },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: { isAuthenticated: false, user: null, organization: null },
        });
      }
    };

    initialize();
  }, []);

  const login = async () => {
    await auth0Client.loginWithPopup();
    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0Client.getUser();
      const token = await auth0Client.getTokenSilently();
      const resp = await axiosInstance.get(`/organizations/${user.org_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const org = resp.data;
      try {
        if (mixpanel.config.token) {
          mixpanel.identify(user.sub);
          mixpanel.track('Login');
        }
      } catch (err) {
        console.warn('Mixpanel token not present: ', err);
      }

      dispatch({ type: 'LOGIN', payload: { user, organization: org } });
    }
  };

  const logout = () => {
    auth0Client.logout();
    try {
      if (mixpanel.config.token) {
        mixpanel.track('Logout');
      }
    } catch (err) {
      console.warn('Mixpanel token not present: ', err);
    }

    window.location.href = PATH_AUTH.login;
    dispatch({ type: 'LOGOUT' });
  };

  const getAccessToken = async () => {
    const isAuthenticated = await auth0Client.isAuthenticated();
    let accessToken = '';
    if (isAuthenticated) {
      accessToken = await auth0Client.getTokenSilently({ ignoreCache: true });
    }
    return accessToken;
  };

  const refreshUser = async () => {
    try {
      await auth0Client.getTokenSilently({ ignoreCache: true });
    } catch (err) {
      if (err.error !== 'login_required') {
        throw err;
      }
      login();
    }
    const user = await auth0Client.getUser();
    dispatch({ type: 'REFRESH', payload: { user } });
  };

  const refreshOrg = async () => {
    const token = await auth0Client.getTokenSilently();
    const user = await auth0Client.getUser();
    const resp = await axiosInstance.get(`/organizations/${user.org_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (resp.status !== 200) {
      throw Error(resp.data);
    }
    const organization = resp.data;
    dispatch({ type: 'REFRESH_ORG', payload: { organization } });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'auth0',
        user: {
          id: state?.user?.sub,
          photoURL: state?.user?.picture,
          email: state?.user?.email,
          name: state?.user?.name,
          role: 'Admin', // can pull this from user permission object from Auth0
        },
        organization: state?.organization,
        login,
        logout,
        getAccessToken,
        refreshUser,
        refreshOrg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
