import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getWidgetDefinition } from '../widgets/widgetDefinitions';
import { widget as widgetPropType } from '../../../propTypes/propTypes';

const componentForWidget = widget => getWidgetDefinition(widget.type).component;

class MiniCanvas extends Component {
  deviceForWidget(widget) {
    const { device } = this.props;
    return widget.device === '__parent__' ? device : widget.device;
  }

  valueAndTimeForWidget(widget) {
    const { attributes, mode } = this.props;
    if (mode !== 'run') {
      return {};
    }

    const device = this.deviceForWidget(widget);
    const { attribute } = widget;
    const key = `${device}/${attribute}`;
    return attributes[key] || {};
  }

  render() {
    const { mode, widgets } = this.props;
    if (widgets.length === 0) {
      return <span>Empty</span>;
    }

    const minX = widgets.map(({ x }) => x).reduce((a, b) => Math.min(a, b));
    const minY = widgets.map(({ y }) => y).reduce((a, b) => Math.min(a, b));

    const isLibrary = mode === 'library';

    const style = isLibrary
      ? {
          position: 'relative',
          height: '100px',
          overflow: 'hidden',
          background: `repeating-linear-gradient(
              rgb(232, 239, 249),
              rgb(232, 239, 249) 1px,
              rgba(0, 0, 0, 0) 1px,
              rgba(0, 0, 0, 0) 15px
            ),
            repeating-linear-gradient(
              90deg,
              rgb(232, 239, 249),
              rgb(232, 239, 249) 1px,
              rgba(0, 0, 0, 0) 1px,
              rgba(0, 0, 0, 0) 15px
            )`
        }
      : { width: '300px', height: '200px' };

    const FadeOut = () => (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          boxShadow: 'inset -10px -10px 20px 0px white',
          zIndex: 10000
        }}
      />
    );

    return (
      <div style={style}>
        {isLibrary && <FadeOut />}
        <div className="Canvas">
          {widgets.map((widget, i) => {
            const Widget = componentForWidget(widget);
            const device = this.deviceForWidget(widget);
            const { time, value } = this.valueAndTimeForWidget(widget);
            const { x, y, attribute, params } = widget;

            return (
              <div
                key={i}
                className="Widget"
                style={{
                  position: 'absolute',
                  left: x - minX,
                  top: y - minY
                }}
              >
                <Widget
                  device={device}
                  attribute={attribute}
                  params={params}
                  mode={mode}
                  time={time}
                  value={value}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

MiniCanvas.propTypes = {
  attributes: PropTypes.arrayOf(PropTypes.string),
  device: PropTypes.string,
  mode: PropTypes.string,
  widgets: PropTypes.arrayOf(widgetPropType)
};

MiniCanvas.defaultProps = {
  attributes: [''],
  device: '',
  mode: 'edit',
  widgets: [{}]
};

export default MiniCanvas;
