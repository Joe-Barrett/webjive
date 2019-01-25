import React, { Component } from 'react';
import MiniCanvas from './MiniCanvas';

function complexWidgetComponent(canvas) {
  return class ComplexWidget extends Component {
    render() {
      return (
        <MiniCanvas
          device={this.props.device}
          widgets={canvas.widgets}
          attributes={this.props.attributes}
          mode={this.props.mode}
        />
      );
    }
  };
}

export function complexWidgetDefinition(canvas) {
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
