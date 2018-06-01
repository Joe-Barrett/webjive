import { createSelector } from 'reselect';
import { getFilter } from './filtering';

const getDevicesState = state => state.devices;

export const getDeviceNames = createSelector(
    getDevicesState,
    state => state.nameList
);

export const getCurrentDevice = createSelector(
    getDevicesState,
    state => state.current
);

export const getCurrentDeviceName = createSelector(
    getCurrentDevice,
    device => device ? device.name : null
);

export const getCurrentDeviceAttributes = createSelector(
    getCurrentDevice,
    device => device ? device.attributes : []
);

export const getCurrentDeviceProperties = createSelector(
    getCurrentDevice,
    device => device ? device.properties : []
);

export const getHasDevices = createSelector(
    getDeviceNames,
    names => names.length > 0
);

export const getFilteredDeviceNames = createSelector(
    getDeviceNames,
    getFilter,
    (names, filter) => names.filter(name => name.toUpperCase().indexOf(filter.toUpperCase()) !== -1)
);

export const getDeviceIsLoading = createSelector(
    getDevicesState,
    state => state.loadingDevice
);

export const getDeviceNamesAreLoading = createSelector(
    getDevicesState,
    state => state.loadingNames
);