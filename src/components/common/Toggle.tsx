import React from 'react';

const Toggle: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input type="checkbox" {...props} className={`h-5 w-9 rounded-full accent-cyan-500 ${props.className ?? ''}`} />
);

export default Toggle;
export { Toggle };
