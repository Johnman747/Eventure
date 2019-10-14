import React from 'react';

// This is one of our simplest components
// It doesn't have local state, so it can be a function component.
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is, so it doesn't need 'connect()'

const Public = () => (
  <div>
    <div>
      <p>
        This Public page is for anyone to read!
      </p>
    </div>
  </div>
);

export default Public;
