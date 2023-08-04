import axios from "axios";
import * as actionTypes from "./types";

const SESSION_DURATION = process.env.REACT_APP_SESSION_DURATION;

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

const resetPasswordSuccess = () => {
  return {
    type: actionTypes.RESET_PASSWORD_SUCCESS,
  };
};

const resetPasswordFail = (error) => {
  return {
    type: actionTypes.RESET_PASSWORD_FAIL,
    error: error,
  };
};

export const authLogout = () => {
  const token = localStorage.getItem("token");
  if (token === undefined) {
    localStorage.removeItem("expirationDate");
  } else {
    axios
      .post(
        `${process.env.REACT_APP_API_SERVER}api/auth/logout/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
  }

  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const authCheckTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(authLogout());
    }, expirationTime);
  };
};

export const authLogin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(`${process.env.REACT_APP_API_SERVER}api/auth/login/`, {
        username: username,
        password: password,
      })
      .then((res) => {
        const token = res.data.token;
        const expirationDate = new Date(
          new Date().getTime() + SESSION_DURATION
        );
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token));
        dispatch(authCheckTimeout(SESSION_DURATION));
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const authSignup = (username, email, password1, password2) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(`${process.env.REACT_APP_API_SERVER}api/auth/signup/`, {
        username: username,
        email: email,
        password1: password1,
        password2: password2,
      })
      .then((res) => {
        const token = res.data.token;
        const expirationDate = new Date(
          new Date().getTime() + SESSION_DURATION
        );
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token));
        dispatch(authCheckTimeout(SESSION_DURATION));
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const resetPassword = (resetToken, newPassword, navigate) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(`${process.env.REACT_APP_API_SERVER}api/auth/reset-password/`, {
        resetToken: resetToken,
        newPassword: newPassword,
      })
      .then((res) => {
        dispatch(resetPasswordSuccess());
        navigate("/signin")
      })
      .catch((err) => {
        dispatch(resetPasswordFail(err));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(authLogout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(authLogout());
      } else {
        dispatch(authSuccess(token));
        dispatch(
          authCheckTimeout(expirationDate.getTime() - new Date().getTime())
        );
      }
    }
  };
};
