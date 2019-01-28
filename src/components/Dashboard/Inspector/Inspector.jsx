import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createGQLClient from 'graphql-client';
import { getWidgetDefinition } from '../utils';
import {
  widget as widgetPropType,
  widgetDefinition as widgetDefinitionPropType
} from '../../../propTypes/propTypes';

const sortedDeviceNames = deviceNames =>
  [...deviceNames].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

export default class Inspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceNames: [], // Should be lifted out to higher component in order to reduce data fetching
      attributes: []
    };

    this.handleSelectDevice = this.handleSelectDevice.bind(this);
    this.handleSelectAttribute = this.handleSelectAttribute.bind(this);
    this.gqlClient = createGQLClient({ url: '/db ' });
  }

  componentDidMount() {
    this.callServiceGraphQL(
      `
      query {
        devices {
          name
        }
      }
    `
    )
      .then(res => res.data.devices)
      .then(devices => devices.map(device => device.name))
      .catch(() => [])
      .then(deviceNames =>
        this.setState({
          deviceNames: sortedDeviceNames(deviceNames)
        })
      );

    const { widget } = this.props;
    if (widget != null && widget.device != null) {
      this.fetchAttributes(widget.device);
    }
  }

  componentDidUpdate(prevProps) {
    const { widget } = this.props;
    const oldWidget = prevProps.widget;
    const newWidget = widget;
    const oldDevice = oldWidget ? oldWidget.device : null;
    const newDevice = newWidget ? newWidget.device : null;

    if (newDevice && newDevice !== oldDevice) {
      this.fetchAttributes(newDevice);
    }
  }

  handleSelectDevice(event) {
    const { onDeviceChange } = this.props;
    onDeviceChange(event.target.value);
  }

  handleSelectAttribute(event) {
    const { onAttributeChange } = this.props;
    onAttributeChange(event.target.value);
  }

  fetchAttributes(device) {
    this.setState({
      attributes: []
    });

    this.callServiceGraphQL(
      `
      query FetchNames($device: String!) {
        device(name: $device) {
          attributes {
            name
            dataformat
            datatype
          }
        }
      }
  `,
      { device }
    )
      .then(res => res.data.device.attributes)
      .catch(() => [])
      .then(attributes => this.setState({ attributes }));
  }

  inputForParam(param, value) {
    const {
      onParamChange,
      widget: { type },
      widgetDefinitions
    } = this.props;
    const widgetDefinition = getWidgetDefinition(widgetDefinitions, type);
    const paramDefinition = widgetDefinition.params.find(paramDef => paramDef.name === param);

    switch (paramDefinition.type) {
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={value}
            onChange={e => onParamChange(param, e.target.checked)}
          />
        );
      case 'string':
        return (
          <input type="text" value={value} onChange={e => onParamChange(param, e.target.value)} />
        );
      case 'number':
        return (
          <input
            type="text"
            value={value}
            onChange={e => onParamChange(param, Number(e.target.value))}
          />
        );
      default:
        return (
          <span>
            No input for parameter type &quot;
            {paramDefinition.type}
            &quot;
          </span>
        );
    }
  }

  callServiceGraphQL(query, variables) {
    return this.gqlClient.query(query, variables || {}, (req, res) => {
      if (res.status === 401) {
        throw new Error('Not authorized');
      }
    });
  }

  filteredAttributes(definition) {
    const { attributes } = this.state;
    return attributes
      .filter(({ dataformat }) => {
        const field = definition.fields.find(f => f.type === 'attribute');
        const { dataformats } = field || {};
        return dataformats == null || dataformats.indexOf(dataformat) !== -1;
      })
      .filter(({ datatype }) => {
        const field = definition.fields.find(f => f.type === 'attribute');
        const onlyNumeric = field != null && field.onlyNumeric;
        if (!onlyNumeric) {
          return true;
        }
        const numericTypes = [
          'DevDouble',
          'DevFloat',
          'DevLong',
          'DevLong64',
          'DevShort',
          'DevUChar',
          'DevULong',
          'DevULong64',
          'DevUShort'
        ];
        return numericTypes.indexOf(datatype) !== -1;
      });
  }

  render() {
    const { isRootCanvas, widget, widgetDefinitions } = this.props;
    const { deviceNames } = this.state;

    if (widget == null) {
      return null;
    }

    const { type, params, device, attribute } = widget;
    const definition = getWidgetDefinition(widgetDefinitions, type);
    const { fields } = definition;
    const paramDefinitions = definition.params;

    const attributeChooser =
      device === '__parent__' ? (
        <input
          className="form-control"
          type="text"
          value={attribute || ''}
          onChange={this.handleSelectAttribute}
        />
      ) : (
        <select
          className="form-control"
          value={attribute || ''}
          onChange={this.handleSelectAttribute}
          disabled={device == null}
        >
          {attribute == null && (
            <option value="" disabled>
              {device ? 'None' : 'Select Device First'}
            </option>
          )}
          {this.filteredAttributes(definition).map(({ name }, i) => (
            <option key={i} value={name}>
              {name}
            </option>
          ))}
        </select>
      );

    const fieldTypes = fields.map(field => field.type);

    return (
      <div className="Inspector">
        <h1>Inspector</h1>
        {fields.length > 0 && (
          <table>
            <tbody>
              {fieldTypes.indexOf('device') !== -1 && (
                <tr>
                  <td>Device:</td>
                  <td>
                    <select
                      className="form-control"
                      value={device || ''}
                      onChange={this.handleSelectDevice}
                    >
                      {device == null && (
                        <option value="" disabled>
                          None
                        </option>
                      )}
                      {isRootCanvas === false && <option value="__parent__">Parent Device</option>}
                      {deviceNames.map((name, i) => (
                        <option key={i} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              )}
              {fieldTypes.indexOf('attribute') !== -1 && (
                <tr>
                  <td>Attribute:</td>
                  <td>{attributeChooser}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {paramDefinitions.length * fields.length > 0 && <hr />}
        <table>
          <tbody>
            {paramDefinitions.map(({ name, description }) => (
              <tr key={name}>
                <td>{description || name}:</td>
                <td>{this.inputForParam(name, params[name])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

Inspector.propTypes = {
  isRootCanvas: PropTypes.bool.isRequired,
  onAttributeChange: PropTypes.func.isRequired,
  onDeviceChange: PropTypes.func.isRequired,
  onParamChange: PropTypes.func.isRequired,
  widget: widgetPropType.isRequired,
  widgetDefinitions: PropTypes.arrayOf(widgetDefinitionPropType).isRequired
};
