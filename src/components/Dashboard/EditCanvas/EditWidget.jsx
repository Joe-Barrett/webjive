import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

const WarningBadge = () => (
  <div
    style={{
      position: 'absolute',
      marginLeft: '-10px',
      marginTop: '-10px',
      backgroundColor: 'red',
      borderRadius: '10px',
      width: '20px',
      height: '20px',
      color: 'white',
      textAlign: 'center',
      zIndex: 1000
    }}
  >
    <span className="fa fa-exclamation" />
  </div>
);

class EditWidget extends Component {
  render() {
    const {
      children,
      connectDragSource,
      isDragging,
      isSelected,
      onClick,
      warning,
      x,
      y
    } = this.props;
    if (isDragging) {
      return null;
    }
    return connectDragSource(
      <div
        className={isSelected ? 'Widget selected' : 'Widget'}
        style={{ left: x, top: y }}
        onClick={onClick}
        onKeyDown={onClick}
        role="button"
        tabIndex={0}
      >
        {warning && <WarningBadge />}
        {children}
      </div>
    );
  }
}

const editWidgetSource = {
  beginDrag(props) {
    return {
      index: props.index,
      warning: props.warning
    };
  }
};

function editWidgetCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

EditWidget.propTypes = {
  children: PropTypes.node.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isDragging: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  warning: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};

export default DragSource('EDIT_WIDGET', editWidgetSource, editWidgetCollect)(EditWidget);
