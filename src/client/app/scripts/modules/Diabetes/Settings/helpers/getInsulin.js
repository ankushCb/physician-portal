import replace from 'lodash/replace';
import toString from 'lodash/toString';

import { insulinApi } from '../../../../helpers/api.js';

const insulinApiUrl = insulinApi.getInsulins;

export const getIdFromUrl = fetchUrl => replace(toString(fetchUrl).substr(toString(fetchUrl).indexOf(insulinApiUrl) + insulinApiUrl.length), '/', '');

export const getUrlFromId = id => `${insulinApiUrl}${id}/`;

export default {
  getIdFromUrl,
  getUrlFromId,
};
