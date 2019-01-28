import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';
import dndTypes from '../dndTypes';
import { getWidgetDefinition } from '../utils';
import { widget as widgetPropType, widgetDefinition } from '../../../propTypes/propTypes';
import EditWidget from './EditWidget';

/* eslint-disable react/jsx-no-bind */

const BACKSPACE = 8;
const DELETE = 46;

const editCanvasTarget = {
  canDrop() {
    return true;
  },

  drop(props, monitor) {
    const { x, y } = monitor.getDifferenceFromInitialOffset();
    const { index, warning } = monitor.getItem();

    // This is a fairly ugly hack to compensate for the fact that
    // a warning badge offsets the position by -10 px hor/ver

    const compensation = warning ? 10 : 0;
    props.onMoveWidget(index, x + compensation, y + compensation);
  }
};

class EditCanvas extends Component {
  onMoveWidget(index, x, y) {
    const { onMoveWidget } = this.props;
    onMoveWidget(index, x, y);
  }

  handleSelectWidget(i, event) {
    event.stopPropagation();
    const { onSelectWidget } = this.props;
    if (onSelectWidget) {
      onSelectWidget(i);
    }
  }

  handleKeyDown(event) {
    const { onDeleteWidget, selectedWidgetIndex } = this.props;
    if ([BACKSPACE, DELETE].indexOf(event.keyCode) !== -1) {
      onDeleteWidget(selectedWidgetIndex);
    }
  }

  componentForWidget(widget) {
    return this.definitionForWidget(widget).component;
  }

  definitionForWidget(widget) {
    const { widgetDefinitions } = this.props;
    return getWidgetDefinition(widgetDefinitions, widget.type);
  }

  render() {
    const {
      connectMoveDropTarget,
      connectLibraryDropTarget,
      selectedWidgetIndex,
      widgets
    } = this.props;
    const hasWidgets = widgets.length > 0;

    return connectLibraryDropTarget(
      connectMoveDropTarget(
        <div
          className="Canvas edit"
          onClick={this.handleSelectWidget.bind(this, -1)}
          onKeyDown={this.handleKeyDown.bind(this)}
          role="button"
          tabIndex="0"
        >
          <div className="Placeholder" style={{ opacity: hasWidgets ? 0 : 1 }}>
            Add widgets by dragging them from the library and dropping them on the canvas.
          </div>

          {widgets.map((widget, i) => {
            const Widget = this.componentForWidget(widget);
            const { x, y, device, attribute, params } = widget;

            const definition = this.definitionForWidget(widget);
            const fieldTypes = definition.fields.map(field => field.type);
            const warning =
              (device == null && fieldTypes.indexOf('device') !== -1) ||
              (attribute == null && fieldTypes.indexOf('attribute') !== -1);

            return (
              <EditWidget
                index={i}
                key={i}
                isSelected={selectedWidgetIndex === i}
                x={x}
                y={y}
                onClick={this.handleSelectWidget.bind(this, i)}
                warning={warning}
              >
                <Widget device={device} attribute={attribute} params={params} mode="edit" />
              </EditWidget>
            );
          })}
        </div>
      )
    );
  }
}
EditCanvas.propTypes = {
  connectLibraryDropTarget: PropTypes.func.isRequired,
  connectMoveDropTarget: PropTypes.func.isRequired,
  onDeleteWidget: PropTypes.func.isRequired,
  onMoveWidget: PropTypes.func.isRequired,
  onSelectWidget: PropTypes.func.isRequired,
  selectedWidgetIndex: PropTypes.number.isRequired,
  widgetDefinitions: PropTypes.arrayOf(widgetDefinition).isRequired,
  widgets: PropTypes.arrayOf(widgetPropType).isRequired
};

const moveDropTarget = DropTarget(dndTypes.EDIT_WIDGET, editCanvasTarget, connect => ({
  connectMoveDropTarget: connect.dropTarget()
}));

const addFromLibraryDropTarget = DropTarget(
  dndTypes.LIBRARY_WIDGET,
  {
    canDrop() {
      return true;
    },
    drop(props, monitor, component) {
      const { x: x1, y: y1 } = findDOMNode(component).getBoundingClientRect();
      const { x: x2, y: y2 } = monitor.getClientOffset();
      props.onAddWidget(monitor.getItem().definition, x2 - x1, y2 - y1);
    }
  },
  connect => ({
    connectLibraryDropTarget: connect.dropTarget()
  })
);

export default [moveDropTarget, addFromLibraryDropTarget].reduce(
  (cls, decorator) => decorator(cls),
  EditCanvas
);
