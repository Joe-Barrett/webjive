import { shape, number, string, arrayOf, func, object, instanceOf } from 'prop-types';

export const widgetPropType = shape({
  attribute: string,
  device: string,
  params: object,
  type: string,
  date: instanceOf(Date),
  x: number,
  y: number
});

export const widgetDefinitionPropType = shape({
  component: func,
  fields: arrayOf(string),
  name: string,
  params: arrayOf(object),
  type: string
});

export const libraryWidgetDefinition = shape({
  component: func,
  field: arrayOf(string),
  name: string,
  params: arrayOf(object),
  type: string
});

export const subCanvas = shape({
  id: number,
  name: string,
  widgets: arrayOf(widgetPropType)
});

export const command = arrayOf(
  shape({
    displevel: string,
    inttype: string,
    intypedesc: string,
    name: string,
    outtype: string,
    outtypedesc: string,
    tag: number
  })
);
