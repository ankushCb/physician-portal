import moment from 'moment';

import padStart from 'lodash/padStart';

/* for internal use */

/**
 * makes native splice method immutable
 * @param  {Array} array array to be spliced
 * @param  {any} ...args  rest of the arguments passed to splice
 * @return {array}       spliced array
 */
const splice = (array, ...args) => {
  const arr = [...array];
  arr.splice(...args);
  return arr;
};

export const getTimeInSimpleFormat = time => moment(time, 'hh:mm:ss').format('h:mm A');

/**
 * replaces time values in hh:mm:ss format
 */
export const replaceTime = atWhatIndex => (time = '') => newValue =>
 (splice(time.split(':'), atWhatIndex, 1, padStart(String(newValue), 2, '0'))).join(':');
