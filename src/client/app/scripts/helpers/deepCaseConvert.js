import reduce from 'lodash/reduce';
import isObject from 'lodash/isObject';
import isArray from 'lodash/isArray';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';

const deepReduce = (object, method) => reduce(object, (result, value, key) => {
  let newValue = value;
  if (isObject(value) && !isArray(value)) {
    newValue = deepReduce(value, method);
  }
  return {
    ...result,
    [method(key)]: newValue,
  };
}, {});

export const deepCamelCase = object => deepReduce(object, camelCase);

export const deepSnakeCase = object => deepReduce(object, snakeCase);

export default {
  deepCamelCase,
  deepSnakeCase,
};
