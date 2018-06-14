/* global Raven */
export const logException = (ex) => {
  Raven.captureException(ex);
};
