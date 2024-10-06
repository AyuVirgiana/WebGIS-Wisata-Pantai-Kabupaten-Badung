import React from 'react';

const Background = (props) => (
  <div className={props.color}>{props.children}</div>
);

export { Background };
