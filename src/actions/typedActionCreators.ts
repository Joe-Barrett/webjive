import {
  IPreloadUserAction,
  IPreloadUserSuccessAction,
  IPreloadUserFailedAction,
  ILogoutAction,
  ILogoutSuccessAction,
  ILoginSuccessAction,
  ILoginFailedAction
} from './typedActions';

import {
  PRELOAD_USER,
  PRELOAD_USER_FAILED,
  PRELOAD_USER_SUCCESS,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILED
} from './actionTypes';

interface IUser {
  username: string;
}

export function preloadUserSuccess(user: IUser): IPreloadUserSuccessAction {
  const username = user.username;
  return { username, type: PRELOAD_USER_SUCCESS };
}

export function login(username: string, password: string) {
  return { username, password, type: LOGIN };
}

export function loginSuccess(user: IUser): ILoginSuccessAction {
  const username = user.username;
  return { username, type: LOGIN_SUCCESS };
}

export function loginFailed(): ILoginFailedAction {
  return { type: LOGIN_FAILED };
}

export function preloadUser(): IPreloadUserAction {
  return { type: PRELOAD_USER };
}

export function preloadUserFailed(): IPreloadUserFailedAction {
  return { type: PRELOAD_USER_FAILED };
}

export function logout(): ILogoutAction {
  return { type: LOGOUT };
}

export function logoutSuccess(): ILogoutSuccessAction {
  return { type: LOGOUT_SUCCESS };
}
