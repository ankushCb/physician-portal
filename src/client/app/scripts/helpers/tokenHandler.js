export const isTokenPresent = () => (
  !!(window.localStorage.getItem('token'))
);
