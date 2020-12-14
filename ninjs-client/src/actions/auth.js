import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, SET_MESSAGE, CLEAR_MESSAGE } from "./types";

import AuthService from "../api/login";

// axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

export const login = (username, password) => async (dispatch) => {
  return await AuthService.login(username, password).then(
    (data) => {
      // console.log(data);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data },
      });

      dispatch({
        type: CLEAR_MESSAGE,
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString();
      dispatch({
        type: LOGIN_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const logout = () => (dispatch) => {
  AuthService.logout();

  dispatch({
    type: LOGOUT,
  });
};
