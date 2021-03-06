import { createSelector } from 'reselect';
import { objectValues, unique } from '../utils';
import getCommandOutputState from './commandOutput';

const getAttributesState = state => state.attributes;
const getCommandsState = state => state.commands;
const getPropertiesState = state => state.properties;

export function getCurrentDeviceName(state) {
  return state.currentDevice;
}

function getDevices(state) {
  return state.devices;
}

const getCurrentDevice = createSelector(
  getDevices,
  getCurrentDeviceName,
  (devices, name) => devices[name]
);

export const getCurrentDeviceServer = createSelector(
  getCurrentDevice,
  device => device.server
);

export const getCurrentDeviceAttributes = createSelector(
  getAttributesState,
  getCurrentDeviceName,
  (attributes, current) => objectValues(attributes[current])
);

export const getCurrentDeviceCommands = createSelector(
  getCommandsState,
  getCurrentDeviceName,
  (commands, current) => objectValues(commands[current])
);

export const getCurrentDeviceProperties = createSelector(
  getPropertiesState,
  getCurrentDeviceName,
  (properties, current) => objectValues(properties[current])
);

export const getCurrentDeviceStateValue = createSelector(
  getCurrentDevice,
  device => (device || {}).state
);

export const getAvailableDataFormats = createSelector(
  getCurrentDeviceAttributes,
  attrs => unique(attrs.map(attr => attr.dataformat))
);

export const getDispLevels = createSelector(
  getCurrentDeviceCommands,
  getCurrentDeviceAttributes,
  (commands, attributes) =>
    Object.keys(
      commands
        .map(command => command.displevel)
        .concat(attributes.map(attribute => attribute.displevel))
        .reduce((accum, displevel) => ({ ...accum, [displevel]: true }), {})
    )
);

export const getCurrentDeviceCommandOutputs = createSelector(
  getCurrentDeviceName,
  getCommandOutputState,
  (name, output) => output[name] || {}
);

export const getCurrentDeviceHasProperties = createSelector(
  getCurrentDeviceProperties,
  props => props.length > 0
);

export const getCurrentDeviceHasAttributes = createSelector(
  getCurrentDeviceAttributes,
  attrs => attrs.length > 0
);

export const getCurrentDeviceHasCommands = createSelector(
  getCurrentDeviceCommands,
  cmds => cmds.length > 0
);
