import * as actionTypes from "../store/types";

export const initialState = {
  error: null,
  loading: false,
  token: null,
  isAuthenticated: false,
};

const authStartReducer = (state, action) => {
  return {
    ...state,
    error: null,
    loading: true,
  };
};

const authSuccessReducer = (state, action) => {
  return {
    ...state,
    error: null,
    loading: false,
    token: action.token,
    isAuthenticated: true,
  };
};

const authFailReducer = (state, action) => {
  return {
    ...state,
    error: action.error,
    loading: false,
    token: null,
    isAuthenticated: false,
  };
};

const authLogoutReducer = (state, action) => {
  return {
    ...state,
    token: null,
    isAuthenticated: false,
  };
};

const resetPasswordReducer = (state, action) => {
  return {
    ...state,
    error: null,
    loading: false,
  };
};

const resetPasswordFailReducer = (state, action) => {
  return {
    ...state,
    error: action.error
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStartReducer(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccessReducer(state, action);
    case actionTypes.AUTH_FAIL:
      return authFailReducer(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogoutReducer(state, action);
    case actionTypes.RESET_PASSWORD_SUCCESS:
      return resetPasswordReducer(state, action);
    case actionTypes.RESET_PASSWORD_FAIL:
      return resetPasswordFailReducer(state, action);
    default:
      return state;
  }
};

export default reducer;
