import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MiniCanvas from './MiniCanvas';

/* eslint-disable react/prefer-stateless-function */

function complexWidgetComponent(canvas) {
  return class ComplexWidget extends Component {
    static propTypes = {
      attributes: PropTypes.arrayOf(PropTypes.string),
      device: PropTypes.string,
      mode: PropTypes.string
    };

    static defaultProps = {
      attributes: [''],
      device: '',
      mode: 'edit'
    };

    render() {
      const { attributes, device, mode } = this.props;
      return (
        <MiniCanvas device={device} widgets={canvas.widgets} attributes={attributes} mode={mode} />
      );
    }
  };
}

export default function complexWidgetDefinition(canvas) {
  const { id, name } = canvas;
  return {
    type: `CANVAS_${id}`,
    name,
    component: complexWidgetComponent(canvas),
    fields: ['device'],
    params: [],
    __canvas__: id
  };
}
