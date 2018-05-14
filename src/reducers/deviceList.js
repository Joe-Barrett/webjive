import initialState from './initialState';
import {SET_DEVICES, SET_HIGHLIGHTED_DEVICE} from '../actions/actionTypes';

export default function deviceList(state = initialState.devices, action) {
  switch (action.type) {
    case SET_DEVICES:
      return {...state, devices: action.list.output};
    case SET_HIGHLIGHTED_DEVICE:
      return {...state, highlightedDevice: action.info};
    default:
      return state;
  }
}