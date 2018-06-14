import React from 'react';

const DisplayRefreshButton = () => (
  <div>
    Some Error occured.
    <button
      onClick={() => { location.reload(); }}
    >
      Refresh
    </button>
  </div>
);

export default DisplayRefreshButton;
